const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to Instagram's login page
  await page.goto('https://www.instagram.com/accounts/login/');
  console.log('Navigated to Instagram login page.');
  await delay(3000); // Wait for 3 seconds

  // Wait for the login form to load
  await page.waitForSelector('input[name="username"]');
  console.log('Login form loaded.');
  await delay(2000); // Wait for 2 seconds

  // Enter username
  await page.type('input[name="username"]', process.env.INSTAGRAM_USERNAME);
  console.log('Username entered.');
  await delay(2000); // Wait for 2 seconds

  // Enter password
  await page.type('input[name="password"]', process.env.INSTAGRAM_PASSWORD);
  console.log('Password entered.');
  await delay(2000); // Wait for 2 seconds

  // Click the "Log in" button
  await page.click('button[type="submit"]');
  console.log('Clicked the "Log in" button.');
  await delay(3000); // Wait for 3 seconds

  // Wait for navigation to complete (login to finish)
  await page.waitForNavigation();
  console.log('Logged in successfully!');

  // Save cookies to a file
  const cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
  console.log('Cookies saved to cookies.json.');

  // Close the browser
  await browser.close();
  console.log('Browser closed.');
})();