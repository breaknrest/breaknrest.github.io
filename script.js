/**
 * break. — A Simple Sanctuary for Your Career Break
 * 
 * =========================================================================
 * ⚙️ CONFIGURATION (Set your background video & sound settings here)
 * =========================================================================
 */
const BREAK_CONFIG = {
  // -----------------------------------------------------------------------
  // LOCAL VIDEO SETTINGS
  // -----------------------------------------------------------------------
  // Path to your local video file inside the assets/ directory
  // (assets/video.webm is included as default; or you can use assets/video.mp4)
  localVideoPath: 'assets/video.mp4',

  // Background video tint darkness (0.20 = light, 0.42 = balanced & vivid, 0.70 = dark)
  overlayDarkness: 0.50,

  // -----------------------------------------------------------------------
  // AMBIENT SOUND SETTINGS
  // -----------------------------------------------------------------------
  // Sound Type:
  // - 'generated' : built-in procedural ocean surf waves (no audio file required)
  // - 'file'      : your own custom audio file (e.g. MP3, WAV, AAC)
  soundType: 'file',

  // Path to your custom audio file in assets/ (used when soundType is 'file'):
  audioFilePath: 'assets/ambient.mp3',

  // Ambient sound volume level (0.0 to 1.0)
  soundVolume: 0.50
};

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Initialize Local Background Video
  // =========================================================================
  const bgVideo = document.getElementById('bg-video');

  // Apply tint darkness
  document.documentElement.style.setProperty('--overlay-opacity', BREAK_CONFIG.overlayDarkness);

  if (bgVideo) {
    bgVideo.src = BREAK_CONFIG.localVideoPath;
    bgVideo.load();
    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If browser autoplay policy requires user gesture, play on first interaction
        document.body.addEventListener('click', () => bgVideo.play(), { once: true });
      });
    }
  }


  // =========================================================================
  // 2. Ambient Sound Engine
  // Supports both custom audio files (MP3/WAV/etc.) and procedural ocean waves
  // =========================================================================
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundStateText = document.getElementById('sound-state-text');

  let isSoundPlaying = false;

  // Custom Audio File Instance (for soundType: 'file')
  let customAudio = null;

  // Procedural Web Audio Synth Instances (for soundType: 'generated')
  let audioCtx = null;
  let synthGainNode = null;

  function initProceduralOceanAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;

    audioCtx = new AudioContext();

    const bufferSize = audioCtx.sampleRate * 5;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const waveFilter = audioCtx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(300, audioCtx.currentTime);

    const lfoNode = audioCtx.createOscillator();
    lfoNode.type = 'sine';
    lfoNode.frequency.setValueAtTime(0.12, audioCtx.currentTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(220, audioCtx.currentTime);

    lfoNode.connect(lfoGain);
    lfoGain.connect(waveFilter.frequency);

    synthGainNode = audioCtx.createGain();
    synthGainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);

    whiteNoise.connect(waveFilter);
    waveFilter.connect(synthGainNode);
    synthGainNode.connect(audioCtx.destination);

    whiteNoise.start(0);
    lfoNode.start(0);
    return true;
  }

  function toggleSound() {
    if (BREAK_CONFIG.soundType === 'file') {
      // Custom Audio File Playback
      if (!customAudio) {
        customAudio = new Audio(BREAK_CONFIG.audioFilePath);
        customAudio.loop = true;
        customAudio.volume = BREAK_CONFIG.soundVolume;
      }

      if (customAudio.paused) {
        customAudio.play().then(() => {
          isSoundPlaying = true;
          soundBtn.classList.add('playing');
          soundStateText.textContent = 'Playing';
        }).catch((err) => {
          console.warn('Could not play audio file:', err);
          alert(`Could not load audio file at "${BREAK_CONFIG.audioFilePath}". Please check the filename in assets/.`);
        });
      } else {
        customAudio.pause();
        isSoundPlaying = false;
        soundBtn.classList.remove('playing');
        soundStateText.textContent = 'Off';
      }

    } else {
      // Procedural Ocean Synth Playback
      if (!audioCtx) {
        const initialized = initProceduralOceanAudio();
        if (!initialized) return;
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (!isSoundPlaying) {
        synthGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
        synthGainNode.gain.linearRampToValueAtTime(BREAK_CONFIG.soundVolume, audioCtx.currentTime + 1.5);
        isSoundPlaying = true;
        soundBtn.classList.add('playing');
        soundStateText.textContent = 'Waves';
      } else {
        synthGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
        synthGainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        setTimeout(() => {
          isSoundPlaying = false;
          soundBtn.classList.remove('playing');
          soundStateText.textContent = 'Off';
        }, 1200);
      }
    }
  }

  if (soundBtn) soundBtn.addEventListener('click', toggleSound);

});
