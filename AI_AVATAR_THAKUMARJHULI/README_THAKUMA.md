# 🎓 Thakuma's Learning Corner - AI Avatar Educational Assistant

An interactive educational web application featuring **Thakuma** (Grandmother from Bengali folklore) as an AI-powered teacher for school students.

## 🌟 Features

- **Beautiful, Child-Friendly UI** - Colorful, engaging interface designed for children
- **AI-Powered Learning** - Uses Google's Gemini 2.0 Flash for educational responses
- **Animated Avatar** - Thakuma comes to life with lipsync animation using Gooey AI
- **Interactive Experience** - Students can ask any educational question
- **Voice Responses** - Text-to-speech with avatar animation

## 🚀 How It Works

1. **Student asks a question** (e.g., "Teach me about Newton's Laws")
2. **Gemini AI generates** an educational, child-friendly answer
3. **Text-to-speech** converts the answer to audio
4. **Gooey AI animates** Thakuma's avatar with lipsync
5. **Student watches** Thakuma explain the concept with video

## 📋 Requirements

- Python 3.8+
- Internet connection (for APIs)
- Gemini API key
- Gooey API key

## ⚙️ Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Verify .env file** has both API keys:
   ```
   GEMINI_API_KEY="your-gemini-key"
   GOOEY_API_KEY="your-gooey-key"
   ```

3. **Ensure avatar image** exists:
   - File: `THAKUMA_AIAVATAAR.png`
   - Should be in the root directory

## 🎯 Running the Application

```bash
python app.py
```

Then open your browser to: **http://localhost:5000**

## 🎨 User Interface

The application features:
- **Gradient purple/pink background** with floating star animations
- **Large, friendly avatar** of Thakuma
- **Easy-to-use input field** for questions
- **Example questions** to get started quickly
- **Loading animations** while processing
- **Video player** showing Thakuma's animated response

## 💡 Example Questions

- "Teach me about Newton's Laws"
- "How does photosynthesis work?"
- "Explain the water cycle"
- "What is gravity?"
- "How do plants grow?"

## 🎭 About Thakuma

Thakuma is a beloved character from **Thakumar Jhuli**, a famous collection of Bengali folk tales and fairy tales. She represents wisdom, warmth, and traditional storytelling - perfect for teaching children!

## 🔧 Technical Stack

- **Backend:** Flask (Python)
- **AI Model:** Google Gemini 2.0 Flash
- **Text-to-Speech:** gTTS (Google Text-to-Speech)
- **Avatar Animation:** Gooey AI (SadTalker)
- **File Hosting:** tmpfiles.org
- **Frontend:** HTML5, CSS3, Vanilla JavaScript

## 🎯 Target Audience

School students (ages 6-14) learning various subjects in a fun, interactive way.

## 📝 Notes

- Video generation takes 30-60 seconds
- Responses are kept under 100 words for child attention spans
- All content is educational and age-appropriate
- The avatar uses warm, grandmother-like language

---

Made with ❤️ for young learners
