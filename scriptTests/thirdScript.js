const puppeteer = require('puppeteer');
const fs = require('fs');

// Helper function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Load cookies from the file
  if (fs.existsSync('cookies.json')) {
    const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
    await page.setCookie(...cookies);
    console.log('Cookies loaded from cookies.json.');
  } else {
    console.log('No cookies found. Please log in first.');
    return;
  }

  // Navigate to Instagram's homepage
  await page.goto('https://www.instagram.com/');
  console.log('Navigated to Instagram homepage.');
  await delay(3000); // Wait for 3 seconds

  // Check if logged in by looking for a logged-in element (e.g., the Stories section)
  try {
    await page.waitForSelector('div[role="button"]', { timeout: 5000 }); // Example selector
    console.log('Logged in successfully using cookies!');
  } catch (error) {
    console.log('Failed to log in using cookies. Please log in again.');
  }

  // Optional: Take a screenshot of the homepage
  await page.screenshot({ path: 'instagram_homepage_cookies.png' });
  console.log('Screenshot taken.');
  await delay(2000); // Wait for 2 seconds

  // Close the browser
  await browser.close();
  console.log('Browser closed.');
})();