# AI-Based Real-Time Stress & Trauma Assessment Module (NHAA 14566)

> **SIH 2026 | Problem Statement #26093**  
> Ministry of Social Justice and Empowerment (MoSJE) — Department of Social Justice & Empowerment  
> **Category:** Software | **Theme:** Smart Automation

---

## Project Overview

An end-to-end, trauma-informed **AI Stress & Trauma Assessment Module** designed for SC/ST victims approaching the **National Helpline Against Atrocities (14566)**, Integrated Portal, Chatbot, IVRS, and Mobile Application.

The system listens to complainants through multiple digital intake channels and in real-time assesses their **psychological stress, trauma, fear, anxiety, and vulnerability levels** to trigger appropriate government support actions — before a formal FIR is even filed.

---

## Core Features

| Feature | Description |
|---|---|
| **Multi-Channel Intake** | Trauma Chatbot, IVRS Telephonic Intake (14566), Mobile App View |
| **Acoustic Prosody Engine** | Extracts F0 pitch variance, vocal jitter, shimmer, pause ratio, speech rate |
| **Voice Audio Modulator** | Interactive Web Audio API demo — telephonic G.711 filter, tremor LFO, pitch sliders |
| **Multilingual NLP** | Hindi, Telugu, Marathi, Tamil, Bengali, Hinglish, English |
| **Glass-Box SVI Score** | Explainable Stress Vulnerability Index (0–100), fully auditable |
| **Auto-Recommendation Engine** | Maps SVI to 6 government support verticals |
| **Officer Control Room** | Priority queue, silent escalation alerts, longitudinal SVI trend chart |
| **AI Ethics & Bias Audit** | Subgroup language parity auditor, consent ledger |
| **Personalized Safety Plan** | Custom victim profile, district-specific legal aid, witness protection |

---

## System Architecture

```
SIH-2026/
├── backend/                         # FastAPI Python Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints.py         # REST API: /assess, /analyze, /cases, /fairness
│   │   ├── core/
│   │   │   └── config.py            # Settings & CORS config
│   │   ├── data/
│   │   │   └── sample_cases.py      # Realistic SC/ST PoA Act grievance test cases
│   │   ├── ml/
│   │   │   ├── speech_processor.py  # Acoustic prosody & pitch micro-tremor extraction
│   │   │   ├── nlp_processor.py     # Indic text sentiment, trauma lexicon & NER
│   │   │   ├── svi_engine.py        # Glass-box SVI composite scoring engine
│   │   │   ├── recommendation_engine.py  # Decision matrix → 6 support verticals
│   │   │   └── fairness_auditor.py  # AI ethics & subgroup bias auditor
│   │   └── main.py                  # FastAPI server entrypoint
│   └── requirements.txt
│
└── frontend/                        # React + Vite Frontend
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx            # Navigation, language selector, stealth mode
    │   │   ├── ConsentModal.jsx      # Victim privacy & consent modal
    │   │   ├── IntakePortal.jsx      # Multi-channel tab container
    │   │   ├── TraumaChatbot.jsx     # Trauma chatbot with voice & grievance presets
    │   │   ├── IVRSSimulator.jsx     # IVRS telephonic intake with live prosody meters
    │   │   ├── MobileAppView.jsx     # NHAA mobile app channel view
    │   │   ├── VoiceModulatorPanel.jsx  # Interactive voice modulation sliders
    │   │   ├── PersonalizedProfileCard.jsx  # Victim profile & safety plan generator
    │   │   ├── SVIDashboard.jsx      # SVI score gauge, radar chart, sub-score breakdown
    │   │   ├── RecommendationCards.jsx  # 6 government support action cards
    │   │   ├── CounsellorDashboard.jsx  # Officer control room & escalation queue
    │   │   └── FairnessAudit.jsx     # AI ethics & bias audit dashboard
    │   ├── utils/
    │   │   ├── audioSynthesizer.js   # Universal multilingual Web Audio + TTS engine
    │   │   ├── translations.js       # Full UI translations (EN, HI, TE, MR, TA, BN, Hinglish)
    │   │   └── samplePresets.js     # One-click grievance test scenarios
    │   ├── App.jsx                   # Master state container
    │   └── index.css                 # Glassmorphic dark theme CSS
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## SVI Mathematical Model

The **Stress Vulnerability Index (SVI)** is computed as a weighted composite:

```
SVI = w1 * A + w2 * L + w3 * C + w4 * H

Where:
  A = Acoustic Stress Score     (weight: 0.30) — Pitch, jitter, shimmer, pause ratio
  L = Linguistic Trauma Score   (weight: 0.35) — Sentiment, trauma lexicon, suicidal ideation
  C = Contextual Severity Score (weight: 0.25) — FIR refusal, repeat harassment, perpetrator power
  H = Historical Trend Score    (weight: 0.10) — Prior case escalation trajectory

SVI Range → Risk Level:
  0–29:   Low Vulnerability
  30–59:  Moderate Vulnerability
  60–79:  High Vulnerability
  80–100: Critical — Immediate Escalation Required
```

---

## How to Run the Project

### Prerequisites

- **Python 3.11+** (developed on Python 3.11.9 — recommended version)
- **Node.js 20+** and **npm 10+** (developed on Node.js v24.15.0 / npm 11.12.1)

---

### 1. Backend — FastAPI Server

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python app/main.py
```

- Backend API: `http://127.0.0.1:8000`
- Interactive API Docs: `http://127.0.0.1:8000/docs`

---

### 2. Frontend — React + Vite Web Application

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

- Frontend App: `http://localhost:3000`

---

### 3. Verify Both Services Are Running

Open your browser and go to:  
`http://localhost:3000`

The frontend automatically proxies `/api` requests to the backend at port 8000 (configured via `vite.config.js`).

---

## Supported Languages

The system supports voice synthesis, UI translation, and NLP trauma assessment across:

| Language | Code | Voice TTS |
|---|---|---|
| English | `en` | Native browser voice |
| Hindi | `hi` | `hi-IN` native TTS |
| Telugu | `te` | `te-IN` native TTS |
| Marathi | `mr` | `mr-IN` native TTS |
| Tamil | `ta` | `ta-IN` native TTS |
| Bengali | `bn` | `bn-IN` native TTS |
| Hinglish | `hi-EN` | Transliterated Hindi |

---

## Government Support Verticals

The Auto-Recommendation Engine maps SVI scores and trauma tags to 6 action verticals:

1. **Emergency Police Response** — 112 / 14566 dispatch
2. **Psychological Counselling** — Trauma counsellor assignment
3. **Witness Protection** — Safe house under Witness Protection Scheme 2018
4. **Free Legal Aid** — District Legal Services Authority (DLSA) advocate
5. **Medical & MLC Support** — Hospital & Medico-Legal Certificate
6. **SC/ST Relief Fund Grant** — Financial compensation under PoA Act

---

## AI Ethics & Governance

- **Trauma-Informed Design**: Non-triggering, gentle conversational flow
- **Explicit Consent Ledger**: Full victim control over voice and log retention
- **Glass-Box Explainability**: Every SVI score shows exact weight contributions for auditability
- **Subgroup Language Parity Audit**: Detects model accuracy disparities across language groups
- **Stealth Safety Mode**: Quick-hide interface if victim is in danger

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Recharts |
| Backend | FastAPI, Python 3.9+ |
| Audio | Web Audio API, Speech Synthesis API (SpeechSynthesisUtterance) |
| NLP | IndicBERT (planned), Trauma Lexicon, Regex NER |
| Speech | Librosa acoustic features (F0, jitter, shimmer) |
| Deployment | Vite dev server + FastAPI Uvicorn |

---

## Team

**SIH 2026 Team — AI Stress & Trauma Assessment Module**  
Contributor: Harshita Seja (asseja.harshita@gmail.com)

---

## Status

> **Draft v1.0** — Initial prototype build. Active development in progress.
