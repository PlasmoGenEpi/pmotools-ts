"""Oracle cases for pmo_builder/panel_information_to_pmo.py.

Covers ``panel_info_table_to_pmo``, ``check_genome_info`` and
``merge_panel_info_dicts``. Cases are written flat under ``cases/panel/`` and
named ``<function>-<what>``.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from pmotools.pmo_builder.panel_information_to_pmo import (
    check_genome_info,
    merge_panel_info_dicts,
    panel_info_table_to_pmo,
)

from .common import read_table, run_case

GENOME = {"name": "3D7", "url": "somthing.com", "genome_version": "1", "taxon_id": 5833}
GENOME_2 = {"name": "DD2", "url": "somthingelse.com", "genome_version": "2", "taxon_id": 5833}


def minimal() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "target_name": ["target1", "target2", "target3"],
            "fwd_primer": ["CTT", "CTA", "TTG"],
            "rev_primer": ["GTT", "TGG", "ATT"],
        }
    )


def with_locations() -> pd.DataFrame:
    df = minimal()
    df["fwd_start"] = [1, 11, 21]
    df["fwd_end"] = [4, 14, 24]
    df["rev_start"] = [8, 18, 28]
    df["rev_end"] = [11, 21, 31]
    df["insert_start"] = [4, 14, 24]
    df["insert_end"] = [8, 18, 28]
    df["chrom"] = ["chr1", "chr1", "chr2"]
    return df


LOCATION_KWARGS = {
    "forward_primers_start_col": "fwd_start",
    "forward_primers_end_col": "fwd_end",
    "reverse_primers_start_col": "rev_start",
    "reverse_primers_end_col": "rev_end",
    "insert_start_col": "insert_start",
    "insert_end_col": "insert_end",
    "chrom_col": "chrom",
}


def mad4hatter() -> pd.DataFrame:
    df = read_table("mad4hatter_panel_info_example.csv")
    df["chrom"] = df["amplicon"].str.rsplit("-", n=3).str[0]
    return df


MAD4HATTER_LOCATIONS = {
    "target_name_col": "amplicon",
    "forward_primers_start_col": "amplicon_start",
    "forward_primers_end_col": "ampInsert_start",
    "reverse_primers_start_col": "ampInsert_end",
    "reverse_primers_end_col": "amplicon_end",
    "insert_start_col": "ampInsert_start",
    "insert_end_col": "ampInsert_end",
    "chrom_col": "chrom",
}


def panel(case_id: str, table: pd.DataFrame, note: str, divergence: str | None = None, **kwargs) -> None:
    kwargs.setdefault("panel_name", "test_panel")
    run_case(
        f"panel/{case_id}",
        panel_info_table_to_pmo,
        tables={"target_table": table},
        kwargs=kwargs,
        note=note,
        divergence=divergence,
    )


def panel_info_table_to_pmo_mutation_probe(target_table: pd.DataFrame, **kwargs) -> dict:
    """Calls panel_info_table_to_pmo and reports the caller's columns afterwards."""
    panel_info_table_to_pmo(target_table, **kwargs)
    return {"columns_after_call": [str(c) for c in target_table.columns]}


def table_cases() -> None:
    # --- the example table -------------------------------------------------
    panel(
        "table-example-plain",
        read_table("mad4hatter_panel_info_example.csv"),
        "The mad4hatter example with only names and primers.",
        panel_name="mad4hatter",
        target_name_col="amplicon",
    )
    panel(
        "table-example-locations-genome-dict",
        mad4hatter(),
        "The mad4hatter example with every location group, attributes and extra columns.",
        panel_name="mad4hatter",
        genome_info=GENOME,
        target_attributes_col="target_type",
        additional_target_info_cols=["amplicon_length", "ampInsert_length"],
        **MAD4HATTER_LOCATIONS,
    )

    # --- minimal tables and genome info -------------------------------------
    panel("table-minimal", minimal(), "Names and primers only; one reaction named full.")
    panel(
        "table-genome-dict-no-locations",
        minimal(),
        "A genome dict is wrapped in a list even when no locations use it.",
        genome_info=GENOME,
    )
    df = with_locations()
    df["genome_id"] = [0, 1, 0]
    panel(
        "table-genome-list-genome-id-col",
        df,
        "A list of genomes with a genome_id column choosing between them.",
        genome_info=[GENOME, GENOME_2],
        genome_id_col="genome_id",
        **LOCATION_KWARGS,
    )
    panel(
        "table-genome-empty-dict",
        minimal(),
        "An empty genome dict is falsy, so it counts as no genome info.",
        genome_info={},
    )
    panel(
        "table-genome-empty-list",
        minimal(),
        "An empty genome list is falsy, so it is never checked and counts as no genome info.",
        genome_info=[],
    )
    panel(
        "table-genome-list-non-dict",
        minimal(),
        "A non-dict genome in the list is rejected.",
        genome_info=[GENOME, "not_a_dict"],
    )
    panel(
        "table-genome-missing-key",
        minimal(),
        "A genome dict without url is rejected.",
        genome_info={"name": "3D7", "genome_version": "1", "taxon_id": 1},
    )
    panel(
        "table-genome-id-col-ignored-without-locations",
        minimal(),
        "genome_id_col naming a missing column is never read when there are no locations.",
        genome_info=GENOME,
        genome_id_col="no_such_column",
    )

    # --- locations -----------------------------------------------------------
    df = with_locations()
    df["strand"] = ["+", "-", None]
    df["ref_seq"] = ["ACGT", None, "TTTT"]
    panel(
        "table-locations-strand-ref-seq",
        df,
        "Strand goes on the insert and both primers; ref_seq only on the insert; missing ones are left out.",
        genome_info=GENOME,
        strand_col="strand",
        ref_seq_col="ref_seq",
        **LOCATION_KWARGS,
    )
    panel(
        "table-locations-without-genome",
        with_locations(),
        "Locations without genome info raise.",
        **LOCATION_KWARGS,
    )
    df = minimal()
    df["insert_start"] = [None, None, None]
    df["insert_end"] = [8, 18, 28]
    df["chrom"] = "chr1"
    panel(
        "table-locations-all-missing-without-genome",
        df,
        "Every insert location is missing, so no location is written and the missing genome is not an error.",
        insert_start_col="insert_start",
        insert_end_col="insert_end",
        chrom_col="chrom",
    )
    df = minimal()
    df["target_start"] = [1, None, 1]
    df["target_end"] = None
    df["insert_start"] = [2, None, None]
    df["insert_end"] = [3, 3, 3]
    df["chrom"] = "chrom1"
    panel(
        "table-locations-partly-missing",
        df,
        "The Python test's partly missing locations: one warning per location kind.",
        genome_info=GENOME,
        forward_primers_start_col="target_start",
        forward_primers_end_col="insert_start",
        reverse_primers_start_col="insert_end",
        reverse_primers_end_col="target_end",
        insert_start_col="insert_start",
        insert_end_col="insert_end",
        chrom_col="chrom",
    )
    df = with_locations()
    df.loc[1, "chrom"] = None
    panel(
        "table-locations-missing-chrom",
        df,
        "A missing chromosome drops every location for that target.",
        genome_info=GENOME,
        **LOCATION_KWARGS,
    )
    df = with_locations()
    df["fwd_start"] = ["1", " 11 ", "21"]
    df["insert_end"] = [8.0, 18.9, 28.0]
    panel(
        "table-locations-string-and-float-coordinates",
        df,
        "Coordinates go through int(): digit strings parse and floats truncate.",
        genome_info=GENOME,
        **LOCATION_KWARGS,
    )
    df = with_locations()
    df["fwd_start"] = ["1", "x", "21"]
    panel(
        "table-locations-bad-coordinate",
        df,
        "A coordinate int() cannot parse raises.",
        genome_info=GENOME,
        **LOCATION_KWARGS,
    )
    df = with_locations()
    df["genome_id"] = [0, None, 0]
    panel(
        "table-genome-id-missing-value",
        df,
        "A missing genome_id cannot become an int and raises.",
        genome_info=GENOME,
        genome_id_col="genome_id",
        **LOCATION_KWARGS,
    )
    df = with_locations()
    df["genome_id"] = ["0", "1", "0"]
    panel(
        "table-genome-id-strings",
        df,
        "genome_id strings go through int().",
        genome_info=[GENOME, GENOME_2],
        genome_id_col="genome_id",
        **LOCATION_KWARGS,
    )
    panel(
        "table-genome-id-col-missing",
        with_locations(),
        "genome_id_col naming a missing column raises once a location is written.",
        genome_info=GENOME,
        genome_id_col="no_such_column",
        **LOCATION_KWARGS,
    )
    df = minimal()
    df["chrom"] = ["chr1", "chr2", "chr3"]
    panel(
        "table-chrom-only",
        df,
        "chrom_col alone is allowed and writes no location.",
        chrom_col="chrom",
    )
    df = with_locations()
    df = df.drop(columns=["insert_end", "rev_start", "rev_end"])
    panel(
        "table-insert-and-forward-only",
        df,
        "Only insert and forward primer locations.",
        genome_info=GENOME,
        forward_primers_start_col="fwd_start",
        forward_primers_end_col="fwd_end",
        insert_start_col="fwd_end",
        insert_end_col="fwd_end",
        chrom_col="chrom",
    )

    # --- location configuration errors ----------------------------------------
    panel(
        "table-config-no-chrom",
        with_locations(),
        "Insert columns without chrom_col.",
        genome_info=GENOME,
        insert_start_col="insert_start",
        insert_end_col="insert_end",
    )
    panel(
        "table-config-forward-unpaired",
        with_locations(),
        "Forward start without forward end.",
        genome_info=GENOME,
        forward_primers_start_col="fwd_start",
        chrom_col="chrom",
    )
    panel(
        "table-config-reverse-unpaired",
        with_locations(),
        "Reverse end without reverse start.",
        genome_info=GENOME,
        reverse_primers_end_col="rev_end",
        chrom_col="chrom",
    )
    panel(
        "table-config-insert-unpaired",
        with_locations(),
        "Insert start without insert end.",
        genome_info=GENOME,
        insert_start_col="insert_start",
        chrom_col="chrom",
    )
    panel(
        "table-config-strand-only",
        with_locations(),
        "strand_col alone counts as location info and needs chrom_col.",
        genome_info=GENOME,
        strand_col="chrom",
    )
    panel(
        "table-config-several-problems",
        with_locations(),
        "Every configuration problem at once.",
        forward_primers_start_col="fwd_start",
        reverse_primers_start_col="rev_start",
        insert_end_col="insert_end",
    )

    # --- uniqueness checks -----------------------------------------------------
    df = pd.concat(
        [minimal(), pd.DataFrame({"target_name": ["target1"], "fwd_primer": ["TTT"], "rev_primer": ["GGG"]})],
        ignore_index=True,
    )
    panel("table-duplicate-target-names", df, "A repeated target name raises.")
    df = pd.concat(
        [minimal(), pd.DataFrame({"target_name": ["target4"], "fwd_primer": ["CTT"], "rev_primer": ["GTT"]})],
        ignore_index=True,
    )
    panel("table-duplicate-target-info", df, "Two targets with the same primer pair raise.")
    df = with_locations()
    df.loc[1, ["fwd_primer", "rev_primer"]] = ["CTT", "GTT"]
    panel(
        "table-same-primers-different-locations",
        df,
        "Same primers but different locations are distinct targets.",
        genome_info=GENOME,
        **LOCATION_KWARGS,
    )
    df = with_locations()
    df.loc[1, ["fwd_primer", "rev_primer", "fwd_start", "fwd_end", "rev_start", "rev_end", "insert_start", "insert_end"]] = [
        "CTT", "GTT", 1, 4, 8, 11, 4, 8,
    ]
    df["ref_seq"] = ["ACGT", None, "TTTT"]
    panel(
        "table-duplicate-info-hidden-by-missing-ref-seq",
        df,
        "Identical targets escape the duplicate-info check when one has a missing ref_seq, because groupby drops missing keys.",
        genome_info=GENOME,
        ref_seq_col="ref_seq",
        **LOCATION_KWARGS,
    )
    df = with_locations()
    df["ref_seq"] = ["ACGT", "ACGT", "TTTT"]
    df.loc[1, ["fwd_primer", "rev_primer", "fwd_start", "fwd_end", "rev_start", "rev_end", "insert_start", "insert_end", "chrom"]] = [
        "CTT", "GTT", 1, 4, 8, 11, 4, 8, "chr1",
    ]
    panel(
        "table-duplicate-info-with-locations",
        df,
        "Identical primers and locations raise.",
        genome_info=GENOME,
        ref_seq_col="ref_seq",
        **LOCATION_KWARGS,
    )

    # --- missing primers and names ---------------------------------------------
    df = minimal()
    df["fwd_primer"] = ["CTT", None, None]
    df["rev_primer"] = ["GTT", "GTT", "GTT"]
    panel(
        "table-missing-primer-seq",
        df,
        "Missing (None) primer sequences escape the duplicate check and are written as null.",
    )
    df = minimal()
    df["fwd_primer"] = pd.Series(["CTT", np.nan, "AAA"], dtype=object)
    panel(
        "table-missing-primer-seq-nan",
        df,
        "A NaN primer sequence, as read_csv gives for an empty cell, is written as NaN.",
        divergence="pmotools-ts writes a missing primer seq as null; Python writes NaN, which is not valid JSON.",
    )
    df = minimal()
    df["target_name"] = ["target1", None, "target3"]
    panel(
        "table-missing-target-name",
        df,
        "A missing (None) target name is written as null.",
    )
    df = minimal()
    df["target_name"] = pd.Series(["target1", np.nan, "target3"], dtype=object)
    panel(
        "table-missing-target-name-nan",
        df,
        "A NaN target name, as read_csv gives for an empty cell.",
        divergence="pmotools-ts writes a missing target name as null, the same as for None; Python writes NaN, which is not valid JSON.",
    )
    df = minimal()
    df["target_name"] = ["target1", None, None]
    panel("table-two-missing-target-names", df, "Two missing names count as duplicates of each other.")
    panel(
        "table-target-name-col-missing",
        minimal(),
        "A target name column that is not in the table.",
        target_name_col="name",
    )
    panel(
        "table-primer-col-missing",
        minimal(),
        "A primer column that is not in the table.",
        forward_primers_seq_col="forward",
    )
    panel(
        "table-empty-with-columns",
        minimal().iloc[0:0],
        "A table with columns and no rows: Python raises (KeyError from the groupby on an empty frame).",
    )

    # --- numeric target names -----------------------------------------------------
    df = minimal()
    df["target_name"] = [1, 2, 3]
    panel(
        "table-integer-target-names",
        df,
        "Integer target names.",
        divergence="pmotools-ts writes target names as strings (\"1\"); Python writes integers, which the schema rejects.",
    )
    df = minimal()
    df["target_name"] = [1, 2, 3]
    df["insert_start"] = [4, None, 24]
    df["insert_end"] = [8, 18, 28]
    df["chrom"] = "chr1"
    panel(
        "table-integer-target-names-missing-location",
        df,
        "Integer names with a missing location crash the warning's ', '.join with TypeError.",
        divergence="pmotools-ts writes names as strings, warns about target 2, and returns the result; Python crashes building the warning text.",
        genome_info=GENOME,
        insert_start_col="insert_start",
        insert_end_col="insert_end",
        chrom_col="chrom",
    )
    df = minimal()
    df["target_name"] = pd.Series([1, "1", "target3"], dtype=object)
    panel(
        "table-number-and-string-target-name",
        df,
        "1 and \"1\" are different names to pandas.",
        divergence="pmotools-ts compares names as strings, so 1 and \"1\" are a duplicate and it throws panel/duplicate-target-names.",
    )

    # --- gene names and attributes ------------------------------------------------------
    df = minimal()
    df["gene"] = ["PfCRT", None, ""]
    panel(
        "table-gene-name",
        df,
        "gene_name is dropped when missing or empty.",
        gene_name_col="gene",
    )
    panel(
        "table-gene-name-col-missing",
        minimal(),
        "A gene_name column that is not in the table.",
        gene_name_col="gene",
    )
    df = pd.concat([minimal(), minimal().assign(target_name=lambda d: d.target_name + "b", fwd_primer=lambda d: d.fwd_primer + "A")], ignore_index=True)
    df["attrs"] = ["diversity,drug", " a , b ", None, "", "   ", "x,,x"]
    panel(
        "table-target-attributes",
        df,
        "Attributes split on the delimiter without stripping or dedupe; missing and blank cells are dropped.",
        target_attributes_col="attrs",
    )
    df = minimal()
    df["attrs"] = ["a;b", "a,b", "c"]
    panel(
        "table-target-attributes-custom-delimiter",
        df,
        "A custom attribute delimiter.",
        target_attributes_col="attrs",
        target_attributes_col_delimiter=";",
    )
    df = minimal()
    df["attrs"] = ["a, b", "a,b", "c, d, e"]
    panel(
        "table-target-attributes-two-char-delimiter",
        df,
        "Attributes use str.split, so a two-character delimiter is literal.",
        target_attributes_col="attrs",
        target_attributes_col_delimiter=", ",
    )
    df = minimal()
    df["attrs"] = [1.0, None, 3.5]
    panel(
        "table-target-attributes-float",
        df,
        "Numeric attributes go through str(), so a float column writes 1.0.",
        target_attributes_col="attrs",
    )
    df = minimal()
    df["attrs"] = [1, 2, 3]
    panel(
        "table-target-attributes-int",
        df,
        "Integer attributes go through str().",
        target_attributes_col="attrs",
    )
    df = minimal()
    df["attrs"] = ["a,b", "c", "d"]
    panel(
        "table-target-attributes-empty-delimiter",
        df,
        "An empty attribute delimiter makes str.split raise.",
        target_attributes_col="attrs",
        target_attributes_col_delimiter="",
    )

    # --- additional columns -----------------------------------------------------------------
    df = minimal()
    df["text"] = ["a", None, ""]
    df["count"] = [1, 2, 3]
    df["score"] = [1.5, None, 3.0]
    df["flag"] = [True, False, True]
    df["mixed"] = pd.Series([1, "two", None], dtype=object)
    panel(
        "table-additional-columns",
        df,
        "Additional columns keep missing values as null and convert numpy scalars.",
        additional_target_info_cols=["text", "count", "score", "flag", "mixed"],
    )
    df = minimal()
    df["markers_of_interest"] = [None, "", "PfK13"]
    df["gff_url"] = [None, "", "x.gff"]
    panel(
        "table-additional-optional-names-without-genome",
        df,
        "Additional columns named like optional keys: markers_of_interest blanks are dropped; gff_url blanks stay without genome info.",
        additional_target_info_cols=["markers_of_interest", "gff_url"],
    )
    panel(
        "table-additional-optional-names-with-genome",
        df,
        "With genome info the second cleanup also drops blank gff_url values.",
        genome_info=GENOME,
        additional_target_info_cols=["markers_of_interest", "gff_url"],
    )
    panel(
        "table-additional-columns-missing",
        minimal(),
        "Additional columns not in the table raise.",
        additional_target_info_cols=["extra", "target_name"],
    )
    panel(
        "table-additional-columns-empty-list",
        minimal(),
        "An empty additional column list is ignored.",
        additional_target_info_cols=[],
    )

    # --- reactions ------------------------------------------------------------------
    df = minimal()
    df["reaction"] = ["reaction1", "reaction2", "reaction2"]
    panel("table-reactions", df, "One reaction per target.", reaction_name_col="reaction")
    df = minimal()
    df["pool"] = ["pool2", " pool1 , pool2", "pool1,pool3,pool1"]
    panel(
        "table-reactions-delimited",
        df,
        "Reactions split, stripped and kept in first-appearance order; a target listed twice in one cell appears once.",
        reaction_name_col="pool",
    )
    df = minimal()
    df["pool"] = ["p1;p2", "p2", "p1,p3"]
    panel(
        "table-reactions-custom-delimiter",
        df,
        "A custom reaction delimiter.",
        reaction_name_col="pool",
        reaction_name_col_delimiter=";",
    )
    df = minimal()
    df["pool"] = ["p1, p2", "p2", "p1,p3"]
    panel(
        "table-reactions-two-char-delimiter",
        df,
        "pandas treats a delimiter longer than one character as a regex; ', ' matches only itself.",
        reaction_name_col="pool",
        reaction_name_col_delimiter=", ",
    )
    df = minimal()
    df["pool"] = ["p1 | p2", "p2", "p1|p3"]
    panel(
        "table-reactions-regex-delimiter",
        df,
        "' | ' is a regex meaning 'space or space', so it splits on spaces, not on the bar.",
        reaction_name_col="pool",
        reaction_name_col_delimiter=" | ",
    )
    df = minimal()
    df["pool"] = ["p1,,p2", "p2,", "p1"]
    panel(
        "table-reactions-empty-piece",
        df,
        "Empty pieces become a reaction named ''.",
        reaction_name_col="pool",
    )
    df = minimal()
    df["pool"] = ["p1", None, "p2"]
    panel(
        "table-reactions-missing-value",
        df,
        "A missing (None) reaction cell makes a reaction named null with no targets.",
        divergence="pmotools-ts leaves the target out of every reaction and adds no reaction for the missing cell; Python adds a reaction named null, which the schema rejects (reaction_name must be a string) and which is NaN, not valid JSON, when the table comes from read_csv.",
        reaction_name_col="pool",
    )
    df = minimal()
    df["pool"] = pd.Series(["p1", np.nan, "p2"], dtype=object)
    panel(
        "table-reactions-missing-value-nan",
        df,
        "A NaN reaction cell, as read_csv gives, makes a reaction named NaN with no targets.",
        divergence="pmotools-ts leaves the target out of every reaction and adds no reaction for the missing cell; Python adds a reaction named NaN, which is not valid JSON.",
        reaction_name_col="pool",
    )
    df = minimal()
    df["pool"] = [1, 2, 1]
    panel(
        "table-reactions-integer-column",
        df,
        "An integer reaction column has no .str accessor, so Python raises AttributeError.",
        divergence="pmotools-ts reads reaction names as strings and returns reactions \"1\" and \"2\"; Python crashes.",
        reaction_name_col="pool",
    )
    df = minimal()
    df["pool"] = pd.Series(["p1", 2, "p1,2"], dtype=object)
    panel(
        "table-reactions-mixed-column",
        df,
        "A number in a text reaction column becomes NaN under .str.split, giving a NaN reaction.",
        divergence="pmotools-ts reads the number as the string \"2\", so reaction 2 holds targets 1 and 2; Python writes a NaN reaction and leaves target2 out.",
        reaction_name_col="pool",
    )
    panel(
        "table-reactions-col-missing",
        minimal(),
        "A reaction column that is not in the table.",
        reaction_name_col="pool",
    )
    df = minimal()
    df["reaction"] = ["a", "b", "c"]
    panel(
        "table-existing-reaction-column-ignored",
        df,
        "Without reaction_name_col an existing 'reaction' column is ignored.",
    )
    run_case(
        "panel/table-mutation-adds-reaction-column",
        panel_info_table_to_pmo_mutation_probe,
        tables={"target_table": minimal()},
        kwargs={"panel_name": "test_panel"},
        note="Probe: Python adds a 'reaction' column to the caller's DataFrame when reaction_name_col is not given.",
        divergence="pmotools-ts never mutates the caller's table; the test checks the rows are unchanged after the call.",
    )


def check_cases() -> None:
    def check(case_id: str, genome_info, note: str) -> None:
        run_case(f"panel/{case_id}", check_genome_info, kwargs={"genome_info": genome_info}, note=note)

    check("check-genome-dict", GENOME, "A complete genome dict passes.")
    check("check-genome-dict-extra-keys", {**GENOME, "chromosomes": ["chr1"], "gff_url": None}, "Extra keys and null values are fine.")
    check("check-genome-list", [GENOME, GENOME_2], "A list of complete genomes passes.")
    check("check-genome-string", "genome_info", "A string is neither dict nor list.")
    check("check-genome-number", 5, "A number is neither dict nor list.")
    check("check-genome-null", None, "None is neither dict nor list.")
    check("check-genome-missing-keys", {"name": "3D7", "taxon_id": 1}, "Missing keys raise.")
    check("check-genome-empty-dict", {}, "An empty dict is missing every key.")
    check("check-genome-empty-list", [], "An empty list raises.")
    check("check-genome-list-non-dict", [GENOME, "not_a_dict"], "A list element that is not a dict.")
    check("check-genome-list-missing-keys", [GENOME, {"name": "3D7", "taxon_id": 1}], "A list element missing keys.")


def target(name, fwd: str, rev: str, **extra) -> dict:
    return {"target_name": name, "forward_primer": {"seq": fwd}, "reverse_primer": {"seq": rev}, **extra}


def loc(genome_id: int, start: int, end: int) -> dict:
    return {"genome_id": genome_id, "chrom": "chr1", "start": start, "end": end}


def merge_cases() -> None:
    def merge(case_id: str, dicts, note: str, divergence: str | None = None) -> None:
        run_case(
            f"panel/{case_id}",
            merge_panel_info_dicts,
            kwargs={"panel_info_dicts": dicts},
            note=note,
            divergence=divergence,
        )

    a_targets = [target("target1", "CTT", "GTT"), target("target2", "CTA", "TGG"), target("target3", "TTG", "ATT")]
    panel_a = {
        "panel_info": [{"panel_name": "panel1", "reactions": [{"reaction_name": "1", "panel_targets": [0, 1, 2]}]}],
        "targeted_genomes": [GENOME],
        "target_info": a_targets,
    }
    panel_b_disjoint = {
        "panel_info": [{"panel_name": "panel2", "reactions": [{"reaction_name": "1", "panel_targets": [0, 1]}]}],
        "targeted_genomes": [GENOME],
        "target_info": [target("target4", "CTA", "TGG"), target("target5", "TTG", "ATT")],
    }
    merge("merge-disjoint", [panel_a, panel_b_disjoint], "The Python test's disjoint panels.")
    panel_b_overlap = {
        "panel_info": [{"panel_name": "panel2", "reactions": [{"reaction_name": "1", "panel_targets": [0, 1]}]}],
        "targeted_genomes": [GENOME],
        "target_info": [target("target2", "CTA", "TGG"), target("target5", "TTG", "ATT")],
    }
    merge("merge-overlap", [panel_a, panel_b_overlap], "The Python test's overlapping panels: target2 is shared.")
    panel_b_conflict = {
        "panel_info": [{"panel_name": "panel2", "reactions": [{"reaction_name": "1", "panel_targets": [0, 1]}]}],
        "targeted_genomes": [GENOME],
        "target_info": [target("target2", "AAAA", "TGG", gene_name="geneX"), target("target5", "TTG", "ATT")],
    }
    merge(
        "merge-conflict",
        [panel_a, panel_b_conflict],
        "target2 has a different primer in the second panel; the first definition is kept silently.",
        divergence="pmotools-ts keeps the first definition too, and also calls onWarning with panel/conflicting-target-definition.",
    )
    merge("merge-single", [panel_a], "One panel passes through.")
    merge("merge-empty", [], "No panels raise.")

    # genomes
    with_loc_a = {
        "panel_info": [{"panel_name": "pA", "reactions": [{"reaction_name": "r", "panel_targets": [0, 1]}]}],
        "targeted_genomes": [GENOME, GENOME_2],
        "target_info": [
            target("t1", "AA", "CC", insert_location=loc(1, 5, 9)),
            {"target_name": "t2", "forward_primer": {"seq": "GG", "location": loc(0, 1, 3)}, "reverse_primer": {"seq": "TT", "location": loc(1, 10, 12)}},
        ],
    }
    with_loc_b = {
        "panel_info": [{"panel_name": "pB", "reactions": [{"reaction_name": "r", "panel_targets": [1, 0]}]}],
        "targeted_genomes": [GENOME_2, {**GENOME, "name": "HB3"}],
        "target_info": [
            target("t3", "AT", "CG", insert_location=loc(0, 5, 9)),
            {"target_name": "t4", "forward_primer": {"seq": "GA", "location": loc(1, 1, 3)}, "reverse_primer": {"seq": "TA", "location": loc(7, 10, 12)}},
        ],
    }
    merge(
        "merge-genomes-remapped",
        [with_loc_a, with_loc_b],
        "Genomes are deduplicated by content and genome_ids remapped; an id with no genome stays as it is.",
    )
    same_genome_other_index = {
        "panel_info": [{"panel_name": "pC", "reactions": [{"reaction_name": "r", "panel_targets": [0]}]}],
        "targeted_genomes": [GENOME_2, GENOME],
        "target_info": [target("t1", "AA", "CC", insert_location=loc(0, 5, 9))],
    }
    merge(
        "merge-same-target-same-genome-other-index",
        [with_loc_a, same_genome_other_index],
        "t1 points at the same genome under a different index in the second panel; after remapping it is the same target.",
    )
    no_genome = {
        "panel_info": [{"panel_name": "pN", "reactions": [{"reaction_name": "r", "panel_targets": [0]}]}],
        "target_info": [target("n1", "AA", "CC")],
    }
    merge("merge-no-genomes", [no_genome], "No genomes anywhere: no targeted_genomes key.")
    merge("merge-mixed-genomes", [no_genome, with_loc_a], "One panel without genomes and one with.")
    merge(
        "merge-insert-location-without-genomes",
        [{"panel_info": [], "target_info": [target("x", "A", "C", insert_location=loc(0, 1, 2))]}],
        "An insert location without targeted_genomes raises.",
    )
    merge(
        "merge-forward-location-without-genomes",
        [{"panel_info": [], "target_info": [{"target_name": "x", "forward_primer": {"seq": "A", "location": loc(0, 1, 2)}, "reverse_primer": {"seq": "C"}}]}],
        "A forward primer location without targeted_genomes raises.",
    )
    merge(
        "merge-reverse-location-without-genomes",
        [{"panel_info": [], "target_info": [{"target_name": "x", "forward_primer": {"seq": "A"}, "reverse_primer": {"seq": "C", "location": loc(0, 1, 2)}}]}],
        "A reverse primer location without targeted_genomes raises.",
    )
    merge(
        "merge-duplicate-location-without-genomes-skipped",
        [no_genome, {"panel_info": [], "target_info": [target("n1", "A", "C", insert_location=loc(0, 1, 2))]}],
        "A repeated target is skipped before the location check, so its location without genomes does not raise.",
        divergence="pmotools-ts also warns panel/conflicting-target-definition, since the second n1 differs from the first.",
    )
    merge("merge-missing-target-info", [{"panel_info": []}], "A dict without target_info raises.")
    merge(
        "merge-missing-target-name",
        [{"panel_info": [], "target_info": [{"forward_primer": {"seq": "A"}, "reverse_primer": {"seq": "C"}}]}],
        "A target without target_name raises.",
    )
    merge(
        "merge-null-target-name",
        [{"panel_info": [], "target_info": [target(None, "A", "C")]}],
        "A target whose target_name is None raises.",
    )
    merge(
        "merge-no-panel-info",
        [{"target_info": [target("a", "A", "C")]}],
        "A dict without panel_info contributes targets only.",
    )
    merge(
        "merge-panel-target-out-of-range",
        [{"panel_info": [{"panel_name": "p", "reactions": [{"reaction_name": "r", "panel_targets": [3]}]}], "target_info": [target("a", "A", "C")]}],
        "A panel target index past the end of target_info raises.",
    )
    merge(
        "merge-drops-extra-panel-keys",
        [
            {
                "panel_info": [
                    {"panel_name": "p", "note": "x", "reactions": [{"reaction_name": "r", "panel_targets": [0], "extra": 1}]},
                    {"panel_name": "q"},
                ],
                "target_info": [target("a", "A", "C", extra_key=None)],
            }
        ],
        "Only panel_name, reactions, reaction_name and panel_targets survive; a panel without reactions gets an empty list; target extras are kept.",
    )
    merge(
        "merge-number-and-string-names",
        [
            {"panel_info": [{"panel_name": "p", "reactions": [{"reaction_name": "r", "panel_targets": [0]}]}], "target_info": [target(1, "A", "C")]},
            {"panel_info": [{"panel_name": "q", "reactions": [{"reaction_name": "r", "panel_targets": [0]}]}], "target_info": [target("1", "A", "C")]},
        ],
        "Target names 1 and \"1\" are different dict keys in Python.",
        divergence="pmotools-ts compares and writes names as strings: one target named \"1\", both panels point at index 0, no warning.",
    )
    merge(
        "merge-target-without-primer-no-genomes",
        [{"panel_info": [], "target_info": [{"target_name": "x", "reverse_primer": {"seq": "C"}}]}],
        "Without genomes Python reads target['forward_primer'] and raises KeyError when it is absent.",
    )
    merge(
        "merge-target-without-primer-with-genomes",
        [{"panel_info": [], "targeted_genomes": [GENOME], "target_info": [{"target_name": "x", "reverse_primer": {"seq": "C"}}]}],
        "With genomes Python copies a target without forward_primer through unchecked.",
        divergence="pmotools-ts throws panel/malformed-target: every target it returns has both primers, as its types and the PMO schema require.",
    )

    # merge real builder output
    t1 = with_locations()
    t2 = with_locations()
    t2["target_name"] = ["target3", "target4", "target5"]
    t2["fwd_primer"] = ["TTG", "GGG", "CCC"]
    t2["rev_primer"] = ["ATT", "AAA", "TTT"]
    t2["reaction"] = ["r1", "r2", "r1,r2"]
    t2.loc[0, ["fwd_start", "fwd_end", "rev_start", "rev_end", "insert_start", "insert_end", "chrom"]] = [21, 24, 28, 31, 24, 28, "chr2"]
    built_a = panel_info_table_to_pmo(t1, "panelA", genome_info=GENOME, **LOCATION_KWARGS)
    built_b = panel_info_table_to_pmo(t2, "panelB", genome_info=[GENOME, GENOME_2], reaction_name_col="reaction", **LOCATION_KWARGS)
    merge(
        "merge-builder-output",
        [built_a, built_b],
        "Two panels built by panel_info_table_to_pmo with different genome lists, as the app merges saved panels.",
    )


def main() -> None:
    table_cases()
    check_cases()
    merge_cases()


if __name__ == "__main__":
    main()
