"""Oracle cases for ``read_count_by_stage_table_to_pmo``.

Run from ``conformance/``: ``.venv/bin/python -m oracle.gen_read_counts``
"""

from __future__ import annotations

import shutil

import numpy as np
import pandas as pd
from pmotools.pmo_builder.read_count_by_stage_table_to_pmo import (
    read_count_by_stage_table_to_pmo,
)

from oracle.common import CASES, read_table, run_case

F = read_count_by_stage_table_to_pmo

NUMERIC_NAMES = (
    "pmotools-ts writes library sample, target, stage and run names as strings and "
    "compares them as strings (AGENTS.md: names are compared and written as strings), "
    "so numeric names come out as text and 1 matches '1'."
)
MISSING_NAME = (
    "Python writes a bare NaN as a name, which is not valid JSON. pmotools-ts throws "
    "PmoError read-counts/missing-name instead."
)
EMPTY_TABLE = (
    "A pmotools-ts Table with no rows has no columns, so an empty table cannot carry a "
    "run-name column or required columns. pmotools-ts skips column checks on empty "
    "tables, which matches Python for a header-only CSV but not for a DataFrame with "
    "no columns at all."
)


def totals() -> pd.DataFrame:
    """The total-raw-count table from the Python test suite."""
    return pd.DataFrame(
        {
            "library_sample_name": ["sample1", "sample2", "sample3"],
            "total_raw_count": [1000, 2000, 1500],
            "additional_info": ["info1", "info2", "info3"],
        }
    )


def reads_long() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "library_sample_name": ["sample1"] * 3 + ["sample2"] * 3,
            "target_name": ["target1", "target1", "target2"] * 2,
            "stage": ["demultiplexed", "denoised", "demultiplexed"] * 2,
            "reads": [100, 80, 50, 200, 150, 75],
        }
    )


def reads_wide() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "library_sample_name": ["sample1", "sample2"],
            "target_name": ["target1", "target1"],
            "demultiplexed": [100, 200],
            "denoised": [80, 150],
            "filtered": [60, 120],
        }
    )


def small_totals() -> pd.DataFrame:
    return pd.DataFrame({"library_sample_name": ["s1", "s2"], "total_raw_count": [10, 20]})


def small_wide() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "library_sample_name": ["s1", "s1", "s2"],
            "target_name": ["t2", "t1", "t1"],
            "b": [1, 2, 3],
            "a": [4, 5, 6],
        }
    )


def long_rows(samples, targets, stages, counts, **extra) -> pd.DataFrame:
    return pd.DataFrame(
        {
            "library_sample_name": samples,
            "target_name": targets,
            "stage": stages,
            "read_count": counts,
            **extra,
        }
    )


def multi_run_totals() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "library_sample_name": ["sample1", "sample2", "sample1", "sample2"],
            "total_raw_count": [1000, 2000, 1500, 2500],
            "bioinformatics_run_name": ["run1", "run1", "run2", "run2"],
        }
    )


def case(case_id: str, **kwargs) -> None:
    tables = {}
    for name in ("total_raw_count_table", "reads_by_stage_table"):
        if isinstance(kwargs.get(name), pd.DataFrame):
            tables[name] = kwargs.pop(name)
    note = kwargs.pop("note", None)
    divergence = kwargs.pop("divergence", None)
    run_case(
        f"read_counts/{case_id}",
        F,
        tables=tables,
        kwargs=kwargs,
        note=note,
        divergence=divergence,
    )


def example_cases() -> None:
    raw = read_table("example_raw_reads.txt")
    per_stage = read_table("reads_per_stage.txt")
    example_cols = dict(
        library_sample_name_col="sample",
        total_raw_count_col="raw_count",
        target_name_col="target",
        stage_col="stage",
        read_count_col="reads",
    )
    case(
        "examples/long_example_tables",
        total_raw_count_table=raw,
        reads_by_stage_table=per_stage,
        bioinformatics_run_name="run1",
        note="example_raw_reads.txt with reads_per_stage.txt, as the PMO Builder app calls it",
        **example_cols,
    )
    case(
        "examples/long_example_tables_no_run_name",
        total_raw_count_table=raw,
        reads_by_stage_table=per_stage,
        note="Without a run name the output has no bioinformatics_run_name key",
        **example_cols,
    )
    case(
        "examples/raw_reads_only",
        total_raw_count_table=raw,
        bioinformatics_run_name="run1",
        library_sample_name_col="sample",
        total_raw_count_col="raw_count",
        note="Only the total-raw-count table: no read_counts_for_targets",
    )

    coverage = read_table("mad4hatter_amplicon_coverage.txt")
    first_samples = list(coverage["SampleID"].unique()[:4])
    subset = coverage[coverage["SampleID"].isin(first_samples)].groupby("SampleID").head(4)
    subset = subset.reset_index(drop=True)
    coverage_totals = (
        subset[subset["SampleID"].isin(first_samples[:3])]
        .groupby("SampleID", sort=False)["Reads"]
        .sum()
        .mul(3)
        .reset_index()
        .rename(columns={"Reads": "total_raw_count"})
    )
    case(
        "examples/mad4hatter_wide",
        total_raw_count_table=coverage_totals,
        reads_by_stage_table=subset,
        bioinformatics_run_name="mad4hatter_run",
        library_sample_name_col="SampleID",
        target_name_col="Locus",
        stage_col=["Reads", "OutputDada2", "OutputPostprocessing"],
        note=(
            "Wide format from the first four loci of four samples in "
            "mad4hatter_amplicon_coverage.txt; the fourth sample is not in the totals "
            "and is dropped"
        ),
    )

    demux = read_table("mad4hatter_demultiplexed_example.csv").head(12)
    demux_totals = pd.DataFrame(
        {"SampleID": list(demux["SampleID"].unique()), "total_raw_count": 1000}
    )
    case(
        "examples/mad4hatter_demultiplexed_one_stage",
        total_raw_count_table=demux_totals,
        reads_by_stage_table=demux,
        bioinformatics_run_name="demux_run",
        library_sample_name_col="SampleID",
        target_name_col="Locus",
        stage_col=["Reads"],
        note=(
            "Wide format with a single stage column, first 12 rows of "
            "mad4hatter_demultiplexed_example.csv. SRR26819303 and SRR26819507 each repeat "
            "a locus and Python keeps the last count; pmotools-ts also warns "
            "read-counts/duplicate-stages"
        ),
    )


def python_test_cases() -> None:
    case(
        "pytest/basic_long",
        total_raw_count_table=totals(),
        reads_by_stage_table=reads_long(),
        bioinformatics_run_name="test_run",
        read_count_col="reads",
        note="test_basic_functionality_long_format; sample3 has no reads",
    )
    case(
        "pytest/basic_wide",
        total_raw_count_table=totals(),
        reads_by_stage_table=reads_wide(),
        bioinformatics_run_name="test_run",
        stage_col=["demultiplexed", "denoised", "filtered"],
        note="test_basic_functionality_wide_format / test_wide_format_melt_conversion",
    )
    case(
        "pytest/only_total",
        total_raw_count_table=totals(),
        bioinformatics_run_name="test_run",
        note="test_only_total_raw_count_table",
    )
    case(
        "pytest/custom_column_names",
        total_raw_count_table=pd.DataFrame(
            {"sample_id": ["sample1", "sample2"], "raw_count": [1000, 2000]}
        ),
        reads_by_stage_table=pd.DataFrame(
            {
                "sample_id": ["sample1", "sample1"],
                "locus": ["target1", "target1"],
                "pipeline_stage": ["demultiplexed", "denoised"],
                "counts": [100, 80],
            }
        ),
        bioinformatics_run_name="test_run",
        library_sample_name_col="sample_id",
        target_name_col="locus",
        total_raw_count_col="raw_count",
        stage_col="pipeline_stage",
        read_count_col="counts",
        note="test_custom_column_names",
    )
    case(
        "pytest/additional_library_sample_columns",
        total_raw_count_table=totals(),
        bioinformatics_run_name="test_run",
        additional_library_sample_cols=["additional_info"],
        note="test_additional_columns",
    )
    case(
        "pytest/additional_target_columns",
        total_raw_count_table=totals(),
        reads_by_stage_table=pd.DataFrame(
            {
                "library_sample_name": ["sample1", "sample1", "sample2"],
                "target_name": ["target1", "target1", "target1"],
                "stage": ["demultiplexed", "denoised", "demultiplexed"],
                "read_count": [100, 80, 200],
                "quality_score": [0.95, 0.98, 0.92],
                "coverage_depth": [50, 40, 100],
            }
        ),
        bioinformatics_run_name="test_run",
        additional_target_cols=["quality_score", "coverage_depth"],
        note="test_additional_target_columns",
    )
    case(
        "pytest/total_not_a_table",
        total_raw_count_table="not_a_dataframe",
        bioinformatics_run_name="test_run",
        note="test_input_validation: total_raw_count_table is a string",
    )
    case(
        "pytest/reads_not_a_table",
        total_raw_count_table=totals(),
        reads_by_stage_table="not_a_dataframe",
        bioinformatics_run_name="test_run",
        note="test_input_validation: reads_by_stage_table is a string",
    )
    case(
        "pytest/missing_total_columns",
        total_raw_count_table=pd.DataFrame(
            {"wrong_col": ["sample1", "sample2"], "total_raw_count": [1000, 2000]}
        ),
        bioinformatics_run_name="test_run",
        note="test_missing_columns: no library_sample_name column",
    )
    case(
        "pytest/missing_reads_columns",
        total_raw_count_table=totals(),
        reads_by_stage_table=pd.DataFrame(
            {
                "library_sample_name": ["sample1"],
                "wrong_col": ["target1"],
                "stage": ["demultiplexed"],
                "read_count": [100],
            }
        ),
        bioinformatics_run_name="test_run",
        note="test_missing_columns: no target_name column",
    )
    case(
        "pytest/duplicate_library_samples",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["sample1", "sample1"], "total_raw_count": [1000, 2000]}
        ),
        bioinformatics_run_name="test_run",
        note="test_duplicate_library_samples",
    )
    case(
        "pytest/missing_additional_library_sample_column",
        total_raw_count_table=totals(),
        bioinformatics_run_name="test_run",
        additional_library_sample_cols=["nonexistent_column"],
        note="test_additional_columns_validation",
    )
    case(
        "pytest/float_read_count_truncated",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1"], ["target1"], ["demultiplexed"], [100.5]),
        note="test_numeric_read_counts: int() truncates 100.5 to 100",
    )
    case(
        "pytest/missing_additional_value_skipped",
        total_raw_count_table=pd.DataFrame(
            {
                "library_sample_name": ["sample1", "sample2"],
                "total_raw_count": [1000, 2000],
                "optional_info": ["info1", np.nan],
            }
        ),
        additional_library_sample_cols=["optional_info"],
        note="test_missing_values_handling: a missing additional value is left out",
    )
    case(
        "pytest/multiple_runs_from_column",
        total_raw_count_table=multi_run_totals(),
        reads_by_stage_table=pd.DataFrame(
            {
                "library_sample_name": ["sample1", "sample1", "sample2", "sample2"],
                "target_name": ["target1"] * 4,
                "stage": ["demultiplexed", "denoised", "demultiplexed", "denoised"],
                "read_count": [100, 80, 200, 150],
                "bioinformatics_run_name": ["run1", "run1", "run1", "run2"],
            }
        ),
        bioinformatics_run_name="bioinformatics_run_name",
        note="test_multiple_runs_from_column: the run name is a column in both tables",
    )
    case(
        "pytest/multiple_runs_without_reads_table",
        total_raw_count_table=multi_run_totals(),
        bioinformatics_run_name="bioinformatics_run_name",
        note="test_multiple_runs_without_reads_table",
    )
    case(
        "pytest/multiple_runs_reads_without_run_column",
        total_raw_count_table=multi_run_totals(),
        reads_by_stage_table=pd.DataFrame(
            {
                "library_sample_name": ["sample1", "sample2"],
                "target_name": ["target1", "target1"],
                "stage": ["demultiplexed", "demultiplexed"],
                "read_count": [100, 200],
            }
        ),
        bioinformatics_run_name="bioinformatics_run_name",
        note="test_multiple_runs_reads_table_without_run_column: reads apply to every run",
    )


def wide_cases() -> None:
    case(
        "wide/stage_order",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide(),
        stage_col=["b", "a"],
        note="Stages follow the stage_col list; targets follow first appearance",
    )
    case(
        "wide/empty_stage_list",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide(),
        stage_col=[],
        note="An empty stage list melts to no rows",
    )
    case(
        "wide/repeated_stage_column",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide(),
        stage_col=["b", "a", "b"],
        note="melt uses each stage column once",
    )
    case(
        "wide/stage_column_is_id_column",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide(),
        stage_col=["target_name"],
        note="melt drops value columns that are also id columns, leaving no rows",
    )
    case(
        "wide/missing_stage_column",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide(),
        stage_col=["b", "zz"],
        note="pandas melt raises KeyError for a missing value column",
    )
    case(
        "wide/missing_target_column",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide().rename(columns={"target_name": "x"}),
        stage_col=["b"],
        note="pandas melt raises KeyError for a missing id column",
    )
    case(
        "wide/read_count_column_exists",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide().assign(read_count=[0, 0, 0]),
        stage_col=["b"],
        note="melt refuses a value_name that is already a column",
    )
    case(
        "wide/unused_stage_column_present",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide().assign(stage=["x", "y", "z"]),
        stage_col=["b"],
        note="A column named stage that is not an id column is ignored",
    )
    case(
        "wide/additional_column_named_stage",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide().assign(stage=["x", "y", "z"]),
        stage_col=["b"],
        additional_target_cols=["stage"],
        note="An id column named stage collides with melt's var_name and Python fails",
    )
    case(
        "wide/additional_column_is_target_column",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide(),
        stage_col=["b"],
        additional_target_cols=["target_name"],
        note="A repeated id column makes Python fail",
    )
    case(
        "wide/missing_count",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide().assign(a=[1, np.nan, 3]),
        stage_col=["b", "a"],
        note="int(NaN) fails",
    )
    case(
        "wide/additional_target_columns",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide().assign(q=[0.5, np.nan, "x"], unused=[1, 2, 3]),
        stage_col=["a", "b"],
        additional_target_cols=["q"],
        note="Additional target columns repeat on every stage; missing values are left out",
    )


def count_cases() -> None:
    case(
        "counts/missing_read_count",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1"], ["t"], ["x"], [np.nan]),
        note="int(NaN) fails",
    )
    case(
        "counts/missing_read_count_unmatched_sample",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1", "zz"], ["t", "t"], ["x", "x"], [1, np.nan]),
        note="Counts are converted for every row, even rows later dropped",
    )
    case(
        "counts/missing_total_raw_count",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["s1", "s2"], "total_raw_count": [10, np.nan]}
        ),
        note="int(NaN) fails",
    )
    case(
        "counts/string_counts",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["s1", "s2", "s3"], "total_raw_count": ["10", " 2_0 ", "-7"]}
        ),
        reads_by_stage_table=long_rows(["s1"], ["t"], ["x"], ["+5"]),
        note="int() parses integer strings, with whitespace, sign and underscores",
    )
    case(
        "counts/decimal_string_count",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["s1"], "total_raw_count": ["10.0"]}
        ),
        note="int('10.0') fails",
    )
    case(
        "counts/text_count",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1"], ["t"], ["x"], ["many"]),
        note="int('many') fails",
    )
    case(
        "counts/negative_float_and_bool",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["s1", "s2"], "total_raw_count": [-3.7, 2.9]}
        ),
        reads_by_stage_table=long_rows(["s1", "s1"], ["t", "t"], ["x", "y"], [True, False]),
        note="int() truncates toward zero and maps booleans to 1 and 0",
    )


def name_cases() -> None:
    case(
        "names/duplicate_stage_overwrites",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(
            ["s1"] * 4, ["t", "t", "t", "u"], ["x", "y", "x", "x"], [1, 2, 3, 4]
        ),
        note=(
            "A repeated (sample, target, stage) keeps its first position and the last "
            "count. pmotools-ts also warns read-counts/duplicate-stages"
        ),
    )
    case(
        "names/reads_sample_not_in_totals",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1", "zz", "yy"], ["t"] * 3, ["x"] * 3, [1, 2, 3]),
        note=(
            "Reads for samples missing from the totals are dropped. pmotools-ts also "
            "warns read-counts/unmatched-library-samples"
        ),
    )
    case(
        "names/missing_sample_in_reads",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1", np.nan], ["t", "t"], ["x", "x"], [1, 2]),
        note=(
            "A reads row with no sample name never matches and is dropped. pmotools-ts "
            "also warns read-counts/unmatched-library-samples"
        ),
    )
    case(
        "names/missing_target_and_stage_unmatched",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1", "zz"], ["t", np.nan], ["x", np.nan], [1, 2]),
        note="Missing names on a dropped row do not matter",
    )
    case(
        "names/missing_sample_in_totals",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["s1", np.nan], "total_raw_count": [1, 2]}
        ),
        divergence=MISSING_NAME,
    )
    case(
        "names/missing_samples_in_totals_duplicated",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["s1", np.nan, np.nan], "total_raw_count": [1, 2, 3]}
        ),
        note="duplicated() treats two NaN names as the same name",
    )
    case(
        "names/missing_target",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1", "s1"], [np.nan, "t"], ["x", "x"], [1, 2]),
        divergence=MISSING_NAME,
    )
    case(
        "names/missing_stage",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1", "s1"], ["t", "t"], ["x", np.nan], [1, 2]),
        divergence=MISSING_NAME,
    )
    case(
        "names/numeric_names",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": [1, 2], "total_raw_count": [1, 2], "q": [0.5, 0.25]}
        ),
        reads_by_stage_table=pd.DataFrame(
            {
                "library_sample_name": ["1", 2],
                "target_name": [5, 5],
                "stage": [1, 1],
                "read_count": [1, 2],
            }
        ),
        additional_library_sample_cols=["q"],
        note="Python writes 1.0 (iterrows upcasts the row) and does not match reads sample '1'",
        divergence=NUMERIC_NAMES,
    )
    case(
        "names/duplicate_number_and_text",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": [1, "1"], "total_raw_count": [1, 2]}
        ),
        note="Python sees 1 and '1' as different samples",
        divergence=NUMERIC_NAMES + " Here that makes 1 and '1' duplicates, so pmotools-ts throws.",
    )
    case(
        "names/empty_string_names",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["", "s2"], "total_raw_count": [1, 2]}
        ),
        reads_by_stage_table=long_rows([""], [""], [""], [3]),
        note="Empty strings are names, not missing values",
    )


def additional_cases() -> None:
    case(
        "additional/target_columns_without_reads_table",
        total_raw_count_table=small_totals(),
        additional_target_cols=["nope"],
        note="additional_target_cols are only checked when there is a reads table",
    )
    case(
        "additional/missing_target_column",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1"], ["t"], ["x"], [1]),
        additional_target_cols=["nope"],
    )
    case(
        "additional/empty_list",
        total_raw_count_table=small_totals(),
        additional_library_sample_cols=[],
        additional_target_cols=[],
    )
    case(
        "additional/named_total_raw_count",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["s1"], "raw": [5], "total_raw_count": ["x"]}
        ),
        total_raw_count_col="raw",
        additional_library_sample_cols=["total_raw_count"],
        note="An additional column named total_raw_count replaces the count",
    )
    case(
        "additional/named_library_sample_name",
        total_raw_count_table=pd.DataFrame(
            {"sid": ["s1"], "total_raw_count": [5], "library_sample_name": ["other"]}
        ),
        library_sample_name_col="sid",
        additional_library_sample_cols=["library_sample_name"],
        note="An additional column named library_sample_name replaces the name in place",
    )
    case(
        "additional/named_reads",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1"], ["t"], ["x"], [1], reads=[99], other=["q"]),
        additional_target_cols=["reads"],
        note="An additional target column named reads replaces the count in place",
    )
    case(
        "additional/missing_values_in_reads",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(
            ["s1", "s1"], ["t", "t"], ["x", "y"], [1, 2], q=[np.nan, True], r=[None, "a"]
        ),
        additional_target_cols=["q", "r"],
    )


def run_cases() -> None:
    case(
        "runs/no_run_name",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1"], ["t"], ["x"], [1]),
        note="No run name: a one-entry list without bioinformatics_run_name",
    )
    case(
        "runs/run_column_listed_as_additional",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["a"], "total_raw_count": [1], "r": ["x"]}
        ),
        bioinformatics_run_name="r",
        additional_library_sample_cols=["r"],
        note="The run column is dropped before additional columns are read",
    )
    case(
        "runs/run_name_is_sample_column",
        total_raw_count_table=small_totals(),
        bioinformatics_run_name="library_sample_name",
        note="A run name that matches a column splits on that column, then the sample column is gone",
    )
    case(
        "runs/run_name_matches_reads_column_only",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows(["s1"], ["t"], ["x"], [1], r=["q"]),
        bioinformatics_run_name="r",
        note="Only a column of the total table makes the run name a column",
    )
    case(
        "runs/reads_with_unknown_run",
        total_raw_count_table=multi_run_totals(),
        reads_by_stage_table=pd.DataFrame(
            {
                "library_sample_name": ["sample1", "sample1", "sample2"],
                "target_name": ["t"] * 3,
                "stage": ["x"] * 3,
                "read_count": [1, 2, 3],
                "bioinformatics_run_name": ["run1", "run9", np.nan],
            }
        ),
        bioinformatics_run_name="bioinformatics_run_name",
        note=(
            "Reads rows whose run is not in the totals are dropped. pmotools-ts also "
            "warns read-counts/unmatched-runs"
        ),
    )
    case(
        "runs/missing_run_value",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["a", "b"], "total_raw_count": [1, 2], "r": ["x", np.nan]}
        ),
        bioinformatics_run_name="r",
        note="Python writes an entry named NaN with no samples and loses sample b",
        divergence=(
            "Python writes a bare NaN run name, which is not valid JSON, and silently loses "
            "the rows. pmotools-ts throws PmoError read-counts/missing-name."
        ),
    )
    case(
        "runs/numeric_run_values",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": ["a", "b"], "total_raw_count": [1, 2], "r": [1, 2]}
        ),
        reads_by_stage_table=long_rows(["a"], ["t"], ["s"], [1], r=["1"]),
        bioinformatics_run_name="r",
        divergence=NUMERIC_NAMES,
    )
    case(
        "runs/duplicate_sample_across_runs",
        total_raw_count_table=multi_run_totals(),
        bioinformatics_run_name="bioinformatics_run_name",
        note="Duplicate names are checked per run, so one sample may appear in several runs",
    )


def empty_cases() -> None:
    case(
        "empty/totals_with_columns",
        total_raw_count_table=pd.DataFrame({"library_sample_name": [], "total_raw_count": []}),
        bioinformatics_run_name="r1",
    )
    case(
        "empty/totals_without_columns",
        total_raw_count_table=pd.DataFrame(),
        bioinformatics_run_name="r1",
        divergence=EMPTY_TABLE + " pmotools-ts returns one run with no samples.",
    )
    case(
        "empty/totals_with_run_column",
        total_raw_count_table=pd.DataFrame(
            {"library_sample_name": [], "total_raw_count": [], "r": []}
        ),
        bioinformatics_run_name="r",
        divergence=EMPTY_TABLE
        + " pmotools-ts cannot see the run column, so it returns one run named 'r' with no samples.",
    )
    case(
        "empty/reads_with_columns",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=long_rows([], [], [], []),
    )
    case(
        "empty/wide_reads_with_columns",
        total_raw_count_table=small_totals(),
        reads_by_stage_table=small_wide().head(0),
        stage_col=["b", "a"],
    )


def main() -> None:
    shutil.rmtree(CASES / "read_counts", ignore_errors=True)
    example_cases()
    python_test_cases()
    wide_cases()
    count_cases()
    name_cases()
    additional_cases()
    run_cases()
    empty_cases()


if __name__ == "__main__":
    main()
