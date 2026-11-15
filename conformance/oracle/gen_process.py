"""Oracle cases for src/process: subsetting a PMO and exporting tables from it.

The functions are ``PMOProcessor`` (filters, name lookups, counts) and
``PMOExporter`` (tables) from pmotools-python. Each case names a fixture PMO
instead of carrying it, to keep the case files small:

- ``full``: the PMO the merge oracle builds from every example input
  (``cases/merge/example-full-nine-inputs.json``): 50 specimens, 49 library
  samples, 276 targets, one run, every optional section.
- ``small``: a hand-made PMO with two runs, two panels, a genome, travel
  records, a specimen with no library sample, a library sample shared by two
  panels' worth of specimens, read counts per target, and a target with no
  representative microhaplotypes. Written to ``cases/process/fixtures/``.

A PMO-valued result is also checked against the 1.1.0 schema, recorded as
``schema_validation``, so the TypeScript side can see where Python writes an
invalid PMO.

Run from ``conformance/``: ``.venv/bin/python -m oracle.gen_process``
"""

from __future__ import annotations

import copy
import json
import shutil
from typing import Any

import pandas as pd
from pmotools.pmo_engine.pmo_checker import PMOChecker, load_schema_by_version
from pmotools.pmo_engine.pmo_exporter import PMOExporter
from pmotools.pmo_engine.pmo_processor import PMOProcessor

from oracle.common import CASES, run_case

OUT = CASES / "process"
FIXTURES = OUT / "fixtures"
CHECKER = PMOChecker(load_schema_by_version("1.1.0"))

# ---------------------------------------------------------------------------
# Divergences (see AGENTS.md "Matching Python")
# ---------------------------------------------------------------------------

OFF_BY_ONE = (
    "Python checks ids with `id > len(...)`, so an id equal to the length passes "
    "the check and then fails with an IndexError, and a negative id silently picks "
    "a record from the end. pmotools-ts refuses any id outside 0..length-1 with a "
    "PmoError."
)
NO_RUN_ID = (
    "Python reads detected_microhaplotypes[...]['bioinformatics_run_id'] "
    "unconditionally and fails with a KeyError when a run has none (it is optional "
    "in 1.1.0). pmotools-ts copies the id when present and leaves it out otherwise."
)
LIST_CELL = (
    "Python copies each method's fields into the row as they are, so "
    "additional_argument (a list) lands in one cell as a list, which a delimited "
    "file cannot hold. pmotools-ts joins it with the separator, as every other "
    "exporter does with lists."
)
SET_ORDER = (
    "Python collects the chosen ids in a set and writes specimens and library "
    "samples in set order, which for ids of 32 and above is not their order in the "
    "file (here 0, 33, 3, 36, ...). pmotools-ts keeps the file's order. The same "
    "records are kept."
)
EMPTY_SORT = (
    "With nothing to count, Python builds an empty DataFrame with no columns and "
    "then fails sorting it by a column it does not have (KeyError). pmotools-ts "
    "returns the table with its columns and no rows."
)
NO_RUN_ID_ALLELES = (
    "extract_allele_counts_freq_from_pmo reads bioinformatics_run_id "
    "unconditionally and fails with a KeyError when a run has none. The two "
    "count_* functions name such a run detected_microhaplotypes_count_idx_<n>; "
    "pmotools-ts does the same here."
)
UNKNOWN_NAME = (
    "Python looks names up in a dict and fails with a KeyError naming the first "
    "unknown one. pmotools-ts throws a PmoError listing every unknown name."
)

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


def _loc(chrom: str, start: int, end: int, **extra: Any) -> dict:
    return {"chrom": chrom, "start": start, "end": end, "genome_id": 0, **extra}


def _target(name: str, start: int, **extra: Any) -> dict:
    return {
        "target_name": name,
        "forward_primer": {"seq": "ACGTAC", "location": _loc("chr1", start, start + 6)},
        "reverse_primer": {"seq": "TTGACA"},
        "insert_location": _loc("chr1", start + 6, start + 60, strand="+"),
        **extra,
    }


def _mhaps(*pairs: tuple[int, int], **extra: Any) -> list:
    return [{"mhap_id": mhap, "reads": reads, **extra} for mhap, reads in pairs]


SMALL: dict = {
    "pmo_header": {
        "pmo_version": "1.1.0",
        "creation_date": "2025-01-01",
        "generation_method": {"program_name": "hand", "program_version": "1"},
    },
    "project_info": [
        {"project_name": "P1", "project_description": "First project"},
        {
            "project_name": "P2",
            "project_description": "Second project",
            "project_contributors": ["Ana", "Ben"],
        },
    ],
    "targeted_genomes": [
        {
            "name": "Pf3D7",
            "genome_version": "2020-09-01",
            "taxon_id": [5833],
            "url": "https://example.org/genome.fasta",
            "chromosomes": ["chr1", "chr2"],
        }
    ],
    "panel_info": [
        {
            "panel_name": "panelA",
            "reactions": [
                {"reaction_name": "r1", "panel_targets": [0, 1]},
                {"reaction_name": "r2", "panel_targets": [2]},
            ],
        },
        {
            "panel_name": "panelB",
            "reactions": [{"reaction_name": "r1", "panel_targets": [1, 3]}],
        },
    ],
    "target_info": [
        _target("t1", 100, gene_name="crt"),
        _target("t2", 200, target_attributes=["drug", "diversity"]),
        _target("t3", 300),
        _target("t4", 400),
    ],
    "specimen_info": [
        {
            "specimen_name": "s1",
            "project_id": 0,
            "collection_country": "Mali",
            "collection_date": "2023-05",
            "host_taxon_id": 9606,
            "specimen_taxon_id": [5833],
            "drug_usage": ["AL", "SP"],
        },
        {
            "specimen_name": "s2",
            "project_id": 1,
            "collection_country": "Ghana",
            "collection_date": "2024",
            "host_taxon_id": 9606,
            "specimen_taxon_id": [5833],
            "travel_out_six_month": [
                {
                    "travel_country": "Togo",
                    "travel_start_date": "2024-01-01",
                    "travel_end_date": "2024-01-10",
                    "bed_net_usage": 0.5,
                }
            ],
        },
        {
            "specimen_name": "s3",
            "project_id": 0,
            "collection_country": "Mali",
            "collection_date": "2024",
            "host_taxon_id": 9606,
            "specimen_taxon_id": [5833],
        },
        {
            "specimen_name": "s4",
            "project_id": 1,
            "collection_country": "Ghana",
            "host_taxon_id": 9606,
            "specimen_taxon_id": [5833],
        },
    ],
    "sequencing_info": [
        {
            "sequencing_info_name": "seq1",
            "seq_platform": "ILLUMINA",
            "seq_instrument_model": "MiSeq",
            "library_layout": "PAIRED",
            "library_strategy": "AMPLICON",
            "library_source": "GENOMIC",
            "library_selection": "PCR",
        },
        {
            "sequencing_info_name": "seq2",
            "seq_platform": "ILLUMINA",
            "seq_instrument_model": "NextSeq",
            "library_layout": "PAIRED",
            "library_strategy": "AMPLICON",
            "library_source": "GENOMIC",
            "library_selection": "PCR",
        },
    ],
    "library_sample_info": [
        {"library_sample_name": "L1", "specimen_id": 0, "panel_id": 0, "sequencing_info_id": 0},
        {
            "library_sample_name": "L2",
            "specimen_id": 1,
            "panel_id": 0,
            "sequencing_info_id": 0,
            "alternate_identifiers": ["L2-a", "L2-b"],
        },
        {"library_sample_name": "L3", "specimen_id": 0, "panel_id": 1, "sequencing_info_id": 1},
        {"library_sample_name": "L4", "specimen_id": 3, "panel_id": 1, "sequencing_info_id": 1},
    ],
    "bioinformatics_methods_info": [
        {
            "methods": [
                {"program": "cutadapt", "program_version": "4.4", "additional_argument": ["-e", "0"]},
                {"program": "dada2", "program_version": "1.26"},
            ]
        }
    ],
    "bioinformatics_run_info": [
        {"bioinformatics_run_name": "runA", "bioinformatics_methods_id": 0, "run_date": "2024-06-01"},
        {"bioinformatics_run_name": "runB", "bioinformatics_methods_id": 0},
    ],
    "representative_microhaplotypes": {
        "targets": [
            {
                "target_id": 0,
                "microhaplotypes": [{"seq": "AAAA"}, {"seq": "AAAT", "microhaplotype_name": "t1-b"}],
            },
            {"target_id": 1, "microhaplotypes": [{"seq": "CCCC"}, {"seq": "CCCG", "quality": "IIII"}]},
            {"target_id": 3, "microhaplotypes": [{"seq": "GGGG"}]},
        ]
    },
    "detected_microhaplotypes": [
        {
            "bioinformatics_run_id": 0,
            "library_samples": [
                {
                    "library_sample_id": 0,
                    "target_results": [
                        {"mhaps_target_id": 0, "mhaps": _mhaps((0, 120), (1, 8))},
                        {"mhaps_target_id": 1, "mhaps": _mhaps((0, 45))},
                    ],
                },
                {
                    "library_sample_id": 1,
                    "target_results": [
                        {"mhaps_target_id": 0, "mhaps": _mhaps((1, 3), umis=2)},
                        {"mhaps_target_id": 1, "mhaps": _mhaps((1, 300))},
                    ],
                },
            ],
        },
        {
            "bioinformatics_run_id": 1,
            "library_samples": [
                {
                    "library_sample_id": 2,
                    "target_results": [
                        {"mhaps_target_id": 1, "mhaps": _mhaps((0, 60))},
                        {"mhaps_target_id": 2, "mhaps": _mhaps((0, 9))},
                    ],
                },
                {
                    "library_sample_id": 3,
                    "target_results": [{"mhaps_target_id": 2, "mhaps": _mhaps((0, 75))}],
                },
            ],
        },
    ],
    "read_counts_by_stage": [
        {
            "bioinformatics_run_id": 0,
            "read_counts_by_library_sample_by_stage": [
                {
                    "library_sample_id": 0,
                    "total_raw_count": 1000,
                    "read_counts_for_targets": [
                        {"target_id": 0, "stages": [{"stage": "filtered", "reads": 130}]},
                        {"target_id": 2, "stages": [{"stage": "filtered", "reads": 0}]},
                    ],
                },
                {"library_sample_id": 1, "total_raw_count": 500},
            ],
        }
    ],
}


def _full() -> dict:
    case = json.loads((CASES / "merge" / "example-full-nine-inputs.json").read_text())
    return case["result"]["value"]


def write_fixtures() -> dict[str, dict]:
    fixtures = {"small": SMALL, "full": _full()}
    FIXTURES.mkdir(parents=True, exist_ok=True)
    for name, pmo in fixtures.items():
        CHECKER.validate_pmo_json(pmo)
        if name != "full":  # the test reads "full" from the merge case
            (FIXTURES / f"{name}.json").write_text(
                json.dumps(pmo, indent=1, ensure_ascii=False) + "\n"
            )
    return fixtures


# ---------------------------------------------------------------------------
# Cases
# ---------------------------------------------------------------------------

PMOS: dict[str, dict] = {}


def _schema_verdict(value: Any) -> dict | None:
    if not (isinstance(value, dict) and "pmo_header" in value):
        return None
    try:
        CHECKER.validate_pmo_json(value)
        return {"schema": "1.1.0", "valid": True, "error": None}
    except Exception as error:  # noqa: BLE001 - recorded, not raised
        message = getattr(error, "message", None) or str(error)
        return {"schema": "1.1.0", "valid": False, "error": message[:300]}


def case(case_id: str, function, note: str, divergence: str | None = None, **kwargs) -> None:
    """Records ``function(pmo=<fixture>, **kwargs)``. ``kwargs["pmo"]`` names the fixture."""
    name = kwargs["pmo"]

    def call(pmo: str, **rest):
        before = copy.deepcopy(PMOS[name])
        out = function(PMOS[name], **rest)
        assert PMOS[name] == before, f"{case_id}: Python changed its input"
        return out

    call.__name__ = function.__name__
    recorded = run_case(
        f"process/{case_id}", call, kwargs=kwargs, note=note, divergence=divergence
    )
    value = recorded["result"].get("value")
    if isinstance(value, list) and len(value) == 2 and isinstance(value[0], dict):
        verdict = _schema_verdict(value[0])
    else:
        verdict = _schema_verdict(value)
    if verdict is not None:
        recorded["schema_validation"] = verdict
        (OUT / f"{case_id}.json").write_text(
            json.dumps(recorded, indent=1, allow_nan=False, ensure_ascii=False) + "\n"
        )


def as_set(function):
    """Python's filters take sets; JSON carries lists."""

    def call(pmo, **kwargs):
        converted = {k: set(v) if isinstance(v, list) else v for k, v in kwargs.items()}
        return function(pmo, **converted)

    call.__name__ = function.__name__
    return call


P = PMOProcessor
E = PMOExporter


def main() -> None:
    shutil.rmtree(OUT, ignore_errors=True)
    PMOS.update(write_fixtures())

    # ---- names and counts ---------------------------------------------------
    for pmo in ("small", "full"):
        case(f"names-specimens-{pmo}", P.get_specimen_names, "Specimen names in order.", pmo=pmo)
        case(f"names-library-samples-{pmo}", P.get_library_sample_names, "Library sample names.", pmo=pmo)
        case(f"names-targets-{pmo}", P.get_target_names, "Target names.", pmo=pmo)
        case(f"names-panels-{pmo}", P.get_panel_names, "Panel names.", pmo=pmo)
        case(
            f"names-runs-{pmo}",
            P.get_bioinformatics_run_names,
            "Bioinformatics run names.",
            pmo=pmo,
        )
        case(
            f"count-meta-fields-{pmo}",
            P.count_specimen_per_meta_fields,
            "How many specimens have each specimen_info field.",
            pmo=pmo,
        )
        case(
            f"count-targets-per-panel-{pmo}",
            P.count_targets_per_panel,
            "Distinct targets per panel.",
            pmo=pmo,
        )
    case(
        "count-field-values-small",
        P.count_specimen_by_field_value,
        "Specimens per combination of values; a missing field counts as 'NA'.",
        pmo="small",
        meta_fields=["collection_country", "collection_date"],
    )
    case(
        "count-field-values-full",
        P.count_specimen_by_field_value,
        "Specimens per country on the example data.",
        pmo="full",
        meta_fields=["collection_country"],
    )

    # ---- filter by library sample ---------------------------------------------
    by_library_ids = as_set(P.filter_pmo_by_library_sample_ids)
    case(
        "filter-library-ids-one",
        by_library_ids,
        "One library sample: its specimen comes along, ids are renumbered, read "
        "counts and detected microhaplotypes keep only that sample.",
        pmo="small",
        library_sample_ids=[1],
    )
    case(
        "filter-library-ids-shared-specimen",
        by_library_ids,
        "Two library samples of the same specimen, from different runs.",
        pmo="small",
        library_sample_ids=[0, 2],
    )
    case(
        "filter-library-ids-all",
        by_library_ids,
        "Every library sample: the same PMO back.",
        pmo="small",
        library_sample_ids=[0, 1, 2, 3],
    )
    case(
        "filter-library-ids-none",
        by_library_ids,
        "No library samples: empty specimen and library lists, runs kept empty.",
        pmo="small",
        library_sample_ids=[],
    )
    case(
        "filter-library-ids-out-of-range",
        by_library_ids,
        "An id past the end.",
        pmo="small",
        library_sample_ids=[9],
    )
    case(
        "filter-library-ids-equal-to-length",
        by_library_ids,
        "An id equal to the number of library samples.",
        divergence=OFF_BY_ONE,
        pmo="small",
        library_sample_ids=[4],
    )
    by_library_names = as_set(P.filter_pmo_by_library_sample_names)
    case(
        "filter-library-names",
        by_library_names,
        "By name; the names are sorted before lookup.",
        pmo="small",
        library_sample_names=["L4", "L1"],
    )
    case(
        "filter-library-names-unknown",
        by_library_names,
        "An unknown name.",
        divergence=UNKNOWN_NAME,
        pmo="small",
        library_sample_names=["L1", "nope"],
    )
    names = P.get_library_sample_names(PMOS["full"])
    case(
        "filter-library-names-full",
        by_library_names,
        "Ten library samples of the example data.",
        pmo="full",
        library_sample_names=names[5:15],
    )

    # ---- filter by specimen -----------------------------------------------------
    by_specimen_ids = as_set(P.filter_pmo_by_specimen_ids)
    case(
        "filter-specimen-ids-two-libraries",
        by_specimen_ids,
        "A specimen with two library samples brings both.",
        pmo="small",
        specimen_ids=[0],
    )
    case(
        "filter-specimen-ids-without-library",
        by_specimen_ids,
        "A specimen with no library sample is dropped, since specimens are chosen "
        "through their library samples.",
        pmo="small",
        specimen_ids=[2, 3],
    )
    case(
        "filter-specimen-ids-equal-to-length",
        by_specimen_ids,
        "An id equal to the number of specimens.",
        divergence=OFF_BY_ONE,
        pmo="small",
        specimen_ids=[4],
    )
    by_specimen_names = as_set(P.filter_pmo_by_specimen_names)
    case(
        "filter-specimen-names",
        by_specimen_names,
        "By name.",
        pmo="small",
        specimen_names=["s2", "s4"],
    )
    case(
        "filter-specimen-names-unknown",
        by_specimen_names,
        "An unknown name.",
        divergence=UNKNOWN_NAME,
        pmo="small",
        specimen_names=["nope"],
    )
    specimen_names = P.get_specimen_names(PMOS["full"])
    case(
        "filter-specimen-names-full",
        by_specimen_names,
        "Every third of the first 30 specimens of the example data.",
        pmo="full",
        specimen_names=specimen_names[:30:3],
    )
    case(
        "filter-specimen-names-set-order",
        by_specimen_names,
        "Every third specimen of the example data, ids past 32 included.",
        divergence=SET_ORDER,
        pmo="full",
        specimen_names=specimen_names[::3],
    )

    # ---- filter by target ---------------------------------------------------------
    by_target_ids = as_set(P.filter_pmo_by_target_ids)
    case(
        "filter-target-ids",
        by_target_ids,
        "Targets 1 and 3: panel reactions keep only them, a reaction left empty is "
        "dropped, representative and detected microhaplotypes and read counts are "
        "renumbered.",
        pmo="small",
        target_ids=[1, 3],
    )
    case(
        "filter-target-ids-one",
        by_target_ids,
        "Target 0 only: panelB keeps no reaction.",
        pmo="small",
        target_ids=[0],
    )
    case(
        "filter-target-ids-without-representatives",
        by_target_ids,
        "Target 2 has no representative microhaplotypes.",
        pmo="small",
        target_ids=[2],
    )
    case(
        "filter-target-ids-out-of-range",
        by_target_ids,
        "A target id past the end.",
        pmo="small",
        target_ids=[7],
    )
    by_target_names = as_set(P.filter_pmo_by_target_names)
    case(
        "filter-target-names",
        by_target_names,
        "By name.",
        pmo="small",
        target_names=["t4", "t1"],
    )
    case(
        "filter-target-names-unknown",
        by_target_names,
        "An unknown name.",
        divergence=UNKNOWN_NAME,
        pmo="small",
        target_names=["nope"],
    )
    target_names = P.get_target_names(PMOS["full"])
    case(
        "filter-target-names-full-without-representatives",
        by_target_names,
        "Twenty panel targets of the example data, some never detected, so with no "
        "representative microhaplotypes: Python refuses the whole selection.",
        pmo="full",
        target_names=target_names[10:30],
    )
    detected = [
        target_names[target["target_id"]]
        for target in PMOS["full"]["representative_microhaplotypes"]["targets"]
    ]
    case(
        "filter-target-names-full",
        by_target_names,
        "Twenty detected targets of the example data.",
        pmo="full",
        target_names=detected[10:30],
    )

    # ---- read filter ------------------------------------------------------------------
    for reads in (0, 10, 60, 1000):
        case(
            f"read-filter-{reads}",
            P.extract_from_pmo_with_read_filter,
            f"Keep microhaplotypes with at least {reads} reads; targets and library "
            "samples left with none are dropped from the detected microhaplotypes.",
            pmo="small",
            read_filter=reads,
        )
    case(
        "read-filter-full",
        P.extract_from_pmo_with_read_filter,
        "The example data at 100 reads.",
        pmo="full",
        read_filter=100,
    )
    no_run = copy.deepcopy(SMALL)
    del no_run["detected_microhaplotypes"][1]["bioinformatics_run_id"]
    PMOS["small-no-run-id"] = no_run
    (FIXTURES / "small-no-run-id.json").write_text(json.dumps(no_run, indent=1) + "\n")
    case(
        "read-filter-no-run-id",
        P.extract_from_pmo_with_read_filter,
        "A detected-microhaplotypes run without a bioinformatics_run_id.",
        divergence=NO_RUN_ID,
        pmo="small-no-run-id",
        read_filter=10,
    )

    # ---- metadata groups -----------------------------------------------------------------
    meta = P.extract_from_pmo_samples_with_meta_groupings
    case(
        "meta-one-field",
        meta,
        "Specimens collected in Mali.",
        pmo="small",
        meta_fields_values="collection_country=Mali",
    )
    case(
        "meta-two-fields",
        meta,
        "Both conditions in one group.",
        pmo="small",
        meta_fields_values="collection_country=Mali,Ghana:collection_date=2024",
    )
    case(
        "meta-two-groups",
        meta,
        "Two groups; a specimen in both is counted in each.",
        pmo="small",
        meta_fields_values="collection_country=Mali;collection_date=2024",
    )
    case(
        "meta-number-field",
        meta,
        "A numeric field is compared as text.",
        pmo="small",
        meta_fields_values="project_id=1",
    )
    case(
        "meta-no-match",
        meta,
        "A group no specimen matches: an empty PMO and a count of 0.",
        pmo="small",
        meta_fields_values="collection_country=Peru",
    )
    case(
        "meta-unknown-field",
        meta,
        "A field no specimen has.",
        pmo="small",
        meta_fields_values="nope=1",
    )
    case(
        "meta-malformed",
        meta,
        "A condition without '='.",
        pmo="small",
        meta_fields_values="collection_country",
    )
    case(
        "meta-full",
        meta,
        "The example data by country.",
        pmo="full",
        meta_fields_values="collection_country=Kenya",
    )

    # ---- counts over the detected microhaplotypes ---------------------------------------
    for pmo in ("small", "full", "small-no-run-id"):
        case(
            f"count-targets-per-sample-{pmo}",
            P.count_targets_per_library_sample,
            "Targets with any reads in each library sample, per run.",
            pmo=pmo,
        )
        case(
            f"count-samples-per-target-{pmo}",
            P.count_library_samples_per_target,
            "Library samples with reads at each target, per run.",
            pmo=pmo,
        )
        case(
            f"count-samples-per-target-collapsed-{pmo}",
            P.count_library_samples_per_target,
            "Library samples per target, summed across runs.",
            pmo=pmo,
            collapse_across_runs=True,
        )
    for reads in (10, 100):
        case(
            f"count-targets-per-sample-min-{reads}",
            P.count_targets_per_library_sample,
            f"A target counts when its microhaplotypes have {reads} reads or more in all.",
            pmo="small",
            min_reads=reads,
        )
        case(
            f"count-samples-per-target-min-{reads}",
            P.count_library_samples_per_target,
            f"A sample counts when the target has {reads} reads or more in all.",
            pmo="small",
            min_reads=reads,
        )
    case(
        "count-samples-per-target-none-left",
        P.count_library_samples_per_target,
        "No target reaches the minimum.",
        divergence=EMPTY_SORT,
        pmo="small",
        min_reads=100_000,
    )
    allele = P.extract_allele_counts_freq_from_pmo
    for pmo in ("small", "full"):
        case(
            f"allele-freq-{pmo}",
            allele,
            "How many library samples carry each microhaplotype of each target, per run, "
            "and its share of the target's detections.",
            pmo=pmo,
        )
        case(
            f"allele-freq-collapsed-{pmo}",
            allele,
            "The same, summed across runs.",
            pmo=pmo,
            collapse_across_runs=True,
        )
    case(
        "allele-freq-filtered",
        allele,
        "Only some runs, library samples and targets.",
        pmo="small",
        bioinformatics_run_ids=[0],
        library_sample_names=["L1"],
        target_names=["t1", "t2"],
    )
    case(
        "allele-freq-nothing-chosen",
        allele,
        "A filter that matches nothing.",
        divergence=EMPTY_SORT,
        pmo="small",
        target_names=["nope"],
    )
    case(
        "allele-freq-no-run-id",
        allele,
        "A run without a bioinformatics_run_id.",
        divergence=NO_RUN_ID_ALLELES,
        pmo="small-no-run-id",
    )

    # ---- tables --------------------------------------------------------------------------
    tables = [
        ("specimen", E.export_specimen_meta_table),
        ("specimen-travel", E.export_specimen_travel_meta_table),
        ("library-sample", E.export_library_sample_meta_table),
        ("target", E.export_target_info_meta_table),
        ("panel", E.export_panel_info_meta_table),
        ("project", E.export_project_info_meta_table),
        ("sequencing", E.export_sequencing_info_meta_table),
        ("bioinformatics-run", E.export_bioinformatics_run_info_meta_table),
        ("bioinformatics-methods", E.export_bioinformatics_methods_info_meta_table),
        ("targeted-genomes", E.export_targeted_genomes_meta_table),
        ("header", E.export_pmo_header_table),
    ]
    for pmo in ("small", "full"):
        for name, function in tables:
            has_list = name == "bioinformatics-methods" and any(
                isinstance(value, list)
                for info in PMOS[pmo].get("bioinformatics_methods_info") or []
                for method in info["methods"]
                for value in method.values()
            )
            case(
                f"table-{name}-{pmo}",
                function,
                f"The {name} table.",
                divergence=LIST_CELL if has_list else None,
                pmo=pmo,
            )
        case(
            f"table-alleles-{pmo}",
            E.extract_alleles_per_sample_table,
            "Library sample, target and sequence for each detected microhaplotype, "
            "with the run name.",
            pmo=pmo,
        )
        case(
            f"table-library-per-specimen-{pmo}",
            E.list_library_sample_names_per_specimen_name,
            "Library samples per specimen.",
            pmo=pmo,
        )
    case(
        "table-specimen-separator",
        E.export_specimen_meta_table,
        "List values joined with ';'.",
        pmo="small",
        separator=";",
    )
    case(
        "table-alleles-extra-fields",
        E.extract_alleles_per_sample_table,
        "With extra fields from each level; a missing one is 'NA'.",
        pmo="small",
        additional_specimen_info_fields=["collection_country", "collection_date"],
        additional_library_sample_info_fields=["sequencing_info_id"],
        additional_microhap_fields=["reads", "umis"],
        additional_representative_info_fields=["microhaplotype_name"],
    )
    case(
        "table-alleles-renamed-columns",
        E.extract_alleles_per_sample_table,
        "Other names for the three base columns.",
        pmo="small",
        default_base_col_names=["sample", "locus", "allele"],
    )
    case(
        "table-alleles-unknown-field",
        E.extract_alleles_per_sample_table,
        "An extra specimen field no specimen has.",
        pmo="small",
        additional_specimen_info_fields=["nope"],
    )
    case(
        "table-alleles-two-base-columns",
        E.extract_alleles_per_sample_table,
        "Only two base column names.",
        pmo="small",
        default_base_col_names=["sample", "locus"],
    )
    minimal = {
        key: copy.deepcopy(SMALL[key])
        for key in (
            "pmo_header",
            "panel_info",
            "target_info",
            "specimen_info",
            "library_sample_info",
            "representative_microhaplotypes",
            "detected_microhaplotypes",
        )
    }
    for specimen in minimal["specimen_info"]:
        specimen.pop("project_id", None)
    for library in minimal["library_sample_info"]:
        library.pop("sequencing_info_id", None)
    for target in minimal["target_info"]:
        for key in ("forward_primer", "reverse_primer", "insert_location"):
            target.get(key, {}).pop("location", None) if key != "insert_location" else target.pop(key)
    PMOS["minimal"] = minimal
    (FIXTURES / "minimal.json").write_text(json.dumps(minimal, indent=1) + "\n")
    CHECKER.validate_pmo_json(minimal)
    for name, function in tables:
        case(
            f"table-{name}-minimal",
            function,
            f"The {name} table of a PMO without optional sections.",
            pmo="minimal",
        )
    case(
        "table-alleles-minimal",
        E.extract_alleles_per_sample_table,
        "Without bioinformatics_run_info the run is named by position.",
        pmo="minimal",
    )


if __name__ == "__main__":
    main()
