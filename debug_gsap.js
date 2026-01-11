const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Capture console
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });

    const gsapStatus = await page.evaluate(() => {
        return {
            gsap: typeof window.gsap !== 'undefined',
            ScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
            // GSAP 3 plugins are registered on the core
            registered: window.gsap && window.gsap.plugins ? window.gsap.plugins.map(p => p.name) : 'No plugins'
        };
    });
    console.log("GSAP Status:", gsapStatus);

  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
