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

  // Click the search icon to open the search bar
  const searchIconSelector = 'svg[aria-label="Search"]'; // Selector for the search icon
  await page.waitForSelector(searchIconSelector);
  await page.click(searchIconSelector);
  console.log('Clicked the search icon.');
  await delay(2000); // Wait for 2 seconds

  // Wait for the search input field to load
  await page.waitForSelector('input[aria-label="Search input"]');
  console.log('Search input field loaded.');
  await delay(2000); // Wait for 2 seconds

  // Type the search query into the search input field
  const searchQuery = 'Amir Alsayed'; // Replace with your search word
  await page.type('input[aria-label="Search input"]', searchQuery);
  console.log(`Typed search query: "${searchQuery}".`);
  await delay(2000); // Wait for 2 seconds

  // Press Enter to submit the search
  await page.keyboard.press('Enter');
  console.log('Pressed Enter to submit the search.');
  await delay(3000); // Wait for 3 seconds

  // Wait for search results to load
  try {
    await page.waitForSelector('div[role="dialog"]', { timeout: 5000 }); // Example selector for search results
    console.log('Search results loaded.');
  } catch (error) {
    console.log('Failed to load search results.');
  }

  // Optional: Take a screenshot of the search results
  await page.screenshot({ path: 'instagram_search_results.png' });
  console.log('Screenshot of search results taken.');
  await delay(2000); // Wait for 2 seconds

  // Close the browser
//   await browser.close();
  console.log('Browser closed.');
})();