const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 800 });

  try {
    console.log("Navigating...");
    // Give Next.js some time to compile
    await new Promise(r => setTimeout(r, 10000));

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 60000 });
    console.log("Page loaded");

    // Find Philosophy Section
    // The heading contains "synthesis"
    const section = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h2'));
        const target = headings.find(h => h.textContent.includes('synthesis'));
        if (target) {
            target.scrollIntoView();
            return true;
        }
        return false;
    });

    if (section) {
        console.log("Scrolled to Philosophy. Waiting for animation...");
        await new Promise(r => setTimeout(r, 3000)); // Wait for GSAP
        await page.screenshot({ path: 'verification_philosophy.png', fullPage: false });
        console.log("Screenshot saved.");
    } else {
        console.log("Philosophy section not found.");
        // Take a screenshot anyway to see where we are
        await page.screenshot({ path: 'verification_failed.png' });
    }

  } catch (e) {
    console.error("Error:", e);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
