"""Oracle cases for ``pmotools.pmo_builder.mhap_table_to_pmo.mhap_table_to_pmo``.

Run from ``conformance/``: ``.venv/bin/python -m oracle.gen_mhap``
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from pmotools.pmo_builder.mhap_table_to_pmo import mhap_table_to_pmo

from .common import read_table, run_case

NAMES_AS_STRINGS = (
    "pmotools-ts writes target_name, library_sample_name and bioinformatics_run_name as "
    "strings (the PMO schema types them as strings, and names are compared as strings in "
    "pmotools-ts). Groups are still ordered as pandas orders them. The test compares against "
    "the Python value with those names converted to strings."
)

MAD4HATTER_COLS = {
    "library_sample_name_col": "SampleID",
    "target_name_col": "Locus",
    "seq_col": "ASV",
    "reads_col": "Reads",
}


def small_table() -> pd.DataFrame:
    """The table from pmotools-python's test_mhap_table_to_pmo.py."""
    return pd.DataFrame(
        {
            "library_sample_name": [
                "sample1", "sample1", "sample1", "sample2", "sample2", "sample2", "sample2",
                "sample3", "sample3", "sample4", "sample5", "sample5", "sample5",
            ],
            "target_name": [
                "target1", "target2", "target3", "target1", "target2", "target2", "target3",
                "target1", "target2", "target1", "target1", "target1", "target3",
            ],
            "seq": [
                "ACTG", "TTTT", "GGG", "ACTG", "TTTT", "TTTA", "AAG",
                "ATTG", "TTTA", "ACTG", "ATTG", "ATTA", "GGG",
            ],
            "reads": [10, 100, 10, 1, 12, 53, 73, 76, 6, 297, 123, 1, 17],
            "bioinf_run": [
                "run1", "run1", "run1", "run2", "run2", "run2", "run2",
                "run1", "run1", "run2", "run3", "run3", "run3",
            ],
        }
    )


def tiny(**extra) -> pd.DataFrame:
    """Three rows, two samples, two targets; ``extra`` adds or replaces columns."""
    data = {
        "library_sample_name": ["s1", "s1", "s2"],
        "target_name": ["t1", "t2", "t1"],
        "seq": ["A", "C", "G"],
        "reads": [1, 2, 3],
    }
    data.update(extra)
    return pd.DataFrame(data)


def case(case_id: str, table: pd.DataFrame, note: str, divergence: str | None = None, **kwargs) -> None:
    run_case(
        f"mhap/{case_id}",
        mhap_table_to_pmo,
        tables={"microhaplotype_table": table},
        kwargs=kwargs,
        note=note,
        divergence=divergence,
    )


def main() -> None:
    # --- plain path on the example tables -------------------------------------------------
    case(
        "example_single_run",
        read_table("mad4hatter_allele_data_example.csv"),
        "MAD4HatTeR allele table with a literal run name.",
        bioinformatics_run_name="run1",
        **MAD4HATTER_COLS,
    )
    case(
        "example_multi_run",
        read_table("mad4hatter_allele_data_example_multi_bioinfo.csv"),
        "MAD4HatTeR allele table split per run by the bioinfo_runs column.",
        bioinformatics_run_name="bioinfo_runs",
        **MAD4HATTER_COLS,
    )
    case(
        "example_name_and_detected_cols",
        read_table("mad4hatter_allele_data_example.csv"),
        "Allele as microhaplotype_name, PseudoCIGAR carried on detected entries as an extra column.",
        bioinformatics_run_name="run1",
        microhaplotype_name_col="Allele",
        additional_mhap_detected_cols=["PseudoCIGAR"],
        **MAD4HATTER_COLS,
    )

    # --- ported from the Python test suite -----------------------------------------------
    case("small_literal_run", small_table(), "Python test_mhap_table_to_pmo, literal run name.",
         bioinformatics_run_name="run1")
    case("small_run_column", small_table(), "Python test multi_bioinf_run_name: split by the bioinf_run column.",
         bioinformatics_run_name="bioinf_run")
    case("small_no_run_name", small_table(), "No run name: the detected entry has no bioinformatics_run_name key.")
    loc = pd.DataFrame(
        {
            "target_name": ["target1", "target2", "target3"],
            "chrom": ["chrom1", "chrom2", "chrom3"],
            "start": [1, 2, 3],
            "end": [4, 5, 6],
            "ref": ["ACTG", "TTTT", "GGG"],
        }
    )
    case("location_ref_seq", small_table().merge(loc), "Python test with_loc: location plus ref_seq.",
         chrom_col="chrom", start_col="start", end_col="end", ref_seq_col="ref")
    masking = pd.DataFrame(
        {
            "target_name": ["target1", "target2"],
            "masking_seq_start": ["5,92", "4"],
            "masking_seq_segment_size": ["30,12", "6"],
            "masking_replacement_size": ["30,13", "6"],
        }
    )
    case("masking", small_table().merge(masking, how="left"),
         "Python test masking: delimited strings, missing for target3 so no masking key.",
         masking_seq_start_col="masking_seq_start",
         masking_seq_segment_size_col="masking_seq_segment_size",
         masking_replacement_size_col="masking_replacement_size")
    ad = small_table()
    ad["adcol1"] = "this"
    ad["adcol2"] = "that"
    case("additional_representative_cols", ad, "Python test with_ad_cols.",
         additional_representative_mhap_cols=["adcol1", "adcol2"])
    cig = small_table()
    cig["chrom"] = "chr1"
    cig["start"] = 100
    cig["end"] = 150
    cig["cig"] = "8M"
    case("pseudocigar_reuses_location", cig,
         "Python test with_pseudocigar: chrom comes from chrom_col, genome_id defaults to genome_id.",
         chrom_col="chrom", start_col="start", end_col="end",
         pseudocigar_col="cig", pseudocigar_start_col="start", pseudocigar_end_col="end")
    cig = small_table()
    cig["cig"] = "8M"
    case("error_pseudocigar_without_ref_loc_columns", cig,
         "Python test pseudocigar_without_ref_loc_columns_raises.", pseudocigar_col="cig")

    # --- ordering and the mhaps_target_id index ------------------------------------------
    case(
        "unsorted_targets",
        pd.DataFrame(
            {
                "library_sample_name": ["sB", "sB", "sB", "sA", "sA"],
                "target_name": ["t3", "t1", "t2", "t2", "t3"],
                "seq": ["CCC", "AAA", "GGG", "GGT", "CCC"],
                "reads": [303, 101, 202, 205, 306],
            }
        ),
        "Targets out of order in the input: mhaps_target_id must index the sorted representative targets.",
    )
    case(
        "code_point_order",
        pd.DataFrame(
            {
                "library_sample_name": ["b", "B", "a", "_", "b"],
                "target_name": ["tb", "tB", "ta", "t_", "t10"],
                "seq": ["A", "C", "G", "T", "TT"],
                "reads": [1, 2, 3, 4, 5],
            }
        ),
        "Text keys sort by code point: 'B' < '_' < 'a' < 'b', 't10' < 'tB'.",
    )
    case(
        "rows_keep_input_order",
        pd.DataFrame(
            {
                "library_sample_name": ["s1", "s1", "s1", "s2", "s2"],
                "target_name": ["t1", "t1", "t1", "t1", "t1"],
                "seq": ["ZZ", "AA", "MM", "AA", "ZZ"],
                "reads": [1, 2, 3, 4, 5],
            }
        ),
        "Microhaplotypes and detected rows inside a group keep first-appearance order, not seq order.",
    )
    case(
        "numeric_names",
        pd.DataFrame(
            {
                "library_sample_name": [10, 9, 100, 10],
                "target_name": [2, 10, 1, 10],
                "seq": ["A", "C", "G", "T"],
                "reads": [1, 2, 3, 4],
                "run": [7, 7, 5, 7],
            }
        ),
        "Integer target, sample and run names: groups sort numerically (2 < 10), runs in first-seen order.",
        divergence=NAMES_AS_STRINGS,
        bioinformatics_run_name="run",
    )
    case(
        "mixed_number_and_string_name",
        tiny(target_name=[10, "10", 10]),
        "A target column holding both 10 and '10': pandas keeps two targets that serialise to the same name.",
        divergence=(
            "pmotools-ts compares names as strings, so 10 and '10' are one target named '10' with "
            "microhaplotypes A, C, G; Python emits two targets, 10 and '10'."
        ),
    )
    case(
        "run_name_first_seen_order",
        tiny(run=["zeta", "alpha", "zeta"]),
        "Runs come out in first-appearance order, not sorted.",
        bioinformatics_run_name="run",
    )
    case(
        "run_name_not_a_column",
        tiny(run=["r9", "r9", "r9"]),
        "bioinformatics_run_name that is not a column is used as the literal run name.",
        bioinformatics_run_name="run1",
    )

    # --- duplicates -------------------------------------------------------------------------
    case(
        "duplicate_detected_rows",
        tiny(library_sample_name=["s1", "s1", "s1"], target_name=["t1", "t1", "t1"], seq=["A", "A", "C"]),
        "The same sample/target/seq twice gives two detected entries with the same mhap_id.",
    )
    case(
        "same_seq_two_annotations",
        tiny(target_name=["t1", "t1", "t1"], seq=["A", "A", "C"], alt=["x", "y", "x"]),
        "Deduplication is over every selected column: seq A appears twice (warning) and detected rows point at the last copy.",
        alt_annotations_col="alt",
    )
    case(
        "location_from_first_row",
        tiny(chrom=["c1", "c2", "c3"], start=[10, 20, 30], end=[11, 21, 31], strand=["+", "-", "+"]),
        "Location differs between rows of t1: the first row wins; strand and genome_id are carried.",
        chrom_col="chrom", start_col="start", end_col="end", strand_col="strand", genome_id=3,
    )

    # --- optional column groups ------------------------------------------------------------
    case(
        "location_missing_chrom_on_first_row",
        tiny(chrom=[np.nan, "c2", "c1"], start=[10, 20, 30], end=[11, 21, 31], ref=["AC", np.nan, "AG"]),
        "No mhap_location when the target's first row has no chrom; missing ref_seq is left out.",
        chrom_col="chrom", start_col="start", end_col="end", ref_seq_col="ref",
    )
    case(
        "pseudocigar_full",
        tiny(
            cig=["1M", np.nan, "3M"],
            pchrom=["p1", "p2", "p3"],
            pstart=[1, 2, 3],
            pend=[5, 6, 7],
            pref=["ACGT", np.nan, "TTTT"],
            pstrand=["+", "-", np.nan],
            pdesc=["by hand", "tool", np.nan],
        ),
        "Pseudocigar with its own chrom column, ref_seq, strand, description and genome id; missing pseudocigar is left out.",
        pseudocigar_col="cig",
        pseudocigar_chrom_col="pchrom",
        pseudocigar_start_col="pstart",
        pseudocigar_end_col="pend",
        pseudocigar_ref_seq_col="pref",
        pseudocigar_strand_col="pstrand",
        pseudocigar_generation_description_col="pdesc",
        pseudocigar_genome_id=4,
        genome_id=1,
    )
    case(
        "error_pseudocigar_row_missing_ref_loc",
        tiny(cig=["1M", "2M", "3M"], pchrom=["p1", "p2", "p3"], pstart=[1, np.nan, 3], pend=[5, 6, 7]),
        "A row with a pseudocigar but no ref_loc start raises.",
        pseudocigar_col="cig", pseudocigar_chrom_col="pchrom",
        pseudocigar_start_col="pstart", pseudocigar_end_col="pend",
    )
    case(
        "quality_and_name",
        tiny(q=["I", np.nan, "#"], name=["mA", "mC", np.nan]),
        "quality and microhaplotype_name, each left out where missing.",
        quality_col="q", microhaplotype_name_col="name",
    )
    case(
        "umis",
        tiny(u=[5, np.nan, 7]),
        "umis on detected entries, left out where missing.",
        umis_col="u",
    )
    case(
        "alt_annotations",
        tiny(alt=["syn", np.nan, "nonsyn"]),
        "alt_annotations copied as the cell value.",
        alt_annotations_col="alt",
    )
    case(
        "masking_integers",
        tiny(ms=[5, 5, 7], mz=[1, 1, 2], mr=[1, 1, 3]),
        "Integer masking columns are formatted with str() and parsed back.",
        masking_seq_start_col="ms", masking_seq_segment_size_col="mz", masking_replacement_size_col="mr",
    )
    case(
        "masking_custom_delim_and_gaps",
        tiny(ms=["1;;3", " 4 ", "+5;6;7"], mz=["1;2;3", "1", "1;2"], mr=["1;2;3", "1", "1;2;3"]),
        "Custom delimiter; empty pieces are skipped, int() strips spaces and signs, zip stops at the shortest list.",
        masking_seq_start_col="ms", masking_seq_segment_size_col="mz", masking_replacement_size_col="mr",
        masking_delim=";",
    )
    case(
        "masking_float_column",
        tiny(ms=[5, 5, np.nan], mz=[1, 1, np.nan], mr=[1, 1, np.nan]),
        "A numeric masking column with a missing value is float64, so str() gives '5.0' and int() raises.",
        divergence=(
            "pmotools-ts accepts whole numbers in masking columns regardless of dtype (5.0 is 5), "
            "so microhaplotypes A (t1) and C (t2) get masking [{5, 1, 1}] and G (t1) has none. Python's "
            "ValueError comes from str() of a float, not from bad input."
        ),
        masking_seq_start_col="ms", masking_seq_segment_size_col="mz", masking_replacement_size_col="mr",
    )
    case(
        "error_masking_not_an_integer",
        tiny(ms=["5", "x", "7"], mz=["1", "1", "1"], mr=["1", "1", "1"]),
        "A masking value int() cannot parse raises.",
        masking_seq_start_col="ms", masking_seq_segment_size_col="mz", masking_replacement_size_col="mr",
    )
    case(
        "error_masking_fractional",
        tiny(ms=[5.5, 5.5, 7.5], mz=[1, 1, 1], mr=[1, 1, 1]),
        "A fractional masking value raises.",
        masking_seq_start_col="ms", masking_seq_segment_size_col="mz", masking_replacement_size_col="mr",
    )
    case(
        "additional_falsy_values",
        tiny(a=[0, "", False], b=[0, "", False], c=["keep", np.nan, "x"]),
        "Representative extra columns drop falsy values (0, '', False); detected extra columns keep them.",
        additional_representative_mhap_cols=["a", "c"],
        additional_mhap_detected_cols=["b", "c"],
    )
    case(
        "additional_detected_renamed_columns",
        tiny(Reads=[1, 2, 3]).drop(columns="reads"),
        "Detected extra columns are looked up after renaming: 'seq' and 'reads' resolve, mhap_cols order kept.",
        reads_col="Reads",
        additional_mhap_detected_cols=["seq", "reads", "target_name"],
    )
    case(
        "error_additional_detected_original_name",
        tiny(Reads=[1, 2, 3]).drop(columns="reads"),
        "A detected extra column named by its pre-rename name ('Reads') is missing.",
        reads_col="Reads",
        additional_mhap_detected_cols=["Reads"],
    )
    case(
        "error_additional_representative_missing",
        tiny(),
        "Missing representative extra column raises ValueError.",
        additional_representative_mhap_cols=["nope"],
    )
    case(
        "error_additional_detected_missing",
        tiny(),
        "Missing detected extra column raises ValueError.",
        additional_mhap_detected_cols=["nope"],
    )
    case(
        "error_masking_columns_incomplete",
        tiny(ms=["1", "1", "1"]),
        "Only one of the three masking columns set.",
        masking_seq_start_col="ms",
    )
    case(
        "error_location_columns_incomplete",
        tiny(chrom=["c", "c", "c"], ref=["A", "A", "A"]),
        "ref_seq_col and chrom_col without start_col/end_col.",
        chrom_col="chrom", ref_seq_col="ref",
    )
    case("error_missing_target_column", tiny(), "target_name_col not in the table.", target_name_col="Locus")
    case("error_missing_optional_column", tiny(), "quality_col not in the table.", quality_col="q")
    case("error_missing_reads_column", tiny().drop(columns="reads"), "reads_col not in the table.",
         reads_col="Reads")
    case("error_missing_sample_column", tiny().drop(columns="library_sample_name"),
         "library_sample_name_col not in the table.", library_sample_name_col="SampleID")
    case("reads_column_fallback", tiny(), "reads_col missing but a 'reads' column exists: it is used.",
         reads_col="Reads")
    case("error_missing_umis_column", tiny(), "umis_col not in the table.", umis_col="u")
    case(
        "rename_collision",
        tiny(Reads=[10, 20, 30]),
        "reads_col='Reads' while a 'reads' column also exists: pandas holds two 'reads' columns and writes a Series per row.",
        divergence="pmotools-ts reads the column named by reads_col (10, 20, 30); Python's per-row Series is not a read count.",
        reads_col="Reads",
    )
    case(
        "sample_column_fallback",
        tiny(),
        "library_sample_name_col missing but a 'library_sample_name' column exists: rename is a no-op and it is used.",
        library_sample_name_col="SampleID",
    )

    # --- missing values ----------------------------------------------------------------------
    case(
        "missing_sample_dropped",
        tiny(library_sample_name=["s1", np.nan, "s2"]),
        "A row with no library sample name is silently dropped from detected results.",
    )
    case(
        "error_missing_target_value",
        tiny(target_name=["t1", np.nan, "t1"]),
        "A row with no target name raises 'Missing target_name(s)'.",
    )
    case(
        "missing_reads_value",
        tiny(reads=[1, np.nan, 3]),
        "A missing read count is written as reads: NaN.",
        divergence="pmotools-ts throws PmoError mhap/missing-reads: NaN is not valid JSON and reads is a required number.",
    )
    case(
        "missing_seq_value",
        tiny(seq=["A", np.nan, "G"]),
        "A missing seq is written as a representative microhaplotype with seq: NaN.",
        divergence="pmotools-ts throws PmoError mhap/missing-seq: NaN is not valid JSON and seq is a required string.",
    )
    case(
        "missing_run_value",
        tiny(run=["r1", np.nan, "r1"]),
        "A missing value in the run column yields an empty detected entry with bioinformatics_run_name NaN.",
        divergence="pmotools-ts throws PmoError mhap/missing-run-name: NaN is not valid JSON and the row would be lost.",
        bioinformatics_run_name="run",
    )
    case(
        "missing_location_end",
        tiny(chrom=["c", "c", "c"], start=[1, 1, 1], end=[np.nan, 2, 2]),
        "The first row of t1 has chrom but no end, so mhap_location.end is NaN.",
        divergence="pmotools-ts throws PmoError mhap/incomplete-location: NaN is not valid JSON and end is a required integer.",
        chrom_col="chrom", start_col="start", end_col="end",
    )
    case(
        "empty_table",
        pd.DataFrame({"library_sample_name": [], "target_name": [], "seq": [], "reads": []}),
        "No rows: no targets and one detected entry with no samples.",
        bioinformatics_run_name="run1",
    )


if __name__ == "__main__":
    main()
