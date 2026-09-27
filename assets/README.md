# "break." — Configuration Guide

This landing page runs entirely with **local assets** (no external video dependencies) and includes a placeholder for **Google Analytics (GA4)**.

---

## 📊 1. Google Analytics (GA4) Setup

Open [index.html](file:///Users/vinhloichau/Documents/antigravity/break/index.html). Lines 14 and 19 contain the placeholder:

```html
<!-- Google Analytics (GA4) Placeholder -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX');
</script>
```

👉 Simply replace **`G-XXXXXXXXXX`** in both lines with your actual Google Analytics Measurement ID.

---

## 🎬 2. Local Background Video

The video background plays directly from your local files:

### How to use your own video:
1. Place your `.mp4` or `.webm` video file in the `assets/` directory (e.g. `assets/video.mp4`).
2. Open [script.js](file:///Users/vinhloichau/Documents/antigravity/break/script.js) and check `BREAK_CONFIG`:
   ```javascript
   const BREAK_CONFIG = {
     localVideoPath: 'assets/video.mp4', // Point to your file
     overlayDarkness: 0.42,             // Adjust tint (0.20 to 0.70)
     ...
   };
   ```
3. Save and refresh the page.

*(A sample calming ocean wave video `assets/video.webm` is already provided and active by default).*

---

## 🎵 3. Ambient Sound Settings

In [script.js](file:///Users/vinhloichau/Documents/antigravity/break/script.js):

- **Option A: Use built-in ocean waves (default)**:
  `soundType: 'generated'`
  (Generates realistic, soothing ocean surf using Web Audio API without needing any audio file).

- **Option B: Use your own audio file (MP3/WAV)**:
  1. Put your audio file in `assets/` (e.g. `assets/ambient.mp3`).
  2. Set:
     ```javascript
     soundType: 'file',
     audioFilePath: 'assets/ambient.mp3',
     soundVolume: 0.35
     ```
