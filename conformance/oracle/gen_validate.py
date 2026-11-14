"""Oracle cases for src/validate: JSON Schema verdicts from pmotools-python.

Every case calls :func:`validate_pmo`, which validates the way
``PMOChecker(load_schema_by_version(v)).validate_pmo_json`` does. That method
is ``jsonschema.validate(instance, schema)``, which is
``check_schema(schema)`` followed by
``best_match(validator_for(schema)(schema).iter_errors(instance))``. Here the
schema check runs once per schema instead of once per instance (it does not
depend on the instance and takes most of the time); the rest is the same
calls. The case records ``"valid"``, or ``"invalid: <keyword> at <JSON Pointer>"`` for
jsonschema's best-match error. Only the verdict has to
match in TypeScript; the pointer is kept for reference.

Instances come from one of three places, to keep the case files small:

- ``file``: a PMO under ``conformance/data/pmo/`` (``.json`` or ``.json.gz``);
- ``instance``: a small value inline;
- ``base``, a fixture under ``cases/validate/fixtures/``, with either
  ``edits`` (a list of single edits ``{"remove": pointer}`` or
  ``{"set": pointer, "value": v}``, each applied to a fresh copy) or
  ``pointer`` + ``values`` (each value placed at that JSON Pointer in a fresh
  copy). The result is then a list with one verdict per edit or value.

The fixture ``full_pmo.json`` is generated here from the schemas: every
property of every class is filled in, with one example string per pattern, so
that every rule has a place to be probed. It is valid against both schemas.

The mutation groups:

- ``required/<version>/<Class>``: each required property removed, at every
  place the class occurs;
- ``null/<version>/<Class>``: each property set to ``null``, everywhere;
- ``types/<version>/<Class>``: each property (first occurrence) set to values
  of every JSON type, including integral floats and huge numbers;
- ``extra/<version>``: an unknown property added to every object;
- ``patterns/<n>``: for every distinct pattern that applies to strings, a
  generated set of boundary strings (every printable ASCII character, control
  and Unicode whitespace, accented, title-case, modifier, CJK, non-ASCII digit,
  astral and recently-assigned characters, trailing newlines, leading and
  trailing junk), each placed alone, before, after, inside and in place of the
  first character of a valid example.
"""

from __future__ import annotations

import copy
import gzip
import json
import re
from typing import Any

from jsonschema import exceptions, validators
from pmotools.pmo_engine.pmo_checker import load_schema_by_version

from oracle.common import CASES, PMOS, run_case

VERSIONS = ["1.0.0", "1.1.0"]
FIXTURES = CASES / "validate" / "fixtures"

_VALIDATORS: dict[str, Any] = {}


def _validator(version: str) -> Any:
    """``jsonschema.validate`` minus the per-call schema check, which runs once here."""
    if version not in _VALIDATORS:
        schema = load_schema_by_version(version)  # what PMOChecker loads
        cls = validators.validator_for(schema)
        cls.check_schema(schema)
        _VALIDATORS[version] = cls(schema)
    return _VALIDATORS[version]


def _pointer(path: Any) -> str:
    return "".join("/" + str(p).replace("~", "~0").replace("/", "~1") for p in path)


def _verdict(version: str, instance: Any) -> str:
    error = exceptions.best_match(_validator(version).iter_errors(instance))
    if error is None:
        return "valid"
    return f"invalid: {error.validator} at {_pointer(error.absolute_path) or '(root)'}"


def _split(pointer: str) -> list:
    return [p.replace("~1", "/").replace("~0", "~") for p in pointer.split("/")[1:]]


def _apply(instance: Any, edit: dict) -> Any:
    out = copy.deepcopy(instance)
    pointer = edit.get("remove", edit.get("set"))
    *parents, last = _split(pointer)
    target = out
    for key in parents:
        target = target[int(key)] if isinstance(target, list) else target[key]
    if isinstance(target, list):
        last = int(last)
    if "remove" in edit:
        del target[last]
    else:
        target[last] = copy.deepcopy(edit["value"])
    return out


def _load_file(name: str) -> Any:
    path = PMOS / name
    if name.endswith(".gz"):
        with gzip.open(path, "rt", encoding="utf-8") as handle:
            return json.load(handle)
    return json.loads(path.read_text(encoding="utf-8"))


def validate_pmo(
    schema_version: str,
    file: str | None = None,
    instance: Any = None,
    base: str | None = None,
    edits: list[dict] | None = None,
    pointer: str | None = None,
    values: list[Any] | None = None,
) -> Any:
    """Validate the way ``PMOChecker.validate_pmo_json`` does; see the module docstring."""
    if file is not None:
        return _verdict(schema_version, _load_file(file))
    if base is not None:
        fixture = json.loads((FIXTURES / f"{base}.json").read_text(encoding="utf-8"))
        if pointer is not None:
            edits = [{"set": pointer, "value": v} for v in values or []]
        return [_verdict(schema_version, _apply(fixture, e)) for e in edits or []]
    return _verdict(schema_version, instance)


# ---------------------------------------------------------------- fixture

#: A valid example for every pattern that applies to strings (keyed by the
#: pattern exactly as the schemas spell it), plus extra probes for patterns
#: with alternatives.
EXAMPLES: dict[str, tuple[str, list[str]]] = {
    r"^[A-z-._0-9{}\(\),\/\ ]+$": ("arg_1 (x)/y{z}", []),
    r"^[A-z-._0-9 ]+$": ("Name 1.0_x-y", []),
    r"^[A-z-._0-9\(\),\/\ ]+$": ("store (a),b/c", []),
    r"\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?": (
        "2024-03-15",
        ["2024-13-01", "2024-1", "x2024-12y", "٢٠٢٤-01", "2024-00", "99999-12-32"],
    ),
    r"^[A-z-._0-9]+$": ("chr_1.2-a", []),
    r"^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$": (
        "https://example.org/x",
        ["ftp://a.b", "http://", "https://.x", "https:// x", "https://a b", "https://ab\n", "https://ab\r"],
    ),
    r"^(?:NA|(https?|ftp):\/\/[^\s/$.?#].[^\s]*)$": (
        "https://example.org/g.fa",
        ["NA", "NA\n", "NAx", "na", "xNA", "http://a b", "http://ab\u0085"],
    ),
    r"^[A-z-]+$": ("ACGT-", []),
    r"[+-]": ("+", ["-", "plus+", "minus", "−", "＋"]),
    r"^[A-z-.;,_0-9\(\),\/\ ]+$": ("a.fq;b.fq,c (1)/d", []),
    r"(?:\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?)?|NA)": (
        "2024-03",
        ["NA", "2024", "xNAx", "na", "N A", "123", "١٩٩٩"],
    ),
    r"^[A-z]$": ("A", ["AB", "a", "_", "\\", "["]),
    r"^[A-z]+$": ("ACGT", []),
    r"^[A-z-._0-9;|\(\),\/\ ]+$": ("drug a;b|c (d),e/f", []),
    r"^[A-z-._0-9:]+$": ("gene:PF3D7_1", []),
    r"^[A-Za-z0-9 ,._:'–-]+$": ("Cote d'Ivoire, X–Y", ["Côte d'Ivoire"]),
    r"^[a-zA-Z0-9+=.]+$": ("10M2I=+.", []),
    r"^[\w ,._:'–-]+$": (
        "Côte d'Ivoire",
        ["São Tomé and Príncipe", "مصر", "日本", "Türkiye_2"],
    ),
    r"^[-+]?\d{1,2}(?:\.\d+)?,[-+]?\d{1,3}(?:\.\d+)?$": (
        "-1.5,36.8",
        ["1,1", "+12.0,-123.45", "123,1", "1,1234", "1.,1", "١,٢", "1 ,2"],
    ),
}

#: A value that is valid for both schema versions where the two patterns differ.
SITE_OVERRIDES = {"pseudocigar_seq": "10A.1", "collection_country": "Kenya", "travel_country": "Kenya"}

#: Characters placed around and inside each example string.
PROBE_CHARS: list[str] = (
    [chr(c) for c in range(0x20, 0x7F)]
    + ["\t", "\n", "\r", "\x0b", "\x0c", "\x00", "\x1c", "\x1f", "\x7f", "\x85"]
    + [" ", " ", " ", " ", " ", " ", "　", "﻿", "​"]
    + ["é", "Ô", "ß", "ǅ", "ʰ", "ı", "K", "́", "中"]
    + ["٣", "²", "Ⅻ", "１", "๓", "½"]
    + ["–", "—", "−", "＋", "‘", "’"]
    + ["\U0001d400", "\U0001f600", "\U00010d40", "Ᲊ", "\U000187f8", "࢈"]
)


def _schema_type(node: dict) -> list[str]:
    t = node.get("type")
    if t is None:
        return []
    return t if isinstance(t, list) else [t]


def _resolve(schema: dict, node: dict) -> dict:
    """Follows $ref and ``anyOf: [$ref, null]`` to the object schema."""
    if "$ref" in node:
        return schema["$defs"][node["$ref"].split("/")[-1]]
    if "anyOf" in node:
        for option in node["anyOf"]:
            if "$ref" in option:
                return _resolve(schema, option)
    return node


def _def_name(node: dict) -> str | None:
    ref = node.get("$ref")
    if ref is None and "anyOf" in node:
        ref = next((o["$ref"] for o in node["anyOf"] if "$ref" in o), None)
    return ref.split("/")[-1] if ref else None


def _example(schema: dict, node: dict, prop: str) -> Any:
    if prop in SITE_OVERRIDES:
        return SITE_OVERRIDES[prop]
    if _def_name(node):
        return _build(schema, _resolve(schema, node))
    types = _schema_type(node)
    if "array" in types:
        return [_example(schema, node["items"], prop)]
    if "string" in types:
        if "pattern" in node:
            return EXAMPLES[node["pattern"]][0]
        return "free text"
    if "integer" in types:
        return 0
    if "number" in types:
        return 0.5
    if "boolean" in types:
        return True
    raise ValueError(f"no example for {prop}: {node}")


def _build(schema: dict, obj_schema: dict) -> dict:
    return {
        prop: _example(schema, sub, prop) for prop, sub in obj_schema.get("properties", {}).items()
    }


def build_fixture() -> dict:
    """Every property of every class, from the 1.1.0 schema plus 1.0.0-only properties."""
    new = load_schema_by_version("1.1.0")
    old = load_schema_by_version("1.0.0")
    fixture = _build(new, new)
    fixture["specimen_info"][0]["host_subject_id"] = 0  # 1.0.0 only
    for version in VERSIONS:
        verdict = _verdict(version, fixture)
        assert verdict == "valid", (version, verdict)
    del old
    return fixture


# ------------------------------------------------------------------ sites


def sites(schema: dict, instance: Any) -> list[dict]:
    """Every object in ``instance`` with the schema class it belongs to."""
    out: list[dict] = []

    def walk(value: Any, node: dict, path: list, name: str) -> None:
        obj = _resolve(schema, node)
        if isinstance(value, dict) and obj.get("properties") is not None:
            out.append({"path": path, "class": name, "schema": obj})
            for prop, sub in obj["properties"].items():
                if prop not in value:
                    continue
                child = value[prop]
                sub_name = _def_name(sub)
                if sub_name:
                    walk(child, sub, path + [prop], sub_name)
                elif isinstance(child, list) and "items" in sub and _def_name(sub["items"]):
                    for i, item in enumerate(child):
                        walk(item, sub["items"], path + [prop, i], _def_name(sub["items"]))

    walk(instance, schema, [], "PortableMicrohaplotypeObject")
    return out


TYPE_PROBES: list[Any] = [None, "1", "", 1, 0, -1, 1.0, 1.5, 1e300, 2**64, True, False, [], [1], {}, {"x": 1}]


def _probe_strings(example: str, extras: list[str]) -> list[str]:
    probes = ["", example, example + "\n", example + "\n\n", example + "\r\n", "\n" + example,
              example + " ", " " + example, "x" + example + "x", "junk " + example + " junk",
              example + example, example.upper(), example.lower()]
    probes += extras
    for extra in extras:
        probes += [extra + "\n", "\n" + extra]
    for c in PROBE_CHARS:
        probes += [c, example + c, c + example, example[:1] + c + example[1:], c + example[1:]]
    seen: set[str] = set()
    return [p for p in probes if not (p in seen or seen.add(p))]


# ------------------------------------------------------------------- main


def main() -> None:
    fixture = build_fixture()
    FIXTURES.mkdir(parents=True, exist_ok=True)
    (FIXTURES / "full_pmo.json").write_text(json.dumps(fixture, indent=1, ensure_ascii=False) + "\n")

    for version in VERSIONS:
        for name in sorted(p.name for p in PMOS.iterdir() if re.search(r"\.json(\.gz)?$", p.name)):
            run_case(
                f"validate/files/{name}__v{version}",
                validate_pmo,
                kwargs={"schema_version": version, "file": name},
                note=f"example file {name} against schema {version}",
            )

    inline = {
        "root-list": [], "root-string": "pmo", "root-null": None, "root-number": 1, "root-empty": {},
    }
    for version in VERSIONS:
        for label, value in inline.items():
            run_case(
                f"validate/inline/{label}__v{version}",
                validate_pmo,
                kwargs={"schema_version": version, "instance": value},
                note=f"{label} against schema {version}",
            )

    for version in VERSIONS:
        schema = load_schema_by_version(version)
        all_sites = sites(schema, fixture)
        by_class: dict[str, list[dict]] = {}
        for site in all_sites:
            by_class.setdefault(site["class"], []).append(site)

        for cls, class_sites in sorted(by_class.items()):
            required = [
                {"remove": _pointer(s["path"] + [field])}
                for s in class_sites for field in s["schema"].get("required", [])
            ]
            if required:
                run_case(f"validate/required/v{version}/{cls}", validate_pmo,
                         kwargs={"schema_version": version, "base": "full_pmo", "edits": required},
                         note=f"each required property of {cls} removed, everywhere it occurs, schema {version}")

            nulls = [
                {"set": _pointer(s["path"] + [prop]), "value": None}
                for s in class_sites for prop in s["schema"]["properties"] if prop in _get(fixture, s["path"])
            ]
            run_case(f"validate/null/v{version}/{cls}", validate_pmo,
                     kwargs={"schema_version": version, "base": "full_pmo", "edits": nulls},
                     note=f"each property of {cls} set to null, everywhere it occurs, schema {version}")

            first = class_sites[0]
            types = [
                {"set": _pointer(first["path"] + [prop]), "value": value}
                for prop in first["schema"]["properties"] for value in TYPE_PROBES
            ]
            run_case(f"validate/types/v{version}/{cls}", validate_pmo,
                     kwargs={"schema_version": version, "base": "full_pmo", "edits": types},
                     note=f"each property of {cls} (first occurrence) set to values of every JSON type, schema {version}")

        extra = [{"set": _pointer(s["path"] + ["not_in_schema"]), "value": {"any": [1, "x"]}} for s in all_sites]
        run_case(f"validate/extra/v{version}", validate_pmo,
                 kwargs={"schema_version": version, "base": "full_pmo", "edits": extra},
                 note=f"an unknown property on every object, schema {version}")

    # One case per distinct pattern that applies to strings, probed at its first
    # site, in the newest schema that has it.
    probed: dict[str, tuple[str, list]] = {}
    for version in reversed(VERSIONS):
        schema = load_schema_by_version(version)
        for site in sites(schema, fixture):
            for prop, sub in site["schema"]["properties"].items():
                items = sub.get("items") if "array" in _schema_type(sub) else None
                node, path = (items, site["path"] + [prop, 0]) if items else (sub, site["path"] + [prop])
                if "pattern" not in node or "string" not in _schema_type(node):
                    continue
                probed.setdefault(node["pattern"], (version, path))
    missing = sorted(set(EXAMPLES) - set(probed))
    assert not missing, f"examples for patterns not found on any string field: {missing}"
    unprobed = sorted(set(probed) - set(EXAMPLES))
    assert not unprobed, f"string patterns without an example: {unprobed}"
    for n, (pattern, (version, path)) in enumerate(sorted(probed.items())):
        example, extras = EXAMPLES[pattern]
        run_case(f"validate/patterns/{n:02d}", validate_pmo,
                 kwargs={"schema_version": version, "base": "full_pmo", "pointer": _pointer(path),
                         "values": _probe_strings(example, extras)},
                 note=f"pattern {pattern!r} at {_pointer(path)}, schema {version}")


def _get(instance: Any, path: list) -> Any:
    for key in path:
        instance = instance[key]
    return instance


if __name__ == "__main__":
    main()
