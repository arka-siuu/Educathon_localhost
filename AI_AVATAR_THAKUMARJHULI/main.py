#!/usr/bin/env python3
"""
gooey_tts_drive_image.py
Text -> gTTS (MP3) -> upload to transfer.sh -> Gooey Lipsync call using your Google Drive image.

Usage:
    python gooey_tts_drive_image.py --text "Hello world"

Requirements:
    pip install gTTS requests
    export GOOEY_API_KEY=sk-xxxx
"""

import os
import sys
import time
import pathlib
import argparse
import requests
from gtts import gTTS
import json

# ----------------------
# Replace this with your Drive direct-download URL (you already provided this)
# ----------------------
DEFAULT_FACE_URL = "https://drive.google.com/uc?export=download&id=1hoUltKBBmhts7ZU3ZLs82VZU2xxG_59Q"

def synthesize_text_to_mp3(text: str, out_path: str, lang: str = "en") -> None:
    """Use gTTS to synthesize text to MP3 at out_path."""
    print("Synthesizing text to MP3 using gTTS...")
    tts = gTTS(text=text, lang=lang)
    tts.save(out_path)
    print("Saved TTS to", out_path)

def upload_file_to_tmpfiles(filepath: str) -> str:
    """Upload a file to tmpfiles.org and return the public URL."""
    print(f"Uploading {filepath} to tmpfiles.org ...")
    with open(filepath, "rb") as f:
        files = {"file": f}
        r = requests.post("https://tmpfiles.org/api/v1/upload", files=files, timeout=120)

    if not r.ok:
        raise RuntimeError(f"tmpfiles.org upload failed: {r.status_code} {r.text}")

    result = r.json()
    if result.get("status") != "success":
        raise RuntimeError(f"tmpfiles.org upload failed: {result}")

    # tmpfiles returns URL in format: https://tmpfiles.org/12345/filename
    # We need to convert it to direct download URL
    upload_url = result["data"]["url"]
    # Convert https://tmpfiles.org/12345 to https://tmpfiles.org/dl/12345
    uploaded_url = upload_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
    print("Uploaded ->", uploaded_url)
    return uploaded_url

def call_gooey_lipsync(face_url: str, audio_url: str) -> dict:
    """Call Gooey Lipsync API. Expects GOOEY_API_KEY in environment."""
    api_key = os.environ.get("GOOEY_API_KEY")
    if not api_key:
        raise RuntimeError("GOOEY_API_KEY environment variable not set. Do: export GOOEY_API_KEY=sk-xxxx")

    payload = {
        "functions": None,
        "variables": None,
        "input_face": face_url,
        "face_padding_top": 0,
        "face_padding_bottom": 18,
        "face_padding_left": 0,
        "face_padding_right": 0,
        "sadtalker_settings": {
            "still": True,
            "ref_pose": None,
            "input_yaw": None,
            "input_roll": None,
            "pose_style": 0,
            "preprocess": "resize",
            "input_pitch": None,
            "ref_eyeblink": None,
            "expression_scale": 1,
        },
        "selected_model": "SadTalker",
        "input_audio": audio_url,
    }

    endpoint = "https://api.gooey.ai/v2/Lipsync?example_id=2t8x735b7f6y"
    headers = {
        "Authorization": "bearer " + api_key,
        "Content-Type": "application/json",
    }
    print("Calling Gooey Lipsync API ...")
    r = requests.post(endpoint, headers=headers, json=payload, timeout=120)
    if not r.ok:
        # show remote error for debugging
        raise RuntimeError(f"Gooey API call failed: {r.status_code} {r.text}")
    return r.json()

def main():
    parser = argparse.ArgumentParser(description="Text -> gTTS -> upload -> Gooey Lipsync (Drive image).")
    parser.add_argument("--text", "-t", required=True, help="Text to synthesize")
    parser.add_argument("--tts-lang", default="en", help="Language for TTS (default: en)")
    parser.add_argument("--face-url", default=DEFAULT_FACE_URL, help="Direct-download image URL (Drive uc?export=download&id=...)")
    parser.add_argument("--keep-files", action="store_true", help="Do not delete temporary files")
    args = parser.parse_args()

    # prepare temp dir
    tmp_dir = pathlib.Path("./.tmp_gooey")
    tmp_dir.mkdir(exist_ok=True)

    ts = int(time.time())
    tts_file = tmp_dir / f"tts_{ts}.mp3"

    try:
        # 1) synthesize text -> mp3
        synthesize_text_to_mp3(args.text, str(tts_file), lang=args.tts_lang)

        # 2) upload mp3 to tmpfiles.org
        audio_url = upload_file_to_tmpfiles(str(tts_file))
        print("Public audio URL:", audio_url)

        # 3) use provided face URL (Drive direct URL)
        face_url = args.face_url
        print("Using face image URL:", face_url)

        # 4) call Gooey
        result = call_gooey_lipsync(face_url=face_url, audio_url=audio_url)
        print("Gooey response (initial):")
        print(json.dumps(result, indent=2))

        # 5) save response locally
        out_json = tmp_dir / f"gooey_response_{ts}.json"
        out_json.write_text(json.dumps(result, indent=2))
        print("Saved Gooey response to", out_json)

        print("\nNotes:")
        print("- Gooey might process the job asynchronously. The response usually contains an 'id' and later 'output.output_video' when processing completes.")
        print("- If you get a 4xx/5xx error, inspect printed response for hints (permissions, invalid URL, etc).")

    except Exception as e:
        print("Error:", e)
        sys.exit(1)
    finally:
        if not args.keep_files:
            try:
                if tts_file.exists():
                    tts_file.unlink()
            except Exception:
                pass

if __name__ == "__main__":
    main()
