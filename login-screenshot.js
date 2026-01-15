const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeLoginScreenshot() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/login', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Filling in login credentials...');
    // Wait for email input and type
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
    await page.type('input[type="email"], input[name="email"]', 'admin@gmail.com');

    // Wait for password input and type
    await page.waitForSelector('input[type="password"], input[name="password"]', { timeout: 10000 });
    await page.type('input[type="password"], input[name="password"]', 'adminadmin');

    console.log('Clicking sign in button...');
    // Click the sign in button
    await page.click('button[type="submit"]');

    console.log('Waiting for navigation to jobs page...');
    // Wait for navigation to complete
    await page.waitForNavigation({ 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Additional wait to ensure page is fully rendered using Promise
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Ensure screenshots directory exists
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const screenshotPath = path.join(screenshotsDir, 'jobs-logged-in.png');
    console.log('Taking screenshot...');
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });

    console.log(`Screenshot saved to: ${screenshotPath}`);
    console.log('Current URL:', page.url());

  } catch (error) {
    console.error('Error during screenshot process:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

takeLoginScreenshot()
  .then(() => {
    console.log('Screenshot completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to take screenshot:', error);
    process.exit(1);
  });
