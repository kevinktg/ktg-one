// Script to scroll and take screenshots every 1 second
// Run with: node scripts/scroll-screenshot.js

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Navigate to your local site
  const url = process.env.SITE_URL || 'http://localhost:3000';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  // Wait a bit for initial load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, '../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  // Get page height
  const totalHeight = await page.evaluate(() => {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
  });
  
  console.log(`Total page height: ${totalHeight}px`);
  console.log('Starting scroll and screenshot capture...');
  
  const viewportHeight = 1080;
  const scrollStep = 200; // Scroll 200px at a time
  const screenshotInterval = 1000; // 1 second between screenshots
  let scrollPosition = 0;
  let screenshotCount = 0;
  
  while (scrollPosition < totalHeight) {
    // Scroll to position
    await page.evaluate((pos) => {
      window.scrollTo(0, pos);
    }, scrollPosition);
    
    // Wait for scroll to settle
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Take screenshot
    const screenshotPath = path.join(screenshotsDir, `scroll-${String(screenshotCount).padStart(4, '0')}-${scrollPosition}px.png`);
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false // Just viewport
    });
    
    console.log(`Screenshot ${screenshotCount}: ${scrollPosition}px -> ${screenshotPath}`);
    
    // Increment
    scrollPosition += scrollStep;
    screenshotCount++;
    
    // Wait 1 second before next screenshot
    await new Promise(resolve => setTimeout(resolve, screenshotInterval));
  }
  
  // Final screenshot at bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(resolve => setTimeout(resolve, 100));
  const finalPath = path.join(screenshotsDir, `scroll-${String(screenshotCount).padStart(4, '0')}-FINAL.png`);
  await page.screenshot({ path: finalPath, fullPage: false });
  console.log(`Final screenshot: ${finalPath}`);
  
  console.log(`\nDone! Captured ${screenshotCount + 1} screenshots in ${screenshotsDir}`);
  
  await browser.close();
})();

