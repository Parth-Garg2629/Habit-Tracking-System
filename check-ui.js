const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`BROWSER ${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.log(`BROWSER PAGE ERROR: ${err.toString()}`);
  });

  console.log('Navigating to http://localhost:3001/dashboard...');
  await page.goto('http://localhost:3001/dashboard', { waitUntil: 'networkidle0' });
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'screenshot.png' });
  
  console.log('Done.');
  await browser.close();
})();
