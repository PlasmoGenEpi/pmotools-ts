"""Oracle cases for ``merge_to_pmo``.

Run from ``conformance/``: ``.venv/bin/python -m oracle.gen_merge``

Every input fragment is built by the real pmotools-python builders (on the
example tables in ``data/tables`` or on small inline tables) and recorded as
JSON in ``kwargs``, so the TypeScript test replays exactly what the builders
produced without needing the TypeScript builders. Sequencing, bioinformatics
and project records are written by hand, as the app does from its forms.

Each successful merge is also validated with pmotools' ``PMOChecker`` against
the v1.1.0 schema; the outcome is stored in the case file as
``schema_validation`` so we know whether the expected output is valid PMO.
"""

from __future__ import annotations

import copy
import json
import shutil

import pandas as pd
from pmotools.pmo_builder.merge_to_pmo import merge_to_pmo
from pmotools.pmo_builder.metatable_to_pmo import (
    library_sample_info_table_to_pmo,
    specimen_info_table_to_pmo,
)
from pmotools.pmo_builder.mhap_table_to_pmo import mhap_table_to_pmo
from pmotools.pmo_builder.panel_information_to_pmo import (
    merge_panel_info_dicts,
    panel_info_table_to_pmo,
)
from pmotools.pmo_builder.pmo_updater import PMOUpdater
from pmotools.pmo_builder.read_count_by_stage_table_to_pmo import (
    read_count_by_stage_table_to_pmo,
)
from pmotools.pmo_engine.pmo_checker import PMOChecker, load_schema_by_version

from oracle.common import CASES, TABLES, read_table, run_case, to_plain

F = merge_to_pmo
CHECKER = PMOChecker(load_schema_by_version("1.1.0"))

# ---------------------------------------------------------------------------
# Divergences (see AGENTS.md "Matching Python")
# ---------------------------------------------------------------------------

NUMERIC_NAMES = (
    "Python looks names up with str(name) on the referring record but the raw value "
    "on the referenced record, so any numeric name (a specimen or library sample "
    "called 101) never resolves and the merge fails. pmotools-ts compares names as "
    "strings on both sides (AGENTS.md: names are compared and written as strings), so "
    "the merge succeeds. Records the merge creates itself carry names as strings."
)
DUPLICATES_ACROSS_RUNS = (
    "When no library-sample info is supplied, Python checks for duplicate library "
    "sample names across all bioinformatics runs together and raises 'Duplicate "
    "library sample names', so one library sample analysed in two runs cannot be "
    "merged. pmotools-ts checks duplicates within each run only and creates one "
    "library-sample (and specimen) record per distinct name, in first-seen order."
)
SET_ORDER = (
    "Python appends specimens for library samples missing from specimen_info in "
    "Python set order, which changes with the string hash seed from run to run. "
    "pmotools-ts appends them in the order the library samples first appear in the "
    "detected microhaplotypes. The recorded Python result may differ in that order "
    "(and in the specimen_id values that depend on it)."
)

# ---------------------------------------------------------------------------
# Fragment builders
# ---------------------------------------------------------------------------


def mhap(df: pd.DataFrame, **kwargs) -> dict:
    return to_plain(mhap_table_to_pmo(df, **kwargs))


def panel(df: pd.DataFrame, panel_name: str = "panel1", **kwargs) -> dict:
    return to_plain(panel_info_table_to_pmo(df, panel_name, **kwargs))


def targets(*names: str) -> pd.DataFrame:
    return pd.DataFrame(
        {
            "target_name": list(names),
            "fwd_primer": [f"ACGT{'A' * i}" for i in range(len(names))],
            "rev_primer": [f"TGCA{'T' * i}" for i in range(len(names))],
        }
    )


def alleles(rows: list[tuple]) -> pd.DataFrame:
    """Rows of (library_sample_name, target_name, seq, reads)."""
    return pd.DataFrame(
        rows, columns=["library_sample_name", "target_name", "seq", "reads"]
    )


def specimens(df: pd.DataFrame, **kwargs) -> list:
    return to_plain(specimen_info_table_to_pmo(df, **kwargs))


def libraries(df: pd.DataFrame, **kwargs) -> list:
    return to_plain(library_sample_info_table_to_pmo(df, **kwargs))


def read_counts(totals: pd.DataFrame, run=None, stages=None, **kwargs) -> list:
    return to_plain(read_count_by_stage_table_to_pmo(totals, run, stages, **kwargs))


SEQUENCING = [
    {
        "sequencing_info_name": "run1",
        "seq_platform": "ILLUMINA",
        "seq_instrument_model": "NextSeq 2000",
        "library_layout": "PAIRED",
        "library_strategy": "AMPLICON",
        "library_source": "GENOMIC",
        "library_selection": "PCR",
        "seq_date": "2023-05-01",
    }
]
METHODS = [
    {
        "bioinformatics_method_name": "mad4hatter",
        "methods": [{"program": "mad4hatter", "program_version": "v0.1.8"}],
    }
]
RUNS = [
    {
        "bioinformatics_run_name": "run1",
        "bioinformatics_methods_id": 0,
        "run_date": "2023-06-01",
    }
]
PROJECTS = [
    {
        "project_name": "PRJNA1040019",
        "project_description": "Mozambique surveillance",
        "project_contributors": ["Nanna Brokhattingen"],
    }
]

# ---------------------------------------------------------------------------
# Example-data fragments
# ---------------------------------------------------------------------------


def example_alleles(name: str = "mad4hatter_allele_data_example.csv") -> pd.DataFrame:
    return read_table(name)


def example_mhap(run=None, name="mad4hatter_allele_data_example.csv") -> dict:
    return mhap(
        example_alleles(name),
        bioinformatics_run_name=run,
        library_sample_name_col="SampleID",
        target_name_col="Locus",
        seq_col="ASV",
        reads_col="Reads",
    )


def example_panel_df() -> pd.DataFrame:
    return read_table("mad4hatter_panel_info_example.csv")


def example_panel() -> dict:
    return panel(example_panel_df(), "Mad4hatter", target_name_col="amplicon")


def example_meta(name: str = "mad4hatter_metadata_example.xlsx") -> pd.DataFrame:
    return pd.read_excel(TABLES / name)


def example_specimens(meta: pd.DataFrame) -> list:
    return specimens(
        meta,
        specimen_name_col="specimen_id",
        specimen_taxon_id_col="samp_taxon_id",
        host_taxon_id_col="host_taxon_id",
        collection_date_col="collection_date",
        collection_country_col="collection_country",
        project_name_col="project_name",
        geo_admin3_col="geo_admin3",
        lat_lon_col="lat_lon",
        specimen_collect_device_col="samp_collect_device",
        specimen_store_loc_col="samp_store_loc",
        additional_specimen_cols=["collector"],
    )


def example_libraries(meta: pd.DataFrame) -> list:
    return libraries(
        meta,
        library_sample_name_col="experiment_sample_id",
        specimen_name_col="specimen_id",
        panel_name_col="panel_id",
        sequencing_info_name_col="sequencing_info_id",
        library_prep_plate_name_col="plate_name",
        library_prep_plate_row_col="plate_row",
        library_prep_plate_col_col="plate_col",
    )


def example_read_counts(run="run1") -> list:
    return read_counts(
        read_table("example_raw_reads.txt"),
        run,
        read_table("reads_per_stage.txt"),
        library_sample_name_col="sample",
        target_name_col="target",
        total_raw_count_col="raw_count",
        read_count_col="reads",
    )


# ---------------------------------------------------------------------------
# Small inline fragments
# ---------------------------------------------------------------------------


def small_panel(*names: str, panel_name: str = "panel1") -> dict:
    return panel(targets(*(names or ("target1", "target2"))), panel_name)


def small_mhap(run=None, samples=("samp_A", "samp_B")) -> dict:
    rows = []
    for i, sample in enumerate(samples):
        rows.append((sample, "target1", "AAAA", 10 + i))
        rows.append((sample, "target2", "CCCC", 20 + i))
    return mhap(alleles(rows), bioinformatics_run_name=run)


def small_specimens(*names: str, project=None) -> list:
    data = {"specimen_name": list(names), "collection_country": ["Kenya"] * len(names)}
    kwargs = {"collection_country_col": "collection_country"}
    if project is not None:
        data["project_name"] = [project] * len(names)
        kwargs["project_name_col"] = "project_name"
    return specimens(pd.DataFrame(data), **kwargs)


def small_libraries(rows: list[tuple], sequencing: bool = False) -> list:
    """Rows of (library_sample_name, specimen_name, panel_name[, sequencing_info_name])."""
    columns = ["library_sample_name", "specimen_name", "panel_name"]
    kwargs = {}
    if sequencing:
        columns.append("sequencing_info_name")
        kwargs["sequencing_info_name_col"] = "sequencing_info_name"
    return libraries(pd.DataFrame(rows, columns=columns), **kwargs)


def small_read_counts(run="run1", samples=("samp_A", "samp_B"), target="target1") -> list:
    totals = pd.DataFrame(
        {"library_sample_name": list(samples), "total_raw_count": [100] * len(samples)}
    )
    stages = pd.DataFrame(
        {
            "library_sample_name": list(samples),
            "target_name": [target] * len(samples),
            "stage": ["demultiplexed"] * len(samples),
            "read_count": [50] * len(samples),
        }
    )
    return read_counts(totals, run, stages)


def both_libraries(sequencing=False) -> list:
    rows = [("samp_A", "samp_A", "panel1"), ("samp_B", "samp_B", "panel1")]
    if sequencing:
        rows = [row + ("run1",) for row in rows]
    return small_libraries(rows, sequencing=sequencing)


# ---------------------------------------------------------------------------
# Case recording
# ---------------------------------------------------------------------------


def case(case_id: str, note: str, divergence: str | None = None, **kwargs) -> dict:
    # The shared loader reads one directory level, so "group/name" becomes "group-name".
    case_id = case_id.replace("/", "-")
    recorded = run_case(
        f"merge/{case_id}", F, kwargs=kwargs, note=note, divergence=divergence
    )
    path = CASES / "merge" / f"{case_id}.json"
    if recorded["result"]["kind"] == "ok":
        pmo = recorded["result"]["value"]
        try:
            CHECKER.check_for_required_base_fields(pmo)
            CHECKER.validate_pmo_json(pmo)
            validation = {"schema": "1.1.0", "valid": True, "error": None}
        except Exception as error:  # noqa: BLE001 - recorded, not raised
            message = getattr(error, "message", None) or str(error)
            validation = {"schema": "1.1.0", "valid": False, "error": message[:500]}
        recorded["schema_validation"] = validation
        path.write_text(
            json.dumps(recorded, indent=1, allow_nan=False, ensure_ascii=False) + "\n"
        )
    return recorded


def main() -> None:
    shutil.rmtree(CASES / "merge", ignore_errors=True)

    # ---- the plain paths ---------------------------------------------------
    case(
        "basic/minimal-two-inputs",
        "Python test_merge_to_pmo_minimum_info: only panel and mhap info; specimens "
        "and library samples are created from the detected microhaplotypes.",
        panel_target_info={
            "panel_info": [{"panel_name": "panel1"}],
            "target_info": [{"target_name": "target1"}],
        },
        mhap_info={
            "representative_microhaplotypes": {
                "targets": [{"target_name": "target1", "microhaplotypes": []}]
            },
            "detected_microhaplotypes": [
                {
                    "library_samples": [
                        {"library_sample_name": "samp_A", "target_results": []},
                        {"library_sample_name": "samp_B", "target_results": []},
                    ]
                }
            ],
        },
    )
    case(
        "basic/small-builders-two-inputs",
        "Panel and mhap fragments from the builders on small tables, nothing else.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
    )
    case(
        "example/minimal-two-inputs",
        "Example allele and panel tables only. The representative targets are in a "
        "different order from the panel's targets.",
        panel_target_info=example_panel(),
        mhap_info=example_mhap(),
    )
    meta = example_meta()
    case(
        "example/full-nine-inputs",
        "Every input on the example data: allele table with run name run1, panel, "
        "specimen and library metadata (50 rows, one not sequenced), hand-made "
        "sequencing, method, run and project records, and read counts by stage.",
        panel_target_info=example_panel(),
        mhap_info=example_mhap(run="run1"),
        specimen_info=example_specimens(meta),
        library_sample_info=example_libraries(meta),
        sequencing_info=SEQUENCING,
        bioinfo_method_info=METHODS,
        bioinfo_run_info=RUNS,
        project_info=PROJECTS,
        read_counts_by_stage_info=example_read_counts(),
    )

    # ---- each optional input alone ----------------------------------------
    case(
        "optional/specimen-only",
        "Python test_merge_to_pmo_specimen_info_matching_names_passes: specimen info "
        "alone; library samples are created from the detected microhaplotypes.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        specimen_info=small_specimens("samp_A", "samp_B"),
    )
    case(
        "optional/library-only",
        "Library-sample info alone: each library sample becomes its own specimen.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        library_sample_info=small_libraries(
            [("samp_A", "spec_X", "panel1"), ("samp_B", "spec_Y", "panel1")]
        ),
    )
    case(
        "optional/library-only-two-panels",
        "Python test_merge_to_pmo_minimum_info_plus_library_sample: two panels, "
        "library info names the panel, no specimen_name column.",
        panel_target_info={
            "panel_info": [{"panel_name": "panel1"}, {"panel_name": "panel2"}],
            "target_info": [{"target_name": "target1"}],
        },
        mhap_info={
            "representative_microhaplotypes": {
                "targets": [{"target_name": "target1", "microhaplotypes": []}]
            },
            "detected_microhaplotypes": [
                {
                    "library_samples": [
                        {"library_sample_name": "samp_A", "target_results": []},
                        {"library_sample_name": "samp_B", "target_results": []},
                    ]
                }
            ],
        },
        library_sample_info=[
            {"library_sample_name": "samp_A", "panel_name": "panel1"},
            {"library_sample_name": "samp_B", "panel_name": "panel2"},
        ],
    )
    case(
        "optional/sequencing-only",
        "Sequencing info alone: the created library samples have no "
        "sequencing_info_name, which Python reports as a merging 'warning' exception.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        sequencing_info=SEQUENCING,
    )
    case(
        "optional/bioinfo-methods-only",
        "Bioinformatics methods alone are copied through.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        bioinfo_method_info=METHODS,
    )
    case(
        "optional/bioinfo-runs-only",
        "Bioinformatics runs without methods are an error.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(run="run1"),
        bioinfo_run_info=RUNS,
    )
    case(
        "optional/bioinfo-methods-and-runs",
        "Methods and runs together: detected run names become run ids.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(run="run1"),
        bioinfo_method_info=METHODS,
        bioinfo_run_info=RUNS,
    )
    case(
        "optional/project-only",
        "Project info alone: the created specimens have no project_name, which "
        "Python reports as a merging 'warning' exception.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        project_info=PROJECTS,
    )
    case(
        "optional/read-counts-only",
        "Read counts alone: no run info, so run names stay as names; library and "
        "target names become ids.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        read_counts_by_stage_info=small_read_counts(),
    )
    case(
        "optional/read-counts-without-run-name",
        "Read counts built without a run name.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        read_counts_by_stage_info=small_read_counts(run=None),
    )
    case(
        "optional/detected-run-name-without-run-info",
        "Detected microhaplotypes carry a run name but no run info is supplied: the "
        "name is left in place.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(run="run1"),
    )
    case(
        "optional/python-read-counts-test",
        "Python test_merge_to_pmo_with_read_counts_by_stage: empty methods list, so "
        "no bioinformatics_methods_info in the output.",
        specimen_info=[{"specimen_name": "spec1", "project_name": "proj1"}],
        library_sample_info=[
            {
                "library_sample_name": "lib1",
                "specimen_name": "spec1",
                "sequencing_info_name": "seq1",
                "panel_name": "panel1",
            }
        ],
        sequencing_info=[{"sequencing_info_name": "seq1"}],
        panel_target_info={
            "panel_info": [{"panel_name": "panel1"}],
            "target_info": [{"target_name": "target1"}],
        },
        mhap_info={
            "representative_microhaplotypes": {
                "targets": [{"target_name": "target1", "microhaplotypes": []}]
            },
            "detected_microhaplotypes": [],
        },
        bioinfo_method_info=[],
        bioinfo_run_info=[{"bioinformatics_run_name": "run1"}],
        project_info=[{"project_name": "proj1"}],
        read_counts_by_stage_info=[
            {
                "bioinformatics_run_name": "run1",
                "read_counts_by_library_sample_by_stage": [
                    {
                        "library_sample_name": "lib1",
                        "total_raw_count": 1000,
                        "read_counts_for_targets": [
                            {
                                "target_name": "target1",
                                "stages": [{"stage": "demultiplexed", "read_count": 100}],
                            }
                        ],
                    }
                ],
            }
        ],
    )
    case(
        "optional/empty-lists",
        "Empty sequencing, methods and project lists: no merging error for the "
        "missing name fields (the lists are falsy) and none appear in the output.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        sequencing_info=[],
        bioinfo_method_info=[],
        project_info=[],
    )
    case(
        "optional/empty-run-list",
        "The app passes an empty run list when methods exist but no runs were saved; "
        "the detected run names then do not resolve.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(run="run1"),
        bioinfo_method_info=METHODS,
        bioinfo_run_info=[],
    )
    case(
        "optional/read-count-target-without-name",
        "A read-count target entry with no target_name is left without a target_id.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        read_counts_by_stage_info=[
            {
                "read_counts_by_library_sample_by_stage": [
                    {
                        "library_sample_name": "samp_A",
                        "total_raw_count": 5,
                        "read_counts_for_targets": [
                            {"stages": [{"stage": "s", "reads": 1}]},
                            {"target_name": None, "stages": []},
                            {"target_name": "target2", "stages": []},
                        ],
                    },
                    {"library_sample_name": "samp_B", "total_raw_count": 5},
                ]
            }
        ],
    )

    # ---- several bioinformatics runs ---------------------------------------
    multi = example_mhap(run="bioinfo_runs", name="mad4hatter_allele_data_example_multi_bioinfo.csv")
    multi_runs = [
        {"bioinformatics_run_name": name, "bioinformatics_methods_id": 0}
        for name in ["bioinfo_run1", "bioinfo_run2", "bioinfo_run3"]
    ]
    case(
        "runs/example-with-library-info",
        "Multi-run example allele table (samples appear in several runs) with library "
        "metadata, methods and runs.",
        panel_target_info=example_panel(),
        mhap_info=multi,
        specimen_info=example_specimens(meta),
        library_sample_info=example_libraries(meta),
        bioinfo_method_info=METHODS,
        bioinfo_run_info=multi_runs,
    )
    case(
        "runs/example-without-library-info",
        "Multi-run example allele table with no specimen or library info: the same "
        "library sample in several runs.",
        divergence=DUPLICATES_ACROSS_RUNS,
        panel_target_info=example_panel(),
        mhap_info=multi,
        bioinfo_method_info=METHODS,
        bioinfo_run_info=multi_runs,
    )
    two_runs = mhap(
        pd.DataFrame(
            {
                "library_sample_name": ["samp_A", "samp_B", "samp_B", "samp_C"],
                "target_name": ["target1", "target1", "target1", "target2"],
                "seq": ["AAAA", "AAAA", "AAAA", "CCCC"],
                "reads": [1, 2, 3, 4],
                "run": ["r1", "r1", "r2", "r2"],
            }
        ),
        bioinformatics_run_name="run",
    )
    case(
        "runs/small-without-library-info",
        "samp_B is in runs r1 and r2; no specimen or library info.",
        divergence=DUPLICATES_ACROSS_RUNS,
        panel_target_info=small_panel(),
        mhap_info=two_runs,
        bioinfo_method_info=METHODS,
        bioinfo_run_info=[
            {"bioinformatics_run_name": "r1", "bioinformatics_methods_id": 0},
            {"bioinformatics_run_name": "r2", "bioinformatics_methods_id": 0},
        ],
    )
    case(
        "runs/small-specimen-only",
        "samp_B is in runs r1 and r2; specimen info only.",
        divergence=DUPLICATES_ACROSS_RUNS,
        panel_target_info=small_panel(),
        mhap_info=two_runs,
        specimen_info=small_specimens("samp_A", "samp_B", "samp_C"),
    )
    case(
        "runs/small-with-library-info",
        "samp_B is in runs r1 and r2; library info supplied, so Python succeeds.",
        panel_target_info=small_panel(),
        mhap_info=two_runs,
        library_sample_info=small_libraries(
            [
                ("samp_A", "samp_A", "panel1"),
                ("samp_B", "samp_B", "panel1"),
                ("samp_C", "samp_C", "panel1"),
            ]
        ),
        bioinfo_method_info=METHODS,
        bioinfo_run_info=[
            {"bioinformatics_run_name": "r1", "bioinformatics_methods_id": 0},
            {"bioinformatics_run_name": "r2", "bioinformatics_methods_id": 0},
        ],
        read_counts_by_stage_info=small_read_counts(run="r2", samples=("samp_B", "samp_C")),
    )

    # ---- several panels ----------------------------------------------------
    panel_df = example_panel_df()
    two_panels = to_plain(
        merge_panel_info_dicts(
            [
                panel_info_table_to_pmo(panel_df, "Mad4hatter", target_name_col="amplicon"),
                panel_info_table_to_pmo(
                    panel_df.iloc[::-1].head(60), "PfPHAST", target_name_col="amplicon"
                ),
            ]
        )
    )
    meta_multi = example_meta("mad4hatter_metadata_example_multi_panel.xlsx")
    case(
        "panels/example-with-metadata",
        "Two panels (Mad4hatter and PfPHAST); the metadata says which panel each "
        "library sample used.",
        panel_target_info=two_panels,
        mhap_info=example_mhap(),
        specimen_info=example_specimens(meta_multi),
        library_sample_info=example_libraries(meta_multi),
    )
    case(
        "panels/example-without-metadata",
        "Python test_merge_to_pmo_minimum_info_raise_multi_panel_no_lib on example "
        "data: two panels and no sample metadata is an error.",
        panel_target_info=two_panels,
        mhap_info=example_mhap(),
    )
    small_two_panels = to_plain(
        merge_panel_info_dicts(
            [
                panel_info_table_to_pmo(targets("target1", "target2"), "panel1"),
                panel_info_table_to_pmo(targets("target2"), "panel2"),
            ]
        )
    )
    case(
        "panels/specimen-only",
        "Two panels with specimen info only: Python assigns every created library "
        "sample to the first panel.",
        panel_target_info=small_two_panels,
        mhap_info=small_mhap(),
        specimen_info=small_specimens("samp_A", "samp_B"),
    )
    case(
        "panels/library-only",
        "Two panels with library info naming each sample's panel.",
        panel_target_info=small_two_panels,
        mhap_info=small_mhap(),
        library_sample_info=small_libraries(
            [("samp_A", "samp_A", "panel1"), ("samp_B", "samp_B", "panel2")]
        ),
    )

    # ---- target order -----------------------------------------------------
    case(
        "targets/representative-order-differs",
        "The panel lists target3, target1, target2; the mhap builder orders "
        "representative targets by name (target1, target2, target3). mhaps_target_id "
        "indexes the representative targets and target_id indexes target_info; the "
        "reads must stay with their own sequences.",
        panel_target_info=small_panel("target3", "target1", "target2"),
        mhap_info=mhap(
            alleles(
                [
                    ("samp_A", "target3", "GGGG", 33),
                    ("samp_A", "target1", "AAAA", 11),
                    ("samp_A", "target2", "CCCC", 22),
                    ("samp_B", "target2", "CCCT", 222),
                    ("samp_B", "target3", "GGGT", 333),
                ]
            )
        ),
    )

    # ---- duplicates --------------------------------------------------------
    case(
        "duplicates/specimen-names-later-wins",
        "specimen_info lists samp_A twice; the library sample points at the later one.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        specimen_info=[
            {"specimen_name": "samp_A", "collection_country": "first"},
            {"specimen_name": "samp_B"},
            {"specimen_name": "samp_A", "collection_country": "second"},
        ],
        library_sample_info=both_libraries(),
    )
    case(
        "duplicates/library-names-later-wins",
        "library_sample_info lists samp_A twice; detected and read counts point at "
        "the later one.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        specimen_info=small_specimens("samp_A", "samp_B"),
        library_sample_info=[
            {"library_sample_name": "samp_A", "specimen_name": "samp_A", "panel_name": "panel1", "n": 1},
            {"library_sample_name": "samp_B", "specimen_name": "samp_B", "panel_name": "panel1"},
            {"library_sample_name": "samp_A", "specimen_name": "samp_A", "panel_name": "panel1", "n": 2},
        ],
        read_counts_by_stage_info=small_read_counts(),
    )
    case(
        "duplicates/within-one-run",
        "A hand-made detected entry lists samp_A twice with no library info: "
        "duplicate library sample names is an error.",
        panel_target_info=small_panel(),
        mhap_info={
            "representative_microhaplotypes": {
                "targets": [{"target_name": "target1", "microhaplotypes": [{"seq": "AAAA"}]}]
            },
            "detected_microhaplotypes": [
                {
                    "library_samples": [
                        {"library_sample_name": "samp_A", "target_results": []},
                        {"library_sample_name": "samp_A", "target_results": []},
                    ]
                }
            ],
        },
    )

    # ---- warnings ----------------------------------------------------------
    case(
        "warnings/specimen-missing-one",
        "Python test_merge_to_pmo_specimen_info_missing_names_warns: samp_B has no "
        "specimen record; one is added and a warning raised.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        specimen_info=small_specimens("samp_A"),
    )
    case(
        "warnings/specimen-extra",
        "Python test_merge_to_pmo_specimen_info_extra_names_warns: samp_C has no "
        "library sample; a warning is raised and samp_C stays.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        specimen_info=small_specimens("samp_A", "samp_B", "samp_C"),
    )
    case(
        "warnings/specimen-missing-and-extra",
        "Both warnings at once.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        specimen_info=small_specimens("samp_A", "samp_C"),
    )
    case(
        "warnings/specimen-missing-several",
        "Three library samples lack specimen records.",
        divergence=SET_ORDER,
        panel_target_info=small_panel(),
        mhap_info=small_mhap(samples=("s1", "s2", "s3", "s4", "s5")),
        specimen_info=small_specimens("s3"),
    )
    case(
        "warnings/then-error",
        "A specimen warning is raised (samp_B gets a bare specimen record) before the "
        "merge fails because that record has no project_name.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        specimen_info=small_specimens("samp_A", project="nope"),
        project_info=PROJECTS,
    )

    # ---- numeric names -----------------------------------------------------
    numeric_mhap = mhap(alleles([(101, "target1", "AAAA", 5), (102, "target2", "CCCC", 6)]))
    case(
        "numeric/minimal",
        "Numeric library sample names with no metadata: the created records hold the "
        "numbers.",
        divergence=NUMERIC_NAMES,
        panel_target_info=small_panel(),
        mhap_info=numeric_mhap,
    )
    case(
        "numeric/specimen-and-library",
        "Numeric specimen and library sample names from the metadata builders.",
        divergence=NUMERIC_NAMES,
        panel_target_info=small_panel(),
        mhap_info=numeric_mhap,
        specimen_info=specimens(pd.DataFrame({"specimen_name": [1, 2]})),
        library_sample_info=libraries(
            pd.DataFrame(
                {
                    "library_sample_name": [101, 102],
                    "specimen_name": [1, 2],
                    "panel_name": ["panel1", "panel1"],
                }
            )
        ),
    )
    case(
        "numeric/specimen-only",
        "Numeric names with specimen info only.",
        divergence=NUMERIC_NAMES,
        panel_target_info=small_panel(),
        mhap_info=numeric_mhap,
        specimen_info=specimens(pd.DataFrame({"specimen_name": [101, 102]})),
    )
    case(
        "numeric/as-strings",
        "Numeric-looking names held as strings resolve in Python too.",
        panel_target_info=small_panel(),
        mhap_info=mhap(alleles([("101", "target1", "AAAA", 5), ("102", "target2", "CCCC", 6)])),
        specimen_info=[{"specimen_name": "1"}, {"specimen_name": "2"}],
        library_sample_info=[
            {"library_sample_name": "101", "specimen_name": "1", "panel_name": "panel1"},
            {"library_sample_name": "102", "specimen_name": "2", "panel_name": "panel1"},
        ],
    )

    # ---- missing references (one kind each, then all together) --------------
    def full_small(**overrides):
        kwargs = dict(
            panel_target_info=small_panel(),
            mhap_info=small_mhap(run="run1"),
            specimen_info=small_specimens("samp_A", "samp_B", project="PRJNA1040019"),
            library_sample_info=both_libraries(sequencing=True),
            sequencing_info=SEQUENCING,
            bioinfo_method_info=METHODS,
            bioinfo_run_info=RUNS,
            project_info=PROJECTS,
            read_counts_by_stage_info=small_read_counts(),
        )
        kwargs.update(overrides)
        return kwargs

    case("missing/none", "Every input on small data, all names resolve.", **full_small())
    case(
        "missing/project",
        "A specimen names a project not in project info.",
        **full_small(specimen_info=small_specimens("samp_A", "samp_B", project="other")),
    )
    case(
        "missing/sequencing",
        "A library sample names a sequencing run not in sequencing info.",
        **full_small(
            library_sample_info=small_libraries(
                [("samp_A", "samp_A", "panel1", "run1"), ("samp_B", "samp_B", "panel1", "runX")],
                sequencing=True,
            )
        ),
    )
    case(
        "missing/specimen",
        "A library sample names a specimen not in specimen info.",
        **full_small(
            library_sample_info=small_libraries(
                [("samp_A", "samp_A", "panel1", "run1"), ("samp_B", "spec_X", "panel1", "run1")],
                sequencing=True,
            )
        ),
    )
    case(
        "missing/panel",
        "A library sample names a panel not in panel info.",
        **full_small(
            library_sample_info=small_libraries(
                [("samp_A", "samp_A", "panel1", "run1"), ("samp_B", "samp_B", "panelX", "run1")],
                sequencing=True,
            )
        ),
    )
    case(
        "missing/target",
        "A representative target is not in target info.",
        **full_small(panel_target_info=small_panel("target1")),
    )
    case(
        "missing/bioinfo-run",
        "Detected microhaplotypes name a run not in run info.",
        **full_small(mhap_info=small_mhap(run="runX")),
    )
    case(
        "missing/library-sample",
        "Detected microhaplotypes name a library sample not in library info.",
        **full_small(mhap_info=small_mhap(run="run1", samples=("samp_A", "samp_B", "samp_Z"))),
    )
    case(
        "missing/read-counts-run",
        "Read counts name a run not in run info.",
        **full_small(read_counts_by_stage_info=small_read_counts(run="runX")),
    )
    case(
        "missing/read-counts-library-sample",
        "Read counts name a library sample not in library info.",
        **full_small(read_counts_by_stage_info=small_read_counts(samples=("samp_A", "samp_Q"))),
    )
    case(
        "missing/read-counts-target",
        "Read counts name a target not in target info.",
        **full_small(read_counts_by_stage_info=small_read_counts(target="targetX")),
    )
    case(
        "missing/all-kinds",
        "Every kind of unresolved name at once; Python reports them together.",
        **full_small(
            specimen_info=small_specimens("samp_A", "samp_B", project="other"),
            library_sample_info=small_libraries(
                [("samp_A", "spec_X", "panelX", "runX"), ("samp_B", "samp_B", "panel1", "run1")],
                sequencing=True,
            ),
            panel_target_info=small_panel("target1"),
            mhap_info=small_mhap(run="runX", samples=("samp_A", "samp_B", "samp_Z")),
            read_counts_by_stage_info=[
                small_read_counts(run="runY", samples=("samp_Q",), target="targetX")[0]
            ],
        ),
    )

    # ---- merging "warnings" (Python raises these) ----------------------------
    case(
        "errors/specimen-missing-project-name",
        "Project info given but a specimen has no project_name.",
        **full_small(
            specimen_info=[
                {"specimen_name": "samp_A", "project_name": "PRJNA1040019"},
                {"specimen_name": "samp_B"},
            ]
        ),
    )
    case(
        "errors/library-missing-sequencing-name",
        "Sequencing info given but a library sample has no sequencing_info_name.",
        **full_small(library_sample_info=both_libraries(sequencing=False)),
    )
    case(
        "errors/detected-missing-run-name",
        "Run info given but detected microhaplotypes have no run name.",
        **full_small(mhap_info=small_mhap(run=None)),
    )
    case(
        "errors/read-counts-missing-run-name",
        "Run info given but read counts have no run name.",
        **full_small(read_counts_by_stage_info=small_read_counts(run=None)),
    )
    case(
        "errors/all-merging-warnings",
        "All four missing-name-field conditions at once.",
        **full_small(
            specimen_info=small_specimens("samp_A", "samp_B"),
            library_sample_info=both_libraries(sequencing=False),
            mhap_info=small_mhap(run=None),
            read_counts_by_stage_info=small_read_counts(run=None),
        ),
    )

    # ---- other errors ------------------------------------------------------
    case(
        "errors/missing-required-fields-all",
        "Empty panel and mhap info.",
        panel_target_info={},
        mhap_info={},
    )
    case(
        "errors/missing-required-field-detected",
        "mhap info lacks detected_microhaplotypes.",
        panel_target_info=small_panel(),
        mhap_info={"representative_microhaplotypes": small_mhap()["representative_microhaplotypes"]},
    )
    case(
        "errors/missing-required-field-target-info",
        "panel info lacks target_info.",
        panel_target_info={"panel_info": small_panel()["panel_info"]},
        mhap_info=small_mhap(),
    )
    case(
        "errors/runs-without-methods",
        "Run info with methods None.",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(run="run1"),
        bioinfo_run_info=RUNS,
        specimen_info=small_specimens("samp_A", "samp_B"),
    )
    case(
        "errors/multi-panel-no-metadata",
        "Python test_merge_to_pmo_minimum_info_raise_multi_panel_no_lib.",
        panel_target_info={
            "panel_info": [{"panel_name": "panel1"}, {"panel_name": "panel2"}],
            "target_info": [{"target_name": "target1"}],
        },
        mhap_info={
            "representative_microhaplotypes": {
                "targets": [{"target_name": "target1", "microhaplotypes": []}]
            },
            "detected_microhaplotypes": [
                {
                    "library_samples": [
                        {"library_sample_name": "samp_A", "target_results": []},
                        {"library_sample_name": "samp_B", "target_results": []},
                    ]
                }
            ],
        },
    )
    case(
        "errors/no-panels",
        "Empty panel_info and no metadata (Python IndexError).",
        panel_target_info={"panel_info": [], "target_info": small_panel()["target_info"]},
        mhap_info=small_mhap(),
    )
    case(
        "errors/detected-sample-without-name",
        "A detected library sample has no library_sample_name (Python KeyError).",
        panel_target_info=small_panel(),
        mhap_info={
            "representative_microhaplotypes": {"targets": []},
            "detected_microhaplotypes": [{"library_samples": [{"target_results": []}]}],
        },
    )
    case(
        "errors/specimen-without-name",
        "A specimen record has no specimen_name (Python KeyError).",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        specimen_info=[{"specimen_name": "samp_A"}, {"collection_country": "Kenya"}],
    )
    case(
        "errors/library-without-specimen-name",
        "Specimen and library info, but a library sample has no specimen_name "
        "(Python KeyError).",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        specimen_info=small_specimens("samp_A", "samp_B"),
        library_sample_info=[
            {"library_sample_name": "samp_A", "specimen_name": "samp_A", "panel_name": "panel1"},
            {"library_sample_name": "samp_B", "panel_name": "panel1"},
        ],
    )
    case(
        "errors/library-without-panel-name",
        "A library sample has no panel_name (Python KeyError).",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        library_sample_info=[
            {"library_sample_name": "samp_A", "panel_name": "panel1"},
            {"library_sample_name": "samp_B"},
        ],
    )
    case(
        "errors/library-without-name",
        "Library info alone and a library sample has no library_sample_name "
        "(Python KeyError).",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        library_sample_info=[{"panel_name": "panel1"}],
    )
    case(
        "errors/target-info-without-name",
        "A target_info record has no target_name (Python KeyError).",
        panel_target_info={
            "panel_info": [{"panel_name": "panel1"}],
            "target_info": [{"target_name": "target1"}, {}],
        },
        mhap_info=small_mhap(),
    )
    case(
        "errors/representative-target-without-name",
        "A representative target has no target_name (Python KeyError).",
        panel_target_info=small_panel(),
        mhap_info={
            "representative_microhaplotypes": {"targets": [{"microhaplotypes": []}]},
            "detected_microhaplotypes": [],
        },
        specimen_info=[],
        library_sample_info=[],
    )
    case(
        "errors/detected-without-library-samples",
        "A detected entry has no library_samples while library info is supplied "
        "(Python KeyError).",
        panel_target_info=small_panel(),
        mhap_info={
            "representative_microhaplotypes": small_mhap()["representative_microhaplotypes"],
            "detected_microhaplotypes": [{}],
        },
        specimen_info=[],
        library_sample_info=[],
    )
    case(
        "errors/read-counts-without-library-samples",
        "A read-counts entry has no read_counts_by_library_sample_by_stage "
        "(Python KeyError).",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(),
        read_counts_by_stage_info=[{}],
    )
    case(
        "errors/run-info-without-name",
        "A run record has no bioinformatics_run_name (Python KeyError).",
        panel_target_info=small_panel(),
        mhap_info=small_mhap(run="run1"),
        bioinfo_method_info=METHODS,
        bioinfo_run_info=[{"bioinformatics_methods_id": 0}],
    )

    # ---- tests ported from the Python suite ---------------------------------
    port_python_schema_tests()


def port_python_schema_tests() -> None:
    """test_slim_build_pmo.py and test_schema_validation_integration.py."""
    specimen_df = pd.DataFrame(
        {
            "specimen_name": ["specimen1"],
            "specimen_taxon_id": [[5900]],
            "host_taxon_id": [9606],
            "collection_date": ["2024-01-01"],
            "collection_country": ["Wonderland"],
            "project_name": ["Test Project"],
            "host_age": [35],
            "host_sex": ["female"],
            "lat_lon": ["37.77,-122.42"],
            "specimen_collect_device": ["venipuncture"],
            "specimen_comments": [["no issues"]],
            "specimen_store_loc": ["Freezer 1"],
            "drug_usage": [["DrugX"]],
            "env_broad_scale": ["Urban"],
            "env_local_scale": ["Clinic"],
            "env_medium": ["Blood"],
            "alternate_ids": [["ALT1", "ALT2"]],
            "custom_note": ["Important specimen"],
            "parasite_density": [1200],
            "parasite_density_method": ["microscopy"],
        }
    )
    specimen_kwargs = dict(
        specimen_name_col="specimen_name",
        specimen_taxon_id_col="specimen_taxon_id",
        host_taxon_id_col="host_taxon_id",
        collection_date_col="collection_date",
        collection_country_col="collection_country",
        project_name_col="project_name",
        alternate_identifiers_col="alternate_ids",
        drug_usage_col="drug_usage",
        env_broad_scale_col="env_broad_scale",
        env_local_scale_col="env_local_scale",
        env_medium_col="env_medium",
        host_age_col="host_age",
        host_sex_col="host_sex",
        specimen_collect_device_col="specimen_collect_device",
        specimen_comments_col="specimen_comments",
        specimen_store_loc_col="specimen_store_loc",
        lat_lon_col="lat_lon",
        parasite_density_col="parasite_density",
        parasite_density_method_col="parasite_density_method",
        additional_specimen_cols=["custom_note"],
    )
    specimen_info = specimens(specimen_df, **specimen_kwargs)

    # test_slim_build_pmo.test_minimal_pmo_creation
    slim_panel = panel(
        pd.DataFrame(
            {"target_name": ["target1"], "fwd_primer": ["ATGCATGC"], "rev_primer": ["GCATGCAT"]}
        ),
        "panel1",
    )
    slim_mhap = mhap(
        pd.DataFrame(
            {
                "library_sample_name": ["lib1"],
                "target_name": ["target1"],
                "seq": ["ATGCATGC"],
                "reads": [42],
            }
        )
    )
    slim_lib = [{"library_sample_name": "lib1", "panel_name": "panel1", "specimen_name": "specimen1"}]
    slim_spec = [{"specimen_name": "specimen1"}]
    case(
        "python/slim-no-specimen-meta",
        "test_slim_build_pmo: minimal records with a library-to-specimen key.",
        specimen_info=slim_spec,
        library_sample_info=slim_lib,
        panel_target_info=slim_panel,
        mhap_info=slim_mhap,
    )
    case(
        "python/slim-with-specimen-meta",
        "test_slim_build_pmo: specimen metadata merged in with PMOUpdater.",
        specimen_info=to_plain(
            PMOUpdater.merge_dicts_by_key(slim_spec, copy.deepcopy(specimen_info), "specimen_name")
        ),
        library_sample_info=slim_lib,
        panel_target_info=slim_panel,
        mhap_info=slim_mhap,
    )

    # test_schema_validation_integration.test_full_1_0_0_toy_pmo_validates_against_schema
    library_sample_info = libraries(
        pd.DataFrame(
            {
                "library_sample_name": ["lib1"],
                "sequencing_info_name": ["seq_run1"],
                "specimen_name": ["specimen1"],
                "panel_name": ["panel1"],
                "accession": ["ACC123"],
                "prep_plate_name": ["PlateA"],
                "prep_plate_row": ["B"],
                "prep_plate_col": [3],
                "library_note": ["High quality"],
            }
        ),
        library_sample_name_col="library_sample_name",
        sequencing_info_name_col="sequencing_info_name",
        specimen_name_col="specimen_name",
        panel_name_col="panel_name",
        run_accession_col="accession",
        library_prep_plate_name_col="prep_plate_name",
        library_prep_plate_row_col="prep_plate_row",
        library_prep_plate_col_col="prep_plate_col",
        additional_library_sample_info_cols=["library_note"],
    )
    full_panel = panel(
        pd.DataFrame(
            {
                "target_name": ["target1"],
                "fwd_primer": ["ATGCATGC"],
                "rev_primer": ["GCATGCAT"],
                "reaction": ["rxn1"],
                "forward_start": [100],
                "forward_end": [107],
                "reverse_start": [150],
                "reverse_end": [157],
                "insert_start": [110],
                "insert_end": [149],
                "chrom": ["chr1"],
                "strand": ["+"],
                "ref_seq": ["ATGCGCTA"],
                "gene_name": ["geneA"],
                "target_attributes": ["marker1,marker2"],
                "amplicon_length": [250],
            }
        ),
        "panel1",
        genome_info={
            "name": "TestGenome",
            "genome_version": "v1.0",
            "taxon_id": [9999],
            "url": "https://example.org/genome",
            "chromosomes": ["chr1"],
            "gff_url": "https://example.org/genome.gff",
        },
        reaction_name_col="reaction",
        forward_primers_start_col="forward_start",
        forward_primers_end_col="forward_end",
        reverse_primers_start_col="reverse_start",
        reverse_primers_end_col="reverse_end",
        insert_start_col="insert_start",
        insert_end_col="insert_end",
        chrom_col="chrom",
        strand_col="strand",
        ref_seq_col="ref_seq",
        gene_name_col="gene_name",
        target_attributes_col="target_attributes",
        additional_target_info_cols=["amplicon_length"],
    )
    full_mhap = mhap(
        pd.DataFrame(
            {
                "library_sample_name": ["lib1"],
                "target_name": ["target1"],
                "seq": ["ATGCATGC"],
                "reads": [42],
                "bioinformatics_run_name": ["run1"],
                "umis": [10],
                "microhap_name": ["mh1"],
                "pseudocigar": ["8M"],
                "quality": ["ABCD"],
                "mask_start": ["1"],
                "mask_segment": ["2"],
                "mask_replacement": ["2"],
                "chrom": ["chr1"],
                "start": [120],
                "end": [127],
                "ref_seq": ["ATGC"],
                "strand": ["+"],
                "custom_annotation": ["custom"],
                "custom_detected": ["det-note"],
            }
        ),
        bioinformatics_run_name="bioinformatics_run_name",
        umis_col="umis",
        microhaplotype_name_col="microhap_name",
        pseudocigar_col="pseudocigar",
        pseudocigar_start_col="start",
        pseudocigar_end_col="end",
        quality_col="quality",
        masking_seq_start_col="mask_start",
        masking_seq_segment_size_col="mask_segment",
        masking_replacement_size_col="mask_replacement",
        chrom_col="chrom",
        start_col="start",
        end_col="end",
        ref_seq_col="ref_seq",
        strand_col="strand",
        additional_representative_mhap_cols=["custom_annotation"],
        additional_mhap_detected_cols=["custom_detected"],
    )
    full_read_counts = read_counts(
        pd.DataFrame(
            {
                "library_sample_name": ["lib1"],
                "total_raw_count": [1000],
                "bioinformatics_run_name": ["run1"],
                "library_comment": ["primary run"],
            }
        ),
        "bioinformatics_run_name",
        pd.DataFrame(
            {
                "library_sample_name": ["lib1"],
                "target_name": ["target1"],
                "stage": ["RawReads"],
                "read_count": [800],
                "bioinformatics_run_name": ["run1"],
                "quality_score": [0.98],
                "coverage_depth": [150],
            }
        ),
        additional_library_sample_cols=["library_comment"],
        additional_target_cols=["quality_score", "coverage_depth"],
    )
    case(
        "python/schema-integration-full",
        "test_schema_validation_integration full toy PMO (panel with a genome, so "
        "targeted_genomes passes through).",
        specimen_info=specimen_info,
        library_sample_info=library_sample_info,
        sequencing_info=[
            {
                "sequencing_info_name": "seq_run1",
                "seq_platform": "ILLUMINA",
                "seq_instrument_model": "NextSeq 2000",
                "library_layout": "PAIRED",
                "library_strategy": "AMPLICON",
                "library_source": "GENOMIC",
                "library_selection": "PCR",
                "library_kit": "MiSeq Reagent Kit v3",
                "seq_center": "UCSF Core",
                "seq_date": "2024-01-15",
                "nucl_acid_amp": "https://example.org/amp",
                "nucl_acid_ext": "https://example.org/ext",
            }
        ],
        panel_target_info=full_panel,
        mhap_info=full_mhap,
        bioinfo_method_info=[
            {
                "methods": [
                    {"program": "Cutadapt", "program_version": "v1.0.0"},
                    {"program": "DADA2", "program_version": "v1.0.0"},
                    {"program": "CustomFilter", "program_version": "v2.0.0"},
                ]
            }
        ],
        bioinfo_run_info=[
            {
                "bioinformatics_run_name": "run1",
                "bioinformatics_methods_id": 0,
                "run_date": "2024-02-01",
                "run_comments": "First batch",
            }
        ],
        project_info=[
            {
                "project_name": "Test Project",
                "project_description": "Toy project for schema validation.",
                "project_type": "Surveillance",
                "project_contributors": ["Alice", "Bob"],
                "BioProject_accession": "PRJNA12345",
            }
        ],
        read_counts_by_stage_info=full_read_counts,
    )


if __name__ == "__main__":
    main()
