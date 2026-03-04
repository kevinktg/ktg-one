# Quick Screenshot Method

## Option 1: Chrome DevTools (Easiest)

1. Open Chrome DevTools (F12)
2. Go to **Console** tab
3. Paste and run this code:

```javascript
// Scroll and screenshot every 1 second
let scrollPos = 0;
let count = 0;
const interval = setInterval(() => {
  window.scrollTo(0, scrollPos);
  setTimeout(() => {
    // Take screenshot manually or use Chrome's screenshot tool
    console.log(`Scroll position: ${scrollPos}px - Take screenshot ${count}`);
    scrollPos += 200; // Scroll 200px each time
    count++;
    
    if (scrollPos > document.body.scrollHeight) {
      clearInterval(interval);
      console.log('Done!');
    }
  }, 100);
}, 1000);
```

4. Use Chrome's built-in screenshot:
   - Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
   - Type "screenshot" and select "Capture screenshot" or "Capture node screenshot"

## Option 2: Install Puppeteer and Run Script

```bash
npm install --save-dev puppeteer
node scripts/scroll-screenshot.js
```

## Option 3: Browser Extension

Install "Full Page Screen Capture" or similar Chrome extension that can auto-scroll and capture.

