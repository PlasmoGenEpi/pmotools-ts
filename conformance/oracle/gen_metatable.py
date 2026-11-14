"""Oracle cases for pmotools.pmo_builder.metatable_to_pmo.

Covers ``specimen_info_table_to_pmo`` and ``library_sample_info_table_to_pmo``,
and through them ``add_plate_info`` and ``add_parasite_density_info``.

Run with ``cd conformance && .venv/bin/python -m oracle.gen_metatable``.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from pmotools.pmo_builder.metatable_to_pmo import (
    library_sample_info_table_to_pmo,
    specimen_info_table_to_pmo,
)

from oracle.common import TABLES, run_case

SPECIMEN = specimen_info_table_to_pmo
LIBRARY = library_sample_info_table_to_pmo

#: The recommended specimen columns, mapped to themselves.
RECOMMENDED = {
    "specimen_name_col": "specimen_name",
    "specimen_taxon_id_col": "specimen_taxon_id",
    "host_taxon_id_col": "host_taxon_id",
    "collection_date_col": "collection_date",
    "collection_country_col": "collection_country",
    "project_name_col": "project_name",
}

#: The four library name columns, mapped to themselves.
LIBRARY_NAMES = {
    "library_sample_name_col": "library_sample_name",
    "sequencing_info_name_col": "sequencing_info_name",
    "specimen_name_col": "specimen_name",
    "panel_name_col": "panel_name",
}


def excel(name: str) -> pd.DataFrame:
    return pd.read_excel(TABLES / name)


def specimen_frame(n: int = 2, **extra) -> pd.DataFrame:
    """The specimen frame the Python tests use, with extra columns appended."""
    base = {
        "specimen_name": [f"sample{i + 1}" for i in range(n)],
        "specimen_taxon_id": [5833] * n,
        "host_taxon_id": [9606] * n,
        "collection_date": ["01/02/2023"] * n,
        "collection_country": ["Mozambique", "Ghana", "Kenya", "Tanzania"][:n],
        "project_name": [f"project{i + 1}" for i in range(n)],
    }
    base.update(extra)
    return pd.DataFrame(base)


def library_frame(n: int = 2, **extra) -> pd.DataFrame:
    base = {
        "library_sample_name": [f"sample{i + 1}_MH_run1" for i in range(n)],
        "sequencing_info_name": ["run1"] * n,
        "specimen_name": [f"sample{i + 1}" for i in range(n)],
        "panel_name": ["MH"] * n,
    }
    base.update(extra)
    return pd.DataFrame(base)


def names_frame(**columns) -> pd.DataFrame:
    """Two specimens and nothing else, for exercising the plate and density helpers."""
    return pd.DataFrame({"specimen_name": ["sample1", "sample2"], **columns})


def spec(case_id: str, df: pd.DataFrame | None, note: str, divergence: str | None = None, **kwargs) -> None:
    tables = {} if df is None else {"contents": df}
    run_case(f"metatable/specimen/{case_id}", SPECIMEN, tables=tables, kwargs=kwargs, note=note, divergence=divergence)


def lib(case_id: str, df: pd.DataFrame | None, note: str, divergence: str | None = None, **kwargs) -> None:
    tables = {} if df is None else {"contents": df}
    run_case(f"metatable/library/{case_id}", LIBRARY, tables=tables, kwargs=kwargs, note=note, divergence=divergence)


# --------------------------------------------------------------------------
# Example spreadsheets
# --------------------------------------------------------------------------


def example_cases() -> None:
    mad = excel("mad4hatter_metadata_example.xlsx")
    multi = excel("mad4hatter_metadata_example_multi_panel.xlsx")
    alt = excel("alternative_metadata_names.xlsx")

    mad_specimen = dict(
        specimen_name_col="specimen_id",
        specimen_taxon_id_col="samp_taxon_id",
        host_taxon_id_col="host_taxon_id",
        collection_date_col="collection_date",
        collection_country_col="collection_country",
        project_name_col="project_name",
        lat_lon_col="lat_lon",
        geo_admin3_col="geo_admin3",
        specimen_collect_device_col="samp_collect_device",
        specimen_store_loc_col="samp_store_loc",
        additional_specimen_cols=["collector"],
    )
    spec("example_mad4hatter", mad, "The mad4hatter example sheet as the PMO Builder app maps it.", **mad_specimen)
    spec(
        "example_mad4hatter_minimal",
        mad,
        "Only the required specimen name column; every other column is ignored.",
        specimen_name_col="specimen_id",
    )
    spec(
        "example_mad4hatter_storage_plate",
        mad,
        "The plate columns used as storage plate info.",
        specimen_name_col="specimen_id",
        storage_plate_name_col="plate_name",
        storage_plate_row_col="plate_row",
        storage_plate_col_col="plate_col",
    )
    spec("example_multi_panel", multi, "The multi-panel example sheet.", **mad_specimen)
    spec(
        "example_alternative_names",
        alt,
        "Every column has a non-default name.",
        specimen_name_col="name",
        specimen_taxon_id_col="organismid",
        host_taxon_id_col="host_taxon_id",
        collection_date_col="sampling_date",
        collection_country_col="geo_admin0",
        project_name_col="reasearch_proj",
        lat_lon_col="lat_lon",
        geo_admin3_col="geo_admin3",
        specimen_collect_device_col="sampling_tool",
        specimen_store_loc_col="current_location",
        additional_specimen_cols=["field_sampler"],
    )

    mad_library = dict(
        library_sample_name_col="experiment_sample_id",
        specimen_name_col="specimen_id",
        panel_name_col="panel_id",
        sequencing_info_name_col="sequencing_info_id",
        library_prep_plate_name_col="plate_name",
        library_prep_plate_row_col="plate_row",
        library_prep_plate_col_col="plate_col",
    )
    lib("example_mad4hatter", mad, "The mad4hatter example sheet as library samples, with prep plate.", **mad_library)
    lib("example_multi_panel", multi, "The multi-panel example sheet as library samples.", **mad_library)
    lib(
        "example_alternative_names",
        alt,
        "Library samples from the sheet with non-default names.",
        library_sample_name_col="run_accession",
        specimen_name_col="name",
        panel_name_col="assay",
        sequencing_info_name_col="run",
        library_prep_plate_name_col="plate_name",
        library_prep_plate_row_col="plate_row",
        library_prep_plate_col_col="plate_col",
        additional_library_sample_info_cols=["field_sampler"],
    )
    lib(
        "example_mad4hatter_no_sequencing_info",
        mad,
        "sequencing_info_name_col left unset, so it is neither checked nor written.",
        library_sample_name_col="experiment_sample_id",
        specimen_name_col="specimen_id",
        panel_name_col="panel_id",
    )


# --------------------------------------------------------------------------
# Ported from tests/test_pmo_builder/test_metatable_to_pmo.py
# --------------------------------------------------------------------------


def ported_plate_cases() -> None:
    # add_plate_info is exercised through the specimen builder (entry storage_plate_info).
    spec(
        "plate_position_uppercase",
        names_frame(plate_position=["A01", "H11"], plate_name=["Plate1", "Plate1"]),
        "test_add_plate_info_position_parsing_uppercase",
        storage_plate_name_col="plate_name",
        storage_plate_position_col="plate_position",
    )
    spec(
        "plate_position_lowercase",
        names_frame(plate_position=["a01", "h11"], plate_name=["Plate1", "Plate1"]),
        "test_add_plate_info_position_parsing_lowercase",
        storage_plate_name_col="plate_name",
        storage_plate_position_col="plate_position",
    )
    spec(
        "plate_position_one_digit",
        names_frame(plate_position=["a1", "h10"], plate_name=["Plate1", "Plate1"]),
        "test_add_plate_info_position_parsing_one_digit",
        storage_plate_name_col="plate_name",
        storage_plate_position_col="plate_position",
    )
    spec(
        "plate_position_bad_row",
        names_frame(plate_position=["A01", "K10"], plate_name=["Plate1", "Plate1"]),
        "test_add_plate_info_position_fails_with_out_of_bounds_row",
        storage_plate_name_col="plate_name",
        storage_plate_position_col="plate_position",
    )
    spec(
        "plate_position_bad_col",
        names_frame(plate_position=["A01", "H19"], plate_name=["Plate1", "Plate1"]),
        "test_add_plate_info_position_fails_with_out_of_bounds_col",
        storage_plate_name_col="plate_name",
        storage_plate_position_col="plate_position",
    )
    spec(
        "plate_row_col",
        names_frame(plate_row=["A", "h"], plate_col=[1, 10], plate_name=["Plate1", "Plate1"]),
        "test_add_plate_info_row_col_parsing: rows are upper-cased",
        storage_plate_name_col="plate_name",
        storage_plate_row_col="plate_row",
        storage_plate_col_col="plate_col",
    )
    both = names_frame(
        plate_position=["A01", "H19"], plate_row=["A", "h"], plate_col=[1, 10], plate_name=["Plate1", "Plate1"]
    )
    spec(
        "plate_position_and_row_col",
        both,
        "test_add_plate_info_fails_with_position_and_row_col",
        storage_plate_name_col="plate_name",
        storage_plate_row_col="plate_row",
        storage_plate_col_col="plate_col",
        storage_plate_position_col="plate_position",
    )
    spec(
        "plate_row_without_col",
        both,
        "test_add_plate_info_fails_with_row_and_without_col",
        storage_plate_name_col="plate_name",
        storage_plate_row_col="plate_row",
    )
    spec(
        "plate_col_without_row",
        both,
        "The mirror of test_add_plate_info_fails_with_row_and_without_col",
        storage_plate_col_col="plate_col",
    )
    spec(
        "plate_none",
        both,
        "test_add_plate_info_adds_nothing: no plate options, plate columns ignored",
    )
    spec(
        "plate_row_col_blank_cells",
        names_frame(plate_row=["A", None], plate_col=[1, None], plate_name=["Plate1", None]),
        "test_add_plate_info_row_col_skips_blank_cells",
        storage_plate_name_col="plate_name",
        storage_plate_row_col="plate_row",
        storage_plate_col_col="plate_col",
    )
    spec(
        "plate_position_blank_cells",
        pd.DataFrame(
            {
                "specimen_name": ["sample1", "sample2", "sample3"],
                "plate_position": ["A01", None, "  "],
                "plate_name": ["Plate1", float("nan"), ""],
            }
        ),
        "test_add_plate_info_position_skips_blank_cells",
        storage_plate_name_col="plate_name",
        storage_plate_position_col="plate_position",
    )
    spec(
        "plate_position_invalid_among_blanks",
        names_frame(plate_position=[None, "K10"]),
        "test_add_plate_info_position_fails_with_invalid_value_among_blanks",
        storage_plate_position_col="plate_position",
    )


def ported_density_cases() -> None:
    two = names_frame(density1=[15, 107], method1=["qPCR", "qPCR"], density2=[10, 100], method2=["microscopy", "microscopy"])
    spec(
        "density_single",
        names_frame(parasite_density=[10, 100], parasite_density_method=["qPCR", "microscopy"]),
        "test_add_parasite_density_info_single_value",
        parasite_density_col="parasite_density",
        parasite_density_method_col="parasite_density_method",
    )
    spec(
        "density_lists",
        two,
        "test_add_parasite_density_info_from_list",
        parasite_density_col=["density1", "density2"],
        parasite_density_method_col=["method1", "method2"],
    )
    spec("density_none", names_frame(), "test_add_parasite_density_adds_nothing")
    spec(
        "density_unequal_lists",
        two,
        "test_add_parasite_density_fails_with_unequal_lists",
        parasite_density_col=["density1"],
        parasite_density_method_col=["method1", "method2"],
    )
    spec(
        "density_method_without_density",
        names_frame(method1=["qPCR", "qPCR"]),
        "test_add_parasite_density_fails_with_no_density",
        parasite_density_method_col="method1",
    )
    spec(
        "density_method_list_without_density",
        names_frame(method1=["qPCR", "qPCR"]),
        "Method given as a list with no density column",
        parasite_density_method_col=["method1"],
    )
    spec(
        "density_string_with_method_list",
        two,
        "test_add_parasite_density_fails_with_type_mismatch (TypeError)",
        parasite_density_col="density1",
        parasite_density_method_col=["method1", "method2"],
    )
    spec(
        "density_list_with_method_string",
        two,
        "Density list with a method string is a TypeError",
        parasite_density_col=["density1", "density2"],
        parasite_density_method_col="method1",
    )
    spec(
        "density_list_without_methods",
        two,
        "Density list and no methods: entries have no parasite_density_method",
        parasite_density_col=["density1", "density2"],
    )
    spec(
        "density_bad_type",
        two,
        "A density column that is neither string, list nor None is a TypeError",
        parasite_density_col=5,
    )


def ported_specimen_cases() -> None:
    spec("default", specimen_frame(), "test_specimen_info_table_to_pmo_default", **RECOMMENDED)
    spec(
        "with_plate_info",
        specimen_frame(storage_plate_col=[1, 2], storage_plate_name=["plate1", "plate1"], storage_plate_row=["A", "B"]),
        "test_specimen_info_table_to_pmo_with_plate_info",
        **RECOMMENDED,
        storage_plate_col_col="storage_plate_col",
        storage_plate_name_col="storage_plate_name",
        storage_plate_row_col="storage_plate_row",
    )
    spec(
        "with_parasitemia",
        specimen_frame(parasite_density=[10, 100], parasite_density_method=["qPCR", "microscopy"]),
        "test_specimen_info_table_to_pmo_with_parasitemia",
        **RECOMMENDED,
        parasite_density_col="parasite_density",
        parasite_density_method_col="parasite_density_method",
    )
    spec(
        "with_additional_columns",
        specimen_frame(special_field_1=["something", "something_else"], special_field_2=["this", "that"]),
        "test_specimen_info_table_to_pmo_with_additional_columns",
        **RECOMMENDED,
        additional_specimen_cols=["special_field_1", "special_field_2"],
    )
    spec(
        "duplicate_selected_column",
        specimen_frame(),
        "test_specimen_info_table_to_pmo_fails_with_col_duplicate",
        **RECOMMENDED,
        drug_usage_col="specimen_name",
    )
    spec(
        "missing_column",
        specimen_frame(),
        "test_specimen_info_table_to_pmo_fails_with_missing_col",
        **RECOMMENDED,
        drug_usage_col="drug_usage",
    )
    spec(
        "missing_columns_several",
        specimen_frame(),
        "Several missing columns, including an additional one",
        **RECOMMENDED,
        drug_usage_col="drug_usage",
        lat_lon_col="latlon",
        additional_specimen_cols=["extra"],
    )
    spec(
        "not_a_table",
        None,
        "test_specimen_info_table_to_pmo_fails_without_df",
        contents="test",
        **RECOMMENDED,
    )
    nulls = {
        "specimen_name": ["sample1", None],
        "specimen_taxon_id": [5833, None],
        "host_taxon_id": [None, 9606],
        "collection_date": ["01/02/2023", None],
        "collection_country": [None, "Ghana"],
        "project_name": ["project1", None],
    }
    for column, values in nulls.items():
        spec(
            f"null_in_{column}",
            specimen_frame(**{column: values}),
            f"test_specimen_info_table_to_pmo_fails_with_null_in_required_columns: {column}",
            **RECOMMENDED,
        )
    spec(
        "null_in_several",
        specimen_frame(specimen_name=["sample1", None], specimen_taxon_id=[5833, None]),
        "test_specimen_info_table_to_pmo_fails_with_null_in_required_columns: several",
        **RECOMMENDED,
    )
    spec(
        "removes_empty_optional_fields",
        specimen_frame(
            4,
            lat_lon=["", "-25.123,31.456", None, "-1.234,36.789"],
            host_age=[None, 25, None, 30],
            host_sex=["M", "", None, "F"],
            geo_admin1=[None, "Province1", "", "Province2"],
        ),
        "test_specimen_info_table_to_pmo_removes_empty_optional_fields",
        **RECOMMENDED,
        lat_lon_col="lat_lon",
        host_age_col="host_age",
        host_sex_col="host_sex",
        geo_admin1_col="geo_admin1",
    )
    spec(
        "geo_fields",
        pd.DataFrame(
            {
                "specimen_name": ["sample1", "sample2"],
                "specimen_taxon_id": [5833, 5833],
                "host_taxon_id": [9606, 9606],
                "collection_date": ["2023-03-29", "2023-03-20"],
                "collection_country": ["Eswatini", "Eswatini"],
                "project_name": ["RegGenE8", "RegGenE8"],
                "geo_admin1": ["Lubombo", "Lubombo"],
                "geo_admin2": ["Sithobela", "Sithobela"],
                "geo_admin3": ["CABRINI MINISTRIES HEALTH CARE", "SITHOBELA RURAL HEALTH CENTER"],
                "lat_lon": ["", ""],
            }
        ),
        "test_specimen_info_table_to_pmo_with_geo_fields",
        **RECOMMENDED,
        geo_admin1_col="geo_admin1",
        geo_admin2_col="geo_admin2",
        geo_admin3_col="geo_admin3",
        lat_lon_col="lat_lon",
    )
    spec(
        "no_plate_or_density_options",
        specimen_frame(),
        "test_specimen_info_table_to_pmo_removes_empty_dict_list, first half: every plate/density option None",
        **RECOMMENDED,
        storage_plate_col_col=None,
        storage_plate_name_col=None,
        storage_plate_row_col=None,
        storage_plate_position_col=None,
        parasite_density_col=None,
        parasite_density_method_col=None,
    )
    spec(
        "density_all_none",
        specimen_frame(1, parasite_density=[None]),
        "test_specimen_info_table_to_pmo_removes_empty_dict_list, second half: an object column of None adds nothing",
        **RECOMMENDED,
        parasite_density_col="parasite_density",
        parasite_density_method_col=None,
    )
    spec(
        "host_fields",
        specimen_frame(
            3,
            host_age=[25, None, 30],
            host_sex=["M", "F", ""],
            host_subject_name=["SUB001", "", "SUB003"],
            gravid=[True, None, False],
            gravidity=[2, None, 0],
        ),
        "test_specimen_info_table_to_pmo_with_host_fields",
        **RECOMMENDED,
        host_age_col="host_age",
        host_sex_col="host_sex",
        host_subject_name_col="host_subject_name",
        gravid_col="gravid",
        gravidity_col="gravidity",
    )
    spec(
        "specimen_fields",
        specimen_frame(
            specimen_accession=["ACC001", ""],
            specimen_type=["field_sample", None],
            specimen_collect_device=["needle", ""],
            specimen_store_loc=[None, "freezer1"],
            specimen_comments=["", "Some comment"],
        ),
        "test_specimen_info_table_to_pmo_with_specimen_fields",
        divergence=(
            "pmotools-ts omits specimen_comments for sample1, whose cell is blank. Python splits the blank cell "
            'into [""], which is not an empty list and so survives; [""] fails the schema item pattern.'
        ),
        **RECOMMENDED,
        specimen_accession_col="specimen_accession",
        specimen_type_col="specimen_type",
        specimen_collect_device_col="specimen_collect_device",
        specimen_store_loc_col="specimen_store_loc",
        specimen_comments_col="specimen_comments",
    )
    spec(
        "environment_fields",
        specimen_frame(
            env_broad_scale=["terrestrial", ""],
            env_local_scale=[None, "forest"],
            env_medium=["soil", None],
        ),
        "test_specimen_info_table_to_pmo_with_environment_fields",
        **RECOMMENDED,
        env_broad_scale_col="env_broad_scale",
        env_local_scale_col="env_local_scale",
        env_medium_col="env_medium",
    )
    spec(
        "other_optional_fields",
        specimen_frame(
            3,
            blood_meal=[True, None, False],
            has_travel_out_six_month=[None, True, ""],
            treatment_status=["cured", "", None],
            specimen_accession=["ACC001", None, "ACC003"],
        ),
        "test_specimen_info_table_to_pmo_with_other_optional_fields",
        divergence=(
            "pmotools-ts omits treatment_status for sample2 and sample3, whose cells are blank. Python writes "
            '[""] for both, which fails the schema item pattern.'
        ),
        **RECOMMENDED,
        blood_meal_col="blood_meal",
        has_travel_out_six_month_col="has_travel_out_six_month",
        treatment_status_col="treatment_status",
        specimen_accession_col="specimen_accession",
    )


def ported_library_cases() -> None:
    lib("default", library_frame(), "test_library_sample_info_table_to_pmo_default", **LIBRARY_NAMES)
    lib(
        "with_plate",
        library_frame(
            library_prep_plate_col=[1, 2],
            library_prep_plate_name=["plate1", "plate1"],
            library_prep_plate_row=["A", "B"],
            alternate_identifiers=["positive_control,3D7", "sample2_MH_run1_repooled"],
        ),
        "test_library_sample_info_table_to_pmo_with_plate",
        **LIBRARY_NAMES,
        library_prep_plate_name_col="library_prep_plate_name",
        library_prep_plate_col_col="library_prep_plate_col",
        library_prep_plate_row_col="library_prep_plate_row",
        alternate_identifiers_col="alternate_identifiers",
    )
    lib(
        "with_additional_columns",
        library_frame(new_col1=["test", "this"], new_col2=["add", "one"]),
        "test_library_sample_info_table_to_pmo_with_additional_columns",
        **LIBRARY_NAMES,
        additional_library_sample_info_cols=["new_col1", "new_col2"],
    )
    lib(
        "duplicate_selected_column",
        library_frame(),
        "test_library_sample_info_table_to_pmo_fails_with_duplicate_cols",
        library_sample_name_col="library_sample_name",
        sequencing_info_name_col="sequencing_info_name",
        panel_name_col="panel_name",
        specimen_name_col="panel_name",
    )
    lib(
        "missing_columns",
        pd.DataFrame({"library_sample_name": ["sample1_MH_run1", "sample2_MH_run1"], "sequencing_info_name": ["run1", "run1"]}),
        "test_library_sample_info_table_to_pmo_fails_with_missing_cols",
        **LIBRARY_NAMES,
    )
    lib("not_a_table", None, "test_library_sample_info_table_to_pmo_fails_without_df", contents="test", **LIBRARY_NAMES)
    lib(
        "null_in_library_sample_name",
        library_frame(library_sample_name=["sample1_MH_run1", None]),
        "test_library_sample_info_table_to_pmo_fails_with_null_in_required_columns: library_sample_name",
        **LIBRARY_NAMES,
    )
    lib(
        "null_in_specimen_name",
        library_frame(specimen_name=["sample1", None]),
        "test_library_sample_info_table_to_pmo_fails_with_null_in_required_columns: specimen_name",
        **LIBRARY_NAMES,
    )
    lib(
        "null_in_panel_name",
        library_frame(panel_name=[None, "MH"]),
        "test_library_sample_info_table_to_pmo_fails_with_null_in_required_columns: panel_name",
        **LIBRARY_NAMES,
    )
    lib(
        "null_in_sequencing_info_name",
        library_frame(sequencing_info_name=[None, "run1"]),
        "A null sequencing info name is an error when the column is selected",
        **LIBRARY_NAMES,
    )
    lib(
        "null_in_several",
        pd.DataFrame(
            {
                "library_sample_name": ["sample1_MH_run1", None],
                "specimen_name": [None, "sample2"],
                "panel_name": ["MH", "MH"],
            }
        ),
        "test_library_sample_info_table_to_pmo_fails_with_null_in_required_columns: several",
        library_sample_name_col="library_sample_name",
        specimen_name_col="specimen_name",
        panel_name_col="panel_name",
    )
    lib(
        "new_optional_fields",
        library_frame(
            alternate_identifiers=["ID1,ID2", ""],
            experiment_accession=["EXP001", None],
            fastqs_loc=[None, "/path/to/fastqs"],
            run_accession=["RUN001", ""],
        ),
        "test_library_sample_info_table_to_pmo_with_new_optional_fields",
        divergence=(
            "pmotools-ts omits alternate_identifiers for sample2, whose cell is an empty string. Python writes "
            '[""], which fails the schema item pattern.'
        ),
        **LIBRARY_NAMES,
        alternate_identifiers_col="alternate_identifiers",
        experiment_accession_col="experiment_accession",
        fastqs_loc_col="fastqs_loc",
        run_accession_col="run_accession",
    )
    lib(
        "removes_empty_optional_fields",
        library_frame(
            3,
            alternate_identifiers=["ID1", "", None],
            experiment_accession=["EXP001", None, "EXP003"],
            fastqs_loc=[None, "/path/to/fastqs", ""],
        ),
        "test_library_sample_info_table_to_pmo_removes_empty_optional_fields",
        divergence=(
            "pmotools-ts omits alternate_identifiers for sample2 and sample3, whose cells are blank. Python "
            'writes [""] for both, which fails the schema item pattern.'
        ),
        **LIBRARY_NAMES,
        alternate_identifiers_col="alternate_identifiers",
        experiment_accession_col="experiment_accession",
        fastqs_loc_col="fastqs_loc",
    )
    lib(
        "parasite_density",
        library_frame(parasite_density=[10, 100], parasite_density_method=["qPCR", "microscopy"]),
        "test_library_sample_info_table_to_pmo_with_parasite_density",
        **LIBRARY_NAMES,
        parasite_density_col="parasite_density",
        parasite_density_method_col="parasite_density_method",
    )
    lib(
        "parasite_density_multiple",
        library_frame(density1=[15, 107], method1=["qPCR", "qPCR"], density2=[10, 100], method2=["microscopy", "microscopy"]),
        "test_library_sample_info_table_to_pmo_with_parasite_density_multiple",
        **LIBRARY_NAMES,
        parasite_density_col=["density1", "density2"],
        parasite_density_method_col=["method1", "method2"],
    )
    lib(
        "all_new_fields",
        library_frame(
            alternate_identifiers=["ID1", "ID2"],
            experiment_accession=["EXP001", "EXP002"],
            fastqs_loc=["/path/to/fastqs1", "/path/to/fastqs2"],
            run_accession=["RUN001", "RUN002"],
            parasite_density=[10, 100],
            parasite_density_method=["qPCR", "microscopy"],
            library_prep_plate_col=[1, 2],
            library_prep_plate_name=["plate1", "plate1"],
            library_prep_plate_row=["A", "B"],
        ),
        "test_library_sample_info_table_to_pmo_with_all_new_fields",
        **LIBRARY_NAMES,
        alternate_identifiers_col="alternate_identifiers",
        experiment_accession_col="experiment_accession",
        fastqs_loc_col="fastqs_loc",
        run_accession_col="run_accession",
        parasite_density_col="parasite_density",
        parasite_density_method_col="parasite_density_method",
        library_prep_plate_col_col="library_prep_plate_col",
        library_prep_plate_name_col="library_prep_plate_name",
        library_prep_plate_row_col="library_prep_plate_row",
    )


# --------------------------------------------------------------------------
# Beyond the Python tests
# --------------------------------------------------------------------------


ALL_SPECIMEN_COLUMNS = {
    "specimen_taxon_id_col": "taxon",
    "host_taxon_id_col": "host_taxon",
    "collection_date_col": "date",
    "collection_country_col": "country",
    "project_name_col": "project",
    "alternate_identifiers_col": "alt_ids",
    "blood_meal_col": "blood_meal",
    "drug_usage_col": "drugs",
    "env_broad_scale_col": "env_broad",
    "env_local_scale_col": "env_local",
    "env_medium_col": "env_medium",
    "geo_admin1_col": "admin1",
    "geo_admin2_col": "admin2",
    "geo_admin3_col": "admin3",
    "gravid_col": "gravid",
    "gravidity_col": "gravidity",
    "has_travel_out_six_month_col": "travelled",
    "host_age_col": "age",
    "host_sex_col": "sex",
    "host_subject_name_col": "subject",
    "lat_lon_col": "latlon",
    "parasite_density_col": "density",
    "parasite_density_method_col": "density_method",
    "specimen_accession_col": "accession",
    "storage_plate_name_col": "plate",
    "storage_plate_position_col": "well",
    "specimen_collect_device_col": "device",
    "specimen_comments_col": "comments",
    "specimen_store_loc_col": "store",
    "specimen_type_col": "type",
    "treatment_status_col": "treatment",
}


def all_specimen_frame() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "name": ["S1", "S2", "S3"],
            "taxon": ["5833", "5833,5855", "5833"],
            "host_taxon": [9606, 9606, 9606],
            "date": ["2023-01-02", "2023-01", "2023"],
            "country": ["Ghana", "Kenya", "Mali"],
            "project": ["P1", "P1", "P2"],
            "alt_ids": ["a1,a2", "b1", "c1"],
            "blood_meal": [True, False, True],
            "drugs": ["AL", "AL,DP", "none"],
            "env_broad": ["lowlands", "highlands", "lowlands"],
            "env_local": ["rural", "urban", "rural"],
            "env_medium": ["blood", "blood", "blood"],
            "admin1": ["R1", "R2", "R3"],
            "admin2": ["D1", "D2", "D3"],
            "admin3": ["C1", "C2", "C3"],
            "gravid": [False, True, False],
            "gravidity": [0, 2, 1],
            "travelled": [False, False, True],
            "age": [3.5, 40, 0.25],
            "sex": ["F", "M", "F"],
            "subject": ["H1", "H2", "H3"],
            "latlon": ["5.6,-0.2", "-1.3,36.8", "12.6,-8.0"],
            "density": [1200.5, 30, 0],
            "density_method": ["qPCR", "microscopy", "qPCR"],
            "accession": ["SAMN1", "SAMN2", "SAMN3"],
            "plate": ["PL1", "PL1", "PL2"],
            "well": ["A01", "b12", "H7"],
            "device": ["DBS", "whole blood", "DBS"],
            "comments": ["ok", "re-run,low volume", "ok"],
            "store": ["UCSF", "UCSF", "MRC"],
            "type": ["field_sample", "positive_control", "field_sample"],
            "treatment": ["cured", "failed,reinfected", "cured"],
            "extra_number": [1.5, 2, 3],
            "extra_text": ["x", "y", "z"],
        }
    )


def specimen_extra_cases() -> None:
    spec(
        "all_columns",
        all_specimen_frame(),
        "Every specimen option set, each from a non-default column name, plus two additional columns. "
        "specimen_taxon_id from a string column gives string elements.",
        divergence=(
            "pmotools-ts writes specimen_taxon_id as integers ([5833], [5833, 5855], [5833]). Python writes "
            "strings, which fail its own schema."
        ),
        specimen_name_col="name",
        **ALL_SPECIMEN_COLUMNS,
        additional_specimen_cols=["extra_number", "extra_text"],
    )
    spec(
        "storage_plate_row_col_all",
        specimen_frame(3, r=["a", " b ", "c"], c=["3", 4.0, " 5 "], p=["PL", "PL", "PL"]),
        "Plate rows are stripped and upper-cased; columns are coerced to int from strings and floats",
        **RECOMMENDED,
        storage_plate_name_col="p",
        storage_plate_row_col="r",
        storage_plate_col_col="c",
    )
    spec(
        "storage_plate_col_not_numeric",
        specimen_frame(3, r=["A", "B", "C"], c=["x", "3.0", 2.7]),
        "A plate column int() cannot parse is kept as is; a float is truncated",
        divergence=(
            "pmotools-ts throws metatable/invalid-integer for plate_col 'x' in row 0. Python keeps the strings "
            "'x' and '3.0', which fail its own schema (plate_col is an integer)."
        ),
        **RECOMMENDED,
        storage_plate_row_col="r",
        storage_plate_col_col="c",
    )
    spec(
        "storage_plate_name_only",
        specimen_frame(p=["PL1", "  "]),
        "Only a plate name: plate_info holds just the name; a whitespace name is blank",
        **RECOMMENDED,
        storage_plate_name_col="p",
    )
    spec(
        "storage_plate_numeric_name",
        specimen_frame(p=[1, 2], r=[1, 2], c=[1, 2]),
        "Numeric plate names stay numbers; numeric plate rows become strings",
        **RECOMMENDED,
        storage_plate_name_col="p",
        storage_plate_row_col="r",
        storage_plate_col_col="c",
    )
    spec(
        "storage_plate_float_row",
        specimen_frame(r=[1.0, np.nan], c=[1, 2]),
        "A float plate row is written as Python str() of the float",
        **RECOMMENDED,
        storage_plate_row_col="r",
        storage_plate_col_col="c",
    )
    spec(
        "storage_plate_bool_row",
        specimen_frame(r=[True, False], c=[True, 2]),
        "Boolean plate row and column values",
        **RECOMMENDED,
        storage_plate_row_col="r",
        storage_plate_col_col="c",
    )
    spec(
        "plate_position_leading_zeros",
        names_frame(w=["A010", " c0003 "]),
        "Any number of leading zeros, surrounding whitespace allowed",
        storage_plate_position_col="w",
    )
    spec(
        "plate_position_zero",
        names_frame(w=["A0", "B1"]),
        "Column zero is invalid",
        storage_plate_position_col="w",
    )
    spec(
        "plate_position_number",
        names_frame(w=["A1", 5]),
        "A non-string position fails to parse",
        storage_plate_position_col="w",
    )
    spec(
        "plate_position_with_row_only",
        names_frame(w=["A1", "B2"], r=["A", "B"]),
        "Row without column is checked before position",
        storage_plate_position_col="w",
        storage_plate_row_col="r",
    )
    spec(
        "plate_position_missing_column",
        names_frame(),
        "The position column does not exist: pandas KeyError",
        storage_plate_position_col="well",
    )
    spec(
        "plate_name_missing_column",
        names_frame(),
        "The plate name column does not exist: pandas KeyError",
        storage_plate_name_col="plate",
    )
    spec(
        "density_missing_column",
        names_frame(),
        "The density column does not exist: pandas KeyError",
        parasite_density_col="density",
    )
    spec(
        "density_method_missing_column",
        names_frame(d=[1, 2]),
        "The density method column does not exist: pandas KeyError",
        parasite_density_col="d",
        parasite_density_method_col="m",
    )
    spec(
        "density_nan",
        names_frame(d=[10.5, np.nan], m=["qPCR", "qPCR"]),
        "A missing density in a float column is not None, so Python writes NaN",
        divergence=(
            "pmotools-ts omits the density entry when the density is missing. Python writes parasite_density: NaN, "
            "which is not valid JSON."
        ),
        parasite_density_col="d",
        parasite_density_method_col="m",
    )
    spec(
        "density_method_nan",
        names_frame(d=[10, 20], m=["qPCR", np.nan]),
        "A missing method that is NaN rather than None is written as NaN",
        divergence=(
            "pmotools-ts omits parasite_density_method when the method is missing. Python writes "
            "parasite_density_method: NaN, which is not valid JSON."
        ),
        parasite_density_col="d",
        parasite_density_method_col="m",
    )
    spec(
        "density_method_none",
        names_frame(d=[10, 20], m=["qPCR", None]),
        "A missing method that is None is omitted",
        parasite_density_col="d",
        parasite_density_method_col="m",
    )
    spec(
        "density_not_rounded",
        names_frame(d=[1 / 3, 2 / 3], m=["qPCR", "qPCR"]),
        "Density is read from the frame, not from the JSON round trip, so it keeps full precision",
        parasite_density_col="d",
        parasite_density_method_col="m",
    )
    spec(
        "density_string",
        names_frame(d=["10", "n/a"]),
        "Density values are passed through without conversion",
        divergence=(
            "pmotools-ts parses text densities the way float() does and throws metatable/invalid-number for 'n/a' "
            "in row 1. Python writes the strings, which fail its own schema (parasite_density is a number)."
        ),
        parasite_density_col="d",
    )
    spec(
        "density_empty_lists",
        names_frame(),
        "Empty density and method lists add nothing",
        parasite_density_col=[],
        parasite_density_method_col=[],
    )
    spec(
        "float_rounding",
        specimen_frame(3, age=[1 / 3, 12345.123456789012, 1e-11], extra=[2 / 3, 1.5e-10, 1.234e17]),
        "Values pass through to_json, which rounds floats to 10 decimals and uses %.10g outside [1e-15, 1e16]",
        **RECOMMENDED,
        host_age_col="age",
        additional_specimen_cols=["extra"],
    )
    spec(
        "datetime_column",
        specimen_frame(collection_date=pd.to_datetime(["2024-01-02", "2023-12-31"])),
        "A datetime column is written by to_json as an ISO string with milliseconds",
        divergence=(
            "Rows cannot hold datetimes. The oracle records the dates as 2024-01-02T00:00:00 strings and pmotools-ts "
            "writes string cells unchanged, while Python writes 2024-01-02T00:00:00.000. Callers should pass dates "
            "as strings in the form they want written."
        ),
        **RECOMMENDED,
    )
    spec(
        "additional_missing_values",
        specimen_frame(3, extra=["a", None, ""], extra_num=[1.0, np.nan, 3.0]),
        "Missing values in additional columns are written as empty strings, not removed",
        **RECOMMENDED,
        additional_specimen_cols=["extra", "extra_num"],
    )
    spec(
        "list_values_types",
        specimen_frame(
            3,
            specimen_taxon_id=["5833", "5833,5855", "5855"],
            drug_usage=[" AL , DP", "AL,,DP", "AL"],
            alternate_identifiers=[1, 2, 3],
        ),
        "Strings are split without trimming or dropping empty parts; numbers are wrapped",
        divergence=(
            "pmotools-ts writes specimen_taxon_id as integers ([5833], [5833, 5855], [5855]). Python writes "
            "strings, which fail its own schema. drug_usage is split as in Python."
        ),
        **RECOMMENDED,
        drug_usage_col="drug_usage",
        alternate_identifiers_col="alternate_identifiers",
    )
    spec(
        "taxon_id_multiple",
        specimen_frame(3, specimen_taxon_id=["5833", "5833,5855", " 5855 , +5833"]),
        "Several taxon IDs in one cell make the column text, so Python writes every taxon ID as a string, "
        "which fails the schema (an array of integers)",
        divergence=(
            "pmotools-ts writes specimen_taxon_id as integers: each part is trimmed and parsed the way Python's "
            "int() accepts it ([5833], [5833, 5855], [5855, 5833]). Python writes strings, which fail its own schema."
        ),
        **RECOMMENDED,
    )
    spec(
        "taxon_id_invalid",
        specimen_frame(3, specimen_taxon_id=["5833", "5833;5855", "5855"]),
        "A taxon ID part that is not a whole number is written as a string by Python",
        divergence=(
            "pmotools-ts throws metatable/invalid-taxon-id for a part int() would reject ('5833;5855' in row 1). "
            "Python writes the strings, which fail its own schema."
        ),
        **RECOMMENDED,
    )
    spec(
        "numeric_fields_as_text",
        specimen_frame(
            2,
            host_taxon_id=["9606", " 9606 "],
            gravidity=["0", "2"],
            host_age=["3.5", " 40 "],
            density=["1200.5", "1e3"],
            r=["A", "B"],
            c=["1", " 12 "],
        ),
        "Integer and number fields from text columns are written as strings by Python",
        divergence=(
            "pmotools-ts parses host_taxon_id, gravidity and plate_col as int() would, and host_age and "
            "parasite_density as float() would, and writes numbers. Python writes the strings it was given "
            "(except plate_col, which it already passes through int()), which fail its own schema."
        ),
        **RECOMMENDED,
        gravidity_col="gravidity",
        host_age_col="host_age",
        parasite_density_col="density",
        storage_plate_row_col="r",
        storage_plate_col_col="c",
    )
    spec(
        "numeric_field_invalid",
        specimen_frame(2, host_age=["unknown", "4"]),
        "A number field holding text Python writes as given",
        divergence=(
            "pmotools-ts throws metatable/invalid-number for host_age 'unknown' in row 0. Python writes the string, "
            "which fails its own schema."
        ),
        **RECOMMENDED,
        host_age_col="host_age",
    )
    spec(
        "list_values_bool_and_float",
        specimen_frame(alternate_identifiers=[True, False], specimen_comments=[1.5, 2.0]),
        "Booleans and floats in list columns are wrapped as they are",
        **RECOMMENDED,
        alternate_identifiers_col="alternate_identifiers",
        specimen_comments_col="specimen_comments",
    )
    spec(
        "list_values_blank",
        specimen_frame(3, drug_usage=["AL", "", None], specimen_comments=[" ", None, "x"]),
        'A blank list cell is split into [""] in Python',
        divergence=(
            "pmotools-ts omits the field when a list cell is blank (missing or empty string). Python writes "
            '[""], which fails the schema item pattern. A whitespace-only cell is not blank and is still split.'
        ),
        **RECOMMENDED,
        drug_usage_col="drug_usage",
        specimen_comments_col="specimen_comments",
    )
    spec(
        "list_values_custom",
        specimen_frame(drug_usage=["AL;DP", "AL"], extra=["x;y", None], geo_admin1=["R1;R2", "R3"]),
        "A custom delimiter and list columns: an additional column and a scalar field can be listified",
        divergence=(
            'pmotools-ts omits extra for sample2, whose additional cell is missing; Python writes [""]. A blank '
            "cell in any list column is dropped, whether or not the field is optional."
        ),
        **RECOMMENDED,
        drug_usage_col="drug_usage",
        geo_admin1_col="geo_admin1",
        additional_specimen_cols=["extra"],
        list_values_specimen_values=["drug_usage", "extra", "geo_admin1"],
        list_values_specimen_values_delimiter=";",
    )
    spec(
        "list_values_empty",
        specimen_frame(drug_usage=["AL,DP", "AL"]),
        "An empty list_values list turns listification off, so specimen_taxon_id stays a number",
        **RECOMMENDED,
        drug_usage_col="drug_usage",
        list_values_specimen_values=[],
    )
    spec(
        "list_values_none",
        specimen_frame(),
        "list_values None crashes Python with TypeError (iterating None)",
        divergence="pmotools-ts treats a null list_values as no list columns. Python raises TypeError from a bug.",
        **RECOMMENDED,
        list_values_specimen_values=None,
    )
    spec(
        "list_column_present_but_unselected",
        specimen_frame(drug_usage=["AL", "DP"]),
        "A table column named like a list field but not selected makes Python look it up in the record: KeyError",
        divergence=(
            "pmotools-ts only listifies fields the record has, and returns the records. Python raises KeyError "
            "from a bug."
        ),
        **RECOMMENDED,
    )
    spec(
        "numeric_names",
        pd.DataFrame(
            {
                "specimen_name": [101, 102],
                "project_name": [7, 7],
                "host_subject_name": [5, 6],
            }
        ),
        "Numeric specimen and project names",
        divergence=(
            "pmotools-ts writes specimen_name and project_name as strings (\"101\", \"7\"). Python writes numbers, "
            "which fail the schema's string type. host_subject_name is not a name used for linking and stays a number."
        ),
        project_name_col="project_name",
        host_subject_name_col="host_subject_name",
    )
    spec(
        "empty_string_name",
        specimen_frame(specimen_name=["", "sample2"]),
        "An empty-string specimen name is not null, so it passes the null check and is kept",
        **RECOMMENDED,
    )
    spec(
        "duplicate_names_with_plate_and_density",
        pd.DataFrame(
            {
                "specimen_name": ["s1", "s1", "s2"],
                "w": ["A1", "B2", "C3"],
                "d": [1, 2, 3],
            }
        ),
        "Duplicate specimen names are kept; each duplicate gets the plate and density of the first row with that name",
        storage_plate_position_col="w",
        parasite_density_col="d",
    )
    spec(
        "output_column_collision",
        specimen_frame(name=["a", "b"]),
        "Renaming 'name' to specimen_name collides with the unselected specimen_name column: to_json ValueError",
        specimen_name_col="name",
    )
    spec(
        "additional_same_as_selected",
        specimen_frame(),
        "An additional column that is already selected under its own name changes nothing",
        **RECOMMENDED,
        additional_specimen_cols=["project_name"],
    )
    spec(
        "additional_overrides_selected",
        specimen_frame(name=["a", "b"]).drop(columns=["specimen_name"]),
        "An additional column that is the specimen name column replaces the specimen_name mapping, so the "
        "records have no specimen_name and the parasite density lookup (which always runs) raises KeyError",
        specimen_name_col="name",
        additional_specimen_cols=["name"],
    )
    spec(
        "additional_named_like_unset_optional",
        specimen_frame(specimen_store_loc=["", "x"], lat_lon=["", "y"]),
        "Python removes empty values only for optional fields; because unset options share the None key, only "
        "the last unset field name (specimen_store_loc) is in that set, so lat_lon keeps its empty string",
        **RECOMMENDED,
        additional_specimen_cols=["specimen_store_loc", "lat_lon"],
    )
    spec(
        "empty_table",
        specimen_frame(0),
        "A table with no rows gives no records",
        **RECOMMENDED,
    )
    spec(
        "bool_and_infinite_values",
        specimen_frame(age=[float("inf"), 2.0], gravid=[True, False]),
        "Infinite numbers become null in to_json and are removed",
        **RECOMMENDED,
        host_age_col="age",
        gravid_col="gravid",
    )
    floats = [
        0.1, 1 / 3, 2 / 3, -1 / 3, 0.5, 12.0, -0.0,
        1e-5, 1.5e-5, 0.000123456789012345, 123456.123456789012, 99999999999.99999, 123456789012.5,
        1e15 + 0.3, 1e16, 1e16 + 2, 1.234e17, 1e20,
        1e-11, 4.9e-11, 6e-11, 5e-10, 1.5e-10, 2.5e-10,
        0.99999999999, 9.99999999995, 1.00000000005,
        1e-16, 2.5e-16, -1.23456789012e-20,
    ]
    spec(
        "float_rounding_many",
        pd.DataFrame({"specimen_name": [f"s{i}" for i in range(len(floats))], "x": floats}),
        "pandas' ujson double encoder: 10 decimals with its own half-way rule, %.10g outside [1e-15, 1e16]",
        additional_specimen_cols=["x"],
    )


def library_extra_cases() -> None:
    lib(
        "numeric_fields_as_text",
        library_frame(d=["150", "not measured"], r=["A", "B"], c=["3", " 4 "]),
        "A qPCR density from a text column: Python writes the density strings",
        divergence=(
            "pmotools-ts throws metatable/invalid-number for parasite_density 'not measured' in row 1. Python "
            "writes the strings, which fail its own schema."
        ),
        **LIBRARY_NAMES,
        parasite_density_col="d",
        library_prep_plate_row_col="r",
        library_prep_plate_col_col="c",
    )
    lib(
        "plate_position",
        library_frame(3, well=["a01", None, "H12"], plate=["P", "P", "P"]),
        "Library prep plate from a position column, with a blank position",
        **LIBRARY_NAMES,
        library_prep_plate_name_col="plate",
        library_prep_plate_position_col="well",
    )
    lib(
        "plate_position_and_row_col",
        library_frame(well=["A1", "B1"], r=["A", "B"], c=[1, 1]),
        "Position and row/col together are an error",
        **LIBRARY_NAMES,
        library_prep_plate_position_col="well",
        library_prep_plate_row_col="r",
        library_prep_plate_col_col="c",
    )
    lib(
        "plate_bad_position",
        library_frame(well=["A1", "Z1"]),
        "An invalid library prep plate position",
        **LIBRARY_NAMES,
        library_prep_plate_position_col="well",
    )
    lib(
        "density_errors_unequal",
        library_frame(d1=[1, 2], m1=["a", "b"]),
        "Unequal density and method lists",
        **LIBRARY_NAMES,
        parasite_density_col=["d1"],
        parasite_density_method_col=["m1", "m1"],
    )
    lib(
        "density_method_without_density",
        library_frame(m1=["a", "b"]),
        "Method without density",
        **LIBRARY_NAMES,
        parasite_density_method_col="m1",
    )
    lib(
        "density_nan",
        library_frame(d=[np.nan, 5.0]),
        "A NaN density is written as NaN in Python",
        divergence=(
            "pmotools-ts omits the density entry when the density is missing. Python writes parasite_density: NaN, "
            "which is not valid JSON."
        ),
        **LIBRARY_NAMES,
        parasite_density_col="d",
    )
    lib(
        "numeric_names",
        pd.DataFrame(
            {
                "library_sample_name": [1, 2],
                "sequencing_info_name": [3, 3],
                "specimen_name": [10, 20],
                "panel_name": [4, 4],
                "run_accession": [5, 6],
            }
        ),
        "Numeric library, sequencing, specimen and panel names",
        divergence=(
            "pmotools-ts writes library_sample_name, sequencing_info_name, specimen_name and panel_name as strings. "
            "Python writes numbers, which fail the schema's string type. run_accession stays a number."
        ),
        **LIBRARY_NAMES,
        run_accession_col="run_accession",
    )
    lib(
        "specimen_and_panel_unset",
        library_frame(),
        "specimen_name_col and panel_name_col set to None are neither checked nor written",
        library_sample_name_col="library_sample_name",
        specimen_name_col=None,
        panel_name_col=None,
    )
    lib(
        "empty_names_removed",
        library_frame(specimen_name=["", "sample2"], panel_name=["MH", ""]),
        "In the library builder specimen_name and panel_name are optional fields, so empty strings are removed",
        **LIBRARY_NAMES,
    )
    lib(
        "run_accession_shares_column",
        library_frame(acc=["A1", "A2"]),
        "run_accession_col is not in the uniqueness check, so it may share a column with experiment_accession; "
        "the later mapping (run_accession) wins",
        **LIBRARY_NAMES,
        experiment_accession_col="acc",
        run_accession_col="acc",
    )
    lib(
        "run_accession_is_library_name",
        library_frame(),
        "run_accession_col set to the library sample name column renames that column away from "
        "library_sample_name, so the density lookup raises KeyError",
        **LIBRARY_NAMES,
        run_accession_col="library_sample_name",
    )
    lib(
        "alternate_identifiers_blank",
        library_frame(3, alternate_identifiers=["a,b", None, ""]),
        'Blank alternate identifiers become [""] in Python',
        divergence=(
            "pmotools-ts omits alternate_identifiers when the cell is blank. Python writes [\"\"], which fails the "
            "schema item pattern."
        ),
        **LIBRARY_NAMES,
        alternate_identifiers_col="alternate_identifiers",
    )
    lib(
        "list_values_custom",
        library_frame(alternate_identifiers=["a|b", "c"], fastqs_loc=["x|y", "z"]),
        "Custom list columns and delimiter in the library builder",
        **LIBRARY_NAMES,
        alternate_identifiers_col="alternate_identifiers",
        fastqs_loc_col="fastqs_loc",
        list_values_library_values=["alternate_identifiers", "fastqs_loc"],
        list_values_library_values_delimiter="|",
    )
    lib(
        "missing_plate_column",
        library_frame(),
        "A missing plate column is a pandas KeyError",
        **LIBRARY_NAMES,
        library_prep_plate_name_col="plate",
    )
    lib("empty_table", library_frame(0), "No rows, no records", **LIBRARY_NAMES)


def main() -> None:
    example_cases()
    ported_plate_cases()
    ported_density_cases()
    ported_specimen_cases()
    ported_library_cases()
    specimen_extra_cases()
    library_extra_cases()


if __name__ == "__main__":
    main()
