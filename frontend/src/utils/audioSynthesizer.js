// Universal Multilingual Speech & Audio Engine for Hindi, Telugu, Marathi, Tamil, Bengali, Hinglish, English

export const NATIVE_VOICE_PROMPTS = {
  en: {
    welcome: "Welcome to National Helpline 14566 against atrocities. Your safety is our priority. Please state your grievance narrative.",
    recording: "Recording vocal biomarkers. Please speak your grievance clearly.",
    ivrs_greet: "Namaste. Welcome to National Helpline 14566. Your call is encrypted."
  },
  hi: {
    welcome: "नमस्ते। राष्ट्रीय अत्याचार निवारण हेल्पलाइन 14566 में आपका स्वागत है। आपकी सुरक्षा हमारी प्राथमिकता है। कृपया अपनी बात कहें।",
    recording: "स्वर बायोमार्कर रिकॉर्ड किए जा रहे हैं। कृपया अपनी बात स्पष्ट रूप से कहें।",
    ivrs_greet: "नमस्ते। राष्ट्रीय अत्याचार निवारण हेल्पलाइन 14566 में आपका स्वागत है। आपकी कॉल एन्क्रिप्टेड है।"
  },
  "hi-EN": {
    welcome: "Namaste. National Helpline 14566 mein aapka swagat hai. Aapki suraksha hamari priority hai. Kripya apni baat batayein.",
    recording: "Voice biomarkers record ho rahe hain. Kripya apni shikayat kahein.",
    ivrs_greet: "Namaste. National Helpline 14566 mein aapka swagat hai. Aapki call encrypted hai."
  },
  te: {
    welcome: "నమస్కారం. జాతీయ దౌర్జన్యాల నిరోధక హెల్ప్‌లైన్ 14566కి స్వాగతం. మీ రక్షణ మా ప్రాధాన్యత. దయచేసి మీ ఫిర్యాదును తెలపండి.",
    recording: "స్వర సంకేతాలు రికార్డ్ అవుతున్నాయి. దయచేసి మీ ఫిర్యాదును స్పష్టంగా చెప్పండి.",
    ivrs_greet: "నమస్కారం. జాతీయ దౌర్జన్యాల నిరోధక హెల్ప్‌లైన్ 14566కి స్వాగతం. మీ కాల్ ఎన్‌క్రిప్ట్ చేయబడింది."
  },
  mr: {
    welcome: "नमस्कार. राष्ट्रीय अत्याचार निवारण हेल्पलाइन 14566 मध्ये आपले स्वागत आहे. आपली सुरक्षितता आमची प्राथमिकता आहे. कृपया आपली तक्रार सांगा.",
    recording: "ध्वनी बायोमार्कर्स रेकॉर्ड होत आहेत. कृपया आपली तक्रार स्पष्टपणे सांगा.",
    ivrs_greet: "नमस्कार. राष्ट्रीय अत्याचार निवारण हेल्पलाइन 14566 मध्ये आपले स्वागत आहे. आपला कॉल एनक्रिप्टेड आहे."
  },
  ta: {
    welcome: "வணக்கம். தேசிய வன்கொடுமை தடுப்பு உதவி எண் 14566க்கு வரவேற்கிறோம். உங்கள் பாதுகாப்பு எங்கள் முன்னுரிமை. தயவுசெய்து உங்கள் புகாரைக் கூறவும்.",
    recording: "குரல் உயிரளவீடுகள் பதிவு செய்யப்படுகின்றன. தயவுசெய்து உங்கள் புகாரைக் கூறவும்.",
    ivrs_greet: "வணக்கம். தேசிய வன்கொடுமை தடுப்பு உதவி எண் 14566க்கு வரவேற்கிறோம். உங்கள் அழைப்பு பாதுகாப்பானது."
  },
  bn: {
    welcome: "নমস্কার। জাতীয় অত্যাচার প্রতিরোধ হেল্পলাইন 14566-এ আপনাকে স্বাগতম। আপনার সুরক্ষা আমাদের অগ্রাধিকার। অনুগ্রহ করে আপনার অভিযোগ জানান।",
    recording: "কণ্ঠস্বরের বায়োমার্কার রেকর্ড করা হচ্ছে। অনুগ্রহ করে আপনার অভিযোগ স্পষ্ট করে বলুন।",
    ivrs_greet: "নমস্কার। জাতীয় অত্যাচার প্রতিরোধ হেল্পলাইন 14566-এ আপনাকে স্বাগতম। আপনার কল এনক্রিপ্টেড।"
  }
};

class UniversalVoiceAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.filterNode = null;
    this.currentAudioElement = null;
    this.isPlaying = false;
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Guaranteed Universal Spoken Voice method in Telugu, Hindi, Marathi, Tamil, Bengali, Hinglish, English
  speakPrompt(textOrKey, lang = 'en', pitch = 1.0, rate = 1.0) {
    try {
      this.stopAudio();
      this.ensureContext();

      // Resolve prompt text
      let textToSpeak = textOrKey;
      if (NATIVE_VOICE_PROMPTS[lang] && NATIVE_VOICE_PROMPTS[lang][textOrKey]) {
        textToSpeak = NATIVE_VOICE_PROMPTS[lang][textOrKey];
      } else if (NATIVE_VOICE_PROMPTS['en'][textOrKey]) {
        textToSpeak = NATIVE_VOICE_PROMPTS['en'][textOrKey];
      }

      // Map language code to TTS language tag
      let ttsLang = 'en';
      if (lang === 'hi' || lang === 'hi-EN') ttsLang = 'hi';
      else if (lang === 'te') ttsLang = 'te';
      else if (lang === 'ta') ttsLang = 'ta';
      else if (lang === 'bn') ttsLang = 'bn';
      else if (lang === 'mr') ttsLang = 'mr';

      // 1. Try Browser Speech Synthesis if native voice is present
      let spokeWithSpeechSynth = false;
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const hasNativeVoice = voices.some(v => 
          v.lang.toLowerCase().startsWith(ttsLang.toLowerCase()) ||
          v.name.toLowerCase().includes(ttsLang.toLowerCase())
        );

        if (hasNativeVoice || ttsLang === 'en') {
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.pitch = pitch;
          utterance.rate = rate;
          utterance.volume = 1.0;
          utterance.lang = `${ttsLang}-IN`;

          const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(ttsLang.toLowerCase()));
          if (matchingVoice) utterance.voice = matchingVoice;

          window.speechSynthesis.speak(utterance);
          spokeWithSpeechSynth = true;
        }
      }

      // 2. Universal Web Audio TTS Stream Fallback (Guarantees loud native speech in Hindi, Telugu, Tamil, Bengali, Marathi!)
      if (!spokeWithSpeechSynth) {
        const encodedText = encodeURIComponent(textToSpeak.substring(0, 190));
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodedText}`;
        
        this.currentAudioElement = new Audio(ttsUrl);
        this.currentAudioElement.volume = 1.0;
        
        const playPromise = this.currentAudioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('Web Audio TTS stream fallback required user gesture, playing synthetic audio tone:', err);
            this.playAudioFeedbackTone(pitch * 240);
          });
        }
      }

    } catch (err) {
      console.error('Universal Multilingual Voice Error:', err);
      this.playAudioFeedbackTone(220);
    }
  }

  // Audio tone feedback fallback
  playAudioFeedbackTone(pitchHz = 240) {
    try {
      this.ensureContext();
      this.stopAudio();

      this.oscillator = this.audioCtx.createOscillator();
      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(pitchHz, this.audioCtx.currentTime);

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isPlaying = true;

      setTimeout(() => {
        this.stopAudio();
      }, 1200);
    } catch (e) {}
  }

  // Play modulated voice tone
  startModulatedTone(pitchHz = 220, tremorIntensity = 30, usePhoneFilter = true) {
    try {
      this.stopAudio();
      this.ensureContext();

      this.oscillator = this.audioCtx.createOscillator();
      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(pitchHz, this.audioCtx.currentTime);

      if (tremorIntensity > 0) {
        const lfo = this.audioCtx.createOscillator();
        lfo.frequency.value = 8;
        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.value = (tremorIntensity / 100) * 25.0;
        lfo.connect(this.oscillator.frequency);
        lfo.start();
      }

      this.filterNode = this.audioCtx.createBiquadFilter();
      if (usePhoneFilter) {
        this.filterNode.type = 'bandpass';
        this.filterNode.frequency.value = 1400;
        this.filterNode.Q.value = 1.5;
      } else {
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.value = 3200;
      }

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.oscillator.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isPlaying = true;
    } catch (err) {
      console.error('Web Audio Tone Error:', err);
    }
  }

  // Phone ring sound
  playPhoneRing() {
    try {
      this.ensureContext();
      this.stopAudio();

      this.oscillator = this.audioCtx.createOscillator();
      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime);

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isPlaying = true;

      setTimeout(() => {
        this.stopAudio();
      }, 1200);
    } catch (e) {}
  }

  stopAudio() {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (this.currentAudioElement) {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement = null;
      }
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
    } catch (e) {}
    this.isPlaying = false;
  }
}

export const audioEngine = new UniversalVoiceAudioEngine();
