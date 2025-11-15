#!/usr/bin/env python3
"""
Thakuma AI Avatar - Educational Assistant for School Students
"""

import os
import time
import json
import pathlib
import requests
from flask import Flask, render_template, request, jsonify, send_from_directory
from gtts import gTTS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'thakuma-ai-secret-key'

# Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GOOEY_API_KEY = os.getenv('GOOEY_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Avatar image path
AVATAR_IMAGE_PATH = "THAKUMA_AIAVATAAR.png"
UPLOAD_FOLDER = pathlib.Path("./static/videos")
UPLOAD_FOLDER.mkdir(exist_ok=True, parents=True)

def get_gemini_response(question: str) -> str:
    """Get educational response from Gemini API."""
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
    }

    # Create educational prompt
    educational_prompt = f"""You are Thakuma (Grandmother), a warm and loving teacher from Bengali folklore who tells educational stories to children.
Answer this question in a simple, engaging way suitable for school students. Keep it under 100 words and make it fun and easy to understand.

Question: {question}

Answer as Thakuma would - warmly, simply, and with love."""

    payload = {
        "contents": [{
            "parts": [{
                "text": educational_prompt
            }]
        }]
    }

    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()

        result = response.json()
        answer = result['candidates'][0]['content']['parts'][0]['text']
        return answer.strip()
    except Exception as e:
        print(f"Gemini API error: {e}")
        return "My dear child, I'm having trouble thinking right now. Can you ask me again?"

def synthesize_text_to_mp3(text: str, out_path: str, lang: str = "en") -> None:
    """Use gTTS to synthesize text to MP3."""
    print(f"Creating audio for Thakuma's response...")
    tts = gTTS(text=text, lang=lang)
    tts.save(out_path)
    print(f"Audio saved to {out_path}")

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

    upload_url = result["data"]["url"]
    uploaded_url = upload_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
    print("Uploaded ->", uploaded_url)
    return uploaded_url

def upload_image_to_tmpfiles(filepath: str) -> str:
    """Upload the avatar image to tmpfiles.org."""
    print(f"Uploading avatar image to tmpfiles.org ...")
    with open(filepath, "rb") as f:
        files = {"file": f}
        r = requests.post("https://tmpfiles.org/api/v1/upload", files=files, timeout=120)

    if not r.ok:
        raise RuntimeError(f"tmpfiles.org upload failed: {r.status_code} {r.text}")

    result = r.json()
    if result.get("status") != "success":
        raise RuntimeError(f"tmpfiles.org upload failed: {result}")

    upload_url = result["data"]["url"]
    uploaded_url = upload_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
    print("Avatar uploaded ->", uploaded_url)
    return uploaded_url

def call_gooey_lipsync(face_url: str, audio_url: str) -> dict:
    """Call Gooey Lipsync API."""
    if not GOOEY_API_KEY:
        raise RuntimeError("GOOEY_API_KEY not set in environment")

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
        "Authorization": "bearer " + GOOEY_API_KEY,
        "Content-Type": "application/json",
    }

    print("Calling Gooey Lipsync API to animate Thakuma...")
    r = requests.post(endpoint, headers=headers, json=payload, timeout=120)

    if not r.ok:
        raise RuntimeError(f"Gooey API call failed: {r.status_code} {r.text}")

    return r.json()

@app.route('/')
def index():
    """Serve the main page."""
    return render_template('index.html')

@app.route('/avatar')
def serve_avatar():
    """Serve the avatar image."""
    return send_from_directory('.', AVATAR_IMAGE_PATH)

@app.route('/favicon.ico')
def favicon():
    """Handle favicon requests."""
    # Return a simple 204 No Content response
    return '', 204

@app.route('/ask', methods=['POST'])
def ask_question():
    """Handle student questions and generate avatar response."""
    try:
        data = request.get_json()
        question = data.get('question', '').strip()

        if not question:
            return jsonify({'error': 'Please ask a question!'}), 400

        print(f"\n{'='*60}")
        print(f"Student asked: {question}")
        print(f"{'='*60}")

        # Step 1: Get answer from Gemini
        print("\n[1/5] Asking Thakuma to think of an answer...")
        answer = get_gemini_response(question)
        print(f"Thakuma's answer: {answer}")

        # Step 2: Create temp directory
        tmp_dir = pathlib.Path("./.tmp_thakuma")
        tmp_dir.mkdir(exist_ok=True)

        ts = int(time.time())
        tts_file = tmp_dir / f"thakuma_answer_{ts}.mp3"

        # Step 3: Convert answer to speech
        print("\n[2/5] Creating Thakuma's voice...")
        synthesize_text_to_mp3(answer, str(tts_file), lang="en")

        # Step 4: Upload audio
        print("\n[3/5] Uploading audio...")
        audio_url = upload_file_to_tmpfiles(str(tts_file))

        # Step 5: Upload avatar image
        print("\n[4/5] Uploading Thakuma's image...")
        face_url = upload_image_to_tmpfiles(AVATAR_IMAGE_PATH)

        # Step 6: Generate lipsync video
        print("\n[5/5] Bringing Thakuma to life...")
        result = call_gooey_lipsync(face_url=face_url, audio_url=audio_url)

        video_url = result.get('output', {}).get('output_video')

        if not video_url:
            return jsonify({'error': 'Failed to generate video'}), 500

        print(f"\nSuccess! Video URL: {video_url}")
        print(f"{'='*60}\n")

        # Clean up temp file
        try:
            tts_file.unlink()
        except:
            pass

        return jsonify({
            'answer': answer,
            'video_url': video_url,
            'gooey_url': result.get('url')
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("Thakuma AI Avatar - Educational Assistant Starting...")
    print("="*60)
    print(f"Avatar: {AVATAR_IMAGE_PATH}")
    print(f"Gemini API: {'[OK] Configured' if GEMINI_API_KEY else '[ERROR] Missing'}")
    print(f"Gooey API: {'[OK] Configured' if GOOEY_API_KEY else '[ERROR] Missing'}")
    print("="*60 + "\n")
    print("Open your browser to: http://localhost:5000")
    print("\n")

    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
