"""Regenerate every oracle case: run ``main()`` in each ``gen_*`` module.

Usage, from the repository root: ``pnpm oracle``
"""

from __future__ import annotations

import importlib
import pkgutil
import sys

import oracle


def main() -> int:
    names = sorted(
        module.name for module in pkgutil.iter_modules(oracle.__path__) if module.name.startswith("gen_")
    )
    for name in names:
        print(f"== {name}", flush=True)
        importlib.import_module(f"oracle.{name}").main()
    print(f"ran {len(names)} generators")
    return 0


if __name__ == "__main__":
    sys.exit(main())
