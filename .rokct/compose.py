#!/usr/bin/env python3
# Copyright (c) 2026 RokctAI
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

"""
The-Rokct-Protocol: compose.py wrapper for Next.js
Fetches sdk_composer.py and sdk_installer_base.py from GitHub pinned to
PROTOCOL_REF, verifies their SHA-256, then executes the composer locally.

Mirrors the Flutter wrapper (core/skills/.rok/flutter/scripts/compose.py)
pointed at core/utils/nextjs/, per core/utils/nextjs/README.md. NOTE:
tools/gen_protocol_lock.py does not carry core/utils/nextjs/* LOCK_TARGETS
yet, so the constants below were pinned by hand when this shell was seeded
(protocol HEAD at seed time). Re-pin them when the protocol adds nextjs lock
entries or when the upstream scripts change.
"""

import hashlib, os, sys, subprocess, urllib.request

# Pinned by hand at seed time - see module docstring.
PROTOCOL_REF = "0ad5de7353bf3997cde17cb0cec70736b8bd4a49"
COMPOSER_PATH = "core/utils/nextjs/sdk_composer.py"
INSTALLER_BASE_PATH = "core/utils/nextjs/sdk_installer_base.py"
GITHUB_RAW_BASE = (
    f"https://raw.githubusercontent.com/RokctAI/The-Rokct-Protocol/{PROTOCOL_REF}"
)
EXPECTED_SHA256 = {
    "core/utils/nextjs/sdk_composer.py": "c821f0f86e14abbb727efcd281718fd7d6d3a2c277a93e03333a3e4d53f30a57",
    "core/utils/nextjs/sdk_installer_base.py": "c68f74217103367fc96a0a8571e8496e798f95c9e2cc8d97c00b93d9628cb598",
}


def fetch_script(path):
    url = f"{GITHUB_RAW_BASE}/{path}"
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0", "X-Trace-Id": "nextjs-bootstrap"},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status != 200:
                return None
            data = resp.read()
    except Exception:
        return None
    digest = hashlib.sha256(data).hexdigest()
    if digest != EXPECTED_SHA256[path]:
        print(
            f"[compose] Integrity check failed for {path} (ref {PROTOCOL_REF}):",
            file=sys.stderr,
        )
        print(f"[compose]   expected sha256 {EXPECTED_SHA256[path]}", file=sys.stderr)
        print(f"[compose]   actual   sha256 {digest}", file=sys.stderr)
        print("[compose] Refusing to execute unverified code.", file=sys.stderr)
        sys.exit(1)
    return data.decode("utf-8")


def main():
    composer_code = fetch_script(COMPOSER_PATH)
    installer_base_code = fetch_script(INSTALLER_BASE_PATH)

    if not composer_code or not installer_base_code:
        print("Error: Next.js composer scripts not found on GitHub.", file=sys.stderr)
        sys.exit(1)

    # Write both to the current working directory temporarily so imports match.
    # sdk_installer_base.py must land in .rokct/ specifically: each cached SDK's
    # install.py does sys.path.append(os.path.join(os.getcwd(), '.rokct')) before
    # importing it, so writing it to the cwd root causes
    # "ModuleNotFoundError: No module named 'sdk_installer_base'" for every SDK.
    tmp_composer = os.path.join(os.getcwd(), "_tmp_sdk_composer.py")
    rokct_dir = os.path.join(os.getcwd(), ".rokct")
    os.makedirs(rokct_dir, exist_ok=True)
    tmp_installer_base = os.path.join(rokct_dir, "sdk_installer_base.py")

    with open(tmp_composer, "w", encoding="utf-8") as f:
        f.write(composer_code)

    # Always overwrite with the freshly-fetched copy: a stale local file left
    # over from a prior run must never shadow fixes pushed to GitHub.
    with open(tmp_installer_base, "w", encoding="utf-8") as f:
        f.write(installer_base_code)

    try:
        result = subprocess.run(
            [sys.executable, tmp_composer] + sys.argv[1:], check=False
        )
        sys.exit(result.returncode)
    finally:
        if os.path.exists(tmp_composer):
            os.unlink(tmp_composer)
        if os.path.exists(tmp_installer_base):
            os.unlink(tmp_installer_base)


if __name__ == "__main__":
    main()
