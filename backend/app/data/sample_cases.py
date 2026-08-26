SAMPLE_CASES = [
    {
        "case_id": "NHAA-2026-8942",
        "victim_name": "Sunita Devi (Anonymized)",
        "channel": "Chatbot Intake",
        "language": "Hindi (Code-Mixed)",
        "district": "Hathras, Uttar Pradesh",
        "timestamp": "2026-08-25T19:30:00Z",
        "complaint_text": "Main Hathras se bol rahi hu. Gaon ke sarpanch aur unke gundon ne mere pati ko lathi se mara. Hamari zameen pe qabza kar liya aur keh rahe hain gaau chhod do varna jaan se maar denge. Police thane gayi toh daroga ne FIR likhne se manaa kar diya. Mujhe ab marne ka man kar raha hai, koi rasta nahi dikh raha.",
        "prosody": {
            "pitch_mean": 245.0,
            "pitch_std": 48.2,
            "jitter": 0.038,
            "shimmer": 0.065,
            "pause_ratio": 0.38,
            "speaking_rate": 1.7,
            "energy_variance": 18.5
        },
        "context_factors": {
            "is_woman_or_child": True,
            "is_repeat_harassment": True,
            "police_fir_refused": True,
            "perpetrator_in_power": True
        },
        "historical_svi": [42.0, 58.5, 71.0]
    },
    {
        "case_id": "NHAA-2026-7411",
        "victim_name": "Ramesh Kumar",
        "channel": "IVRS Call Simulator",
        "language": "Hindi",
        "district": "Gwalior, Madhya Pradesh",
        "timestamp": "2026-08-25T18:15:00Z",
        "complaint_text": "Humare basti ka paani ka kuan band kar diya gaya hai. Jaati ke naam par bahiishkaar kar diya hai. Dukaan se ration bhi nahi de rahe hain. Bolte hain tum dalit ho yahan se bhaag jao. Humare bache bhukhe hain.",
        "prosody": {
            "pitch_mean": 210.0,
            "pitch_std": 32.0,
            "jitter": 0.022,
            "shimmer": 0.045,
            "pause_ratio": 0.28,
            "speaking_rate": 2.2,
            "energy_variance": 12.0
        },
        "context_factors": {
            "is_woman_or_child": False,
            "is_repeat_harassment": True,
            "police_fir_refused": False,
            "perpetrator_in_power": True
        },
        "historical_svi": [35.0, 48.0]
    },
    {
        "case_id": "NHAA-2026-6109",
        "victim_name": "Anita Valmiki",
        "channel": "Mobile Application",
        "language": "English",
        "district": "Jaipur, Rajasthan",
        "timestamp": "2026-08-25T16:40:00Z",
        "complaint_text": "I was subjected to explicit casteist slurs at my workplace and threatened with violence if I report to higher authorities. They tore my official files and warned me to withdraw my previous complaint under SC/ST Act.",
        "prosody": None, # text-only intake
        "context_factors": {
            "is_woman_or_child": True,
            "is_repeat_harassment": True,
            "police_fir_refused": False,
            "perpetrator_in_power": True
        },
        "historical_svi": [28.0, 45.0]
    }
]
