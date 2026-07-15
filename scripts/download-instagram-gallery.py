#!/usr/bin/env python3
"""
Stáhne fotky z Instagramu @formanka_zeravice do public/galerie/instagram/.

Bez přihlášení: prvních ~12 příspěvků (40 fotek) v max. veřejném rozlišení (~1080 px).
Pro celý profil (~200 příspěvků) použijte instaloader s přihlášením:

  python3 -m instaloader --login YOUR_IG_USERNAME --no-metadata-json \\
    --no-captions --no-compress-json --no-profile-pic \\
    --dirname-pattern=public/galerie/instagram/raw \\
    formanka_zeravice

Poté přejmenujte soubory nebo spusťte tento skript znovu (přepíše manifest).
"""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

USERNAME = "formanka_zeravice"
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "galerie" / "instagram"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "X-IG-App-ID": "936619743392459",
}
DOC_ID = "7950326061742207"


def fetch_profile() -> dict:
    url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={USERNAME}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def fetch_page(user_id: str, after: str | None = None) -> dict:
    variables: dict = {"id": user_id, "first": 50}
    if after:
        variables["after"] = after
    body = urllib.parse.urlencode(
        {
            "variables": json.dumps(variables, separators=(",", ":")),
            "doc_id": DOC_ID,
            "server_timestamps": "true",
        }
    ).encode()
    req = urllib.request.Request(
        "https://www.instagram.com/graphql/query",
        data=body,
        method="POST",
        headers={
            **HEADERS,
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": f"https://www.instagram.com/{USERNAME}/",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def iter_image_nodes(node: dict):
    if node.get("is_video") and node.get("__typename") == "GraphVideo":
        return
    children = node.get("edge_sidecar_to_children", {}).get("edges", [])
    if children:
        for i, child in enumerate(children):
            cn = child["node"]
            if cn.get("is_video"):
                continue
            yield cn, i
    elif not node.get("is_video"):
        yield node, 0


def caption_for(node: dict) -> str:
    edges = node.get("edge_media_to_caption", {}).get("edges", [])
    if edges:
        return edges[0]["node"].get("text", "")[:200]
    return ""


def download_url(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": HEADERS["User-Agent"]})
    with urllib.request.urlopen(req, timeout=60) as resp:
        dest.write_bytes(resp.read())


def collect_all_edges(profile: dict) -> list[dict]:
    user = profile["data"]["user"]
    user_id = user["id"]
    media = user["edge_owner_to_timeline_media"]
    edges = list(media["edges"])
    page_info = media["page_info"]

    while page_info.get("has_next_page"):
        try:
            page = fetch_page(user_id, page_info["end_cursor"])
            media = page["data"]["user"]["edge_owner_to_timeline_media"]
            edges.extend(media["edges"])
            page_info = media["page_info"]
            print(f"  načteno {len(edges)} příspěvků…")
        except urllib.error.HTTPError as err:
            print(f"Paginace selhala ({err.code}) – uloženo {len(edges)} příspěvků.", file=sys.stderr)
            break

    return edges


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Stahuji @{USERNAME} → {OUT_DIR}")

    profile = fetch_profile()
    total = profile["data"]["user"]["edge_owner_to_timeline_media"]["count"]
    print(f"Profil má {total} příspěvků.")

    edges = collect_all_edges(profile)
    manifest: list[dict] = []
    idx = 0

    for edge in edges:
        node = edge["node"]
        shortcode = node["shortcode"]
        caption = caption_for(node)
        for img_node, sub in iter_image_nodes(node):
            url = img_node.get("display_url")
            if not url:
                continue
            ext = "webp" if ".webp" in url.split("?")[0] else "jpg"
            name = f"{idx:03d}_{shortcode}" + (f"_{sub}" if sub else "") + f".{ext}"
            path = OUT_DIR / name
            dims = img_node.get("dimensions", {})
            print(f"  {name} ({dims.get('width')}×{dims.get('height')})")
            download_url(url, path)
            manifest.append(
                {
                    "file": f"/galerie/instagram/{name}",
                    "shortcode": shortcode,
                    "width": dims.get("width"),
                    "height": dims.get("height"),
                    "alt": caption or f"Na Formance Žeravice – fotografie {idx + 1}",
                }
            )
            idx += 1

    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
    print(f"Hotovo: {idx} fotek, manifest.json aktualizován.")


if __name__ == "__main__":
    main()
