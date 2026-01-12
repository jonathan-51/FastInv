const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * Take a screenshot of any page in the application
 * Usage: node take-screenshot.js login
 * Usage: node take-screenshot.js jobs
 * Usage: node take-screenshot.js (defaults to home)
 */

(async () => {
  // Get the route name from command line args (without leading slash)
  let routeName = process.argv[2] || 'home';

  // Remove any leading slashes if provided
  routeName = routeName.replace(/^\/+/, '');

  // Convert to URL path
  const route = routeName === 'home' || routeName === '' ? '/' : `/${routeName}`;
  const baseUrl = 'http://localhost:3000';
  const fullUrl = `${baseUrl}${route}`;

  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Generate filename
  const filename = routeName === 'home' || routeName === '' ? 'home' : routeName.replace(/\//g, '-');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const screenshotPath = path.join(screenshotsDir, `${filename}-${timestamp}.png`);

  console.log(`Taking screenshot of ${fullUrl}...`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the page
    await page.goto(fullUrl, { waitUntil: 'networkidle' });

    // Take screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`✓ Screenshot saved: ${screenshotPath}`);
  } catch (error) {
    console.error(`✗ Error taking screenshot: ${error.message}`);
  } finally {
    await browser.close();
  }
})();
