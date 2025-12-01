// Scroll and screenshot script for Chrome DevTools
// This will scroll slowly, take screenshots every second, then scroll back

async function scrollAndScreenshot() {
  const screenshots = [];
  const scrollDuration = 10000; // 10 seconds to scroll down
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const startTime = Date.now();
  let lastScreenshot = 0;
  
  // Function to take screenshot (will be called from Chrome DevTools)
  function takeScreenshot() {
    const timestamp = Date.now();
    screenshots.push({
      time: timestamp,
      scrollY: window.scrollY,
      progress: window.scrollY / totalHeight
    });
    console.log(`Screenshot at ${timestamp}, scrollY: ${window.scrollY.toFixed(0)}, progress: ${(window.scrollY / totalHeight * 100).toFixed(1)}%`);
  }
  
  // Smooth scroll down
  function scrollDown() {
    return new Promise((resolve) => {
      const startScroll = 0;
      const endScroll = totalHeight;
      const startTime = Date.now();
      
      function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        const easeInOut = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        window.scrollTo(0, startScroll + (endScroll * easeInOut));
        
        // Take screenshot every second
        if (elapsed - lastScreenshot >= 1000) {
          takeScreenshot();
          lastScreenshot = elapsed;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }
      
      animate();
    });
  }
  
  // Smooth scroll back up
  function scrollUp() {
    return new Promise((resolve) => {
      const startScroll = totalHeight;
      const endScroll = 0;
      const startTime = Date.now();
      
      function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        const easeInOut = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        window.scrollTo(0, startScroll - (startScroll * easeInOut));
        
        // Take screenshot every second
        if (elapsed - lastScreenshot >= 1000) {
          takeScreenshot();
          lastScreenshot = elapsed;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }
      
      animate();
    });
  }
  
  // Run the sequence
  console.log('Starting scroll down...');
  await scrollDown();
  console.log('Scrolled to bottom, scrolling back up...');
  await scrollUp();
  console.log('Done! Total screenshots:', screenshots.length);
  
  return screenshots;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = scrollAndScreenshot;
} else {
  window.scrollAndScreenshot = scrollAndScreenshot;
}

// Auto-run if in browser console
scrollAndScreenshot();

