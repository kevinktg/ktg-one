const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 800 });

  // Capture console
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  try {
    console.log("Navigating...");
    await new Promise(r => setTimeout(r, 5000)); // Wait for server
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 60000 });

    const height = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Body Height: ${height}px`);

    const expertise = await page.evaluate(() => {
        const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('expertise_matrix'));
        if (!h2) return "Heading NOT FOUND";
        const section = h2.closest('section');
        if (!section) return "Section NOT FOUND";
        const style = window.getComputedStyle(section);
        const rect = section.getBoundingClientRect();
        return {
            tagName: section.tagName,
            rect: { width: rect.width, height: rect.height, y: rect.y },
            style: { opacity: style.opacity, display: style.display, visibility: style.visibility, position: style.position }
        };
    });
    console.log("Expertise:", expertise);

    const validation = await page.evaluate(() => {
        const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('Subjective portfolios'));
        if (!h3) return "Heading NOT FOUND";
        const section = h3.closest('section');
        const rect = section.getBoundingClientRect();
        return {
             rect: { width: rect.width, height: rect.height, y: rect.y }
        };
    });
    console.log("Validation:", validation);

  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
