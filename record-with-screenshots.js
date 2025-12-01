// This script would be used with Chrome DevTools MCP
// Scrolls page and takes screenshots every second, back and forth

// For use in Chrome DevTools console or via MCP evaluate_script

(function() {
  let screenshotIndex = 0;
  const screenshots = [];
  
  async function scrollAndCapture() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDuration = 10000; // 10 seconds each direction
    
    // Scroll down
    console.log('Scrolling down...');
    await smoothScroll(0, totalHeight, scrollDuration, true);
    
    // Wait 1 second
    await new Promise(r => setTimeout(r, 1000));
    
    // Scroll back up
    console.log('Scrolling back up...');
    await smoothScroll(totalHeight, 0, scrollDuration, false);
    
    console.log('Done! Captured', screenshots.length, 'positions');
    return screenshots;
  }
  
  function smoothScroll(start, end, duration, isDown) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let lastScreenshot = 0;
      
      function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeInOut = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const currentScroll = start + (end - start) * easeInOut;
        window.scrollTo(0, currentScroll);
        
        // Log every second for screenshot timing
        if (elapsed - lastScreenshot >= 1000) {
          lastScreenshot = elapsed;
          screenshotIndex++;
          screenshots.push({
            index: screenshotIndex,
            time: Math.floor(elapsed / 1000),
            scrollY: Math.round(currentScroll),
            progress: (currentScroll / totalHeight * 100).toFixed(1) + '%',
            direction: isDown ? 'down' : 'up'
          });
          console.log(`[${isDown ? 'DOWN' : 'UP'}] ${screenshotIndex}s: scrollY=${Math.round(currentScroll)}, progress=${(currentScroll / totalHeight * 100).toFixed(1)}%`);
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
  
  // Auto-run
  scrollAndCapture().then(result => {
    console.log('Scroll complete!', result);
  });
})();

