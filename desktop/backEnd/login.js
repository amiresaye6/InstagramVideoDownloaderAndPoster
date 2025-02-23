const puppeteer = require('puppeteer');
const fs = require('fs');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const login = async (userName, password) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.instagram.com/accounts/login/');
        console.log('Navigated to Instagram login page.');
        await delay(3000);

        await page.waitForSelector('input[name="username"]');
        console.log('Login form loaded.');
        await delay(2000);

        await page.type('input[name="username"]', userName);
        console.log('Username entered.');
        await delay(2000);

        await page.type('input[name="password"]', password);
        console.log('Password entered.');
        await delay(2000);

        await page.click('button[type="submit"]');
        console.log('Clicked the "Log in" button.');
        await delay(3000);

        await page.waitForNavigation();
        console.log('Logged in successfully!');

        const cookies = await page.cookies();
        fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
        console.log('Cookies saved to cookies.json.');

        await browser.close();
        console.log('Browser closed.');
        return true;
    } catch (error) {
        console.error('Login failed:', error);
        await browser.close();
        throw error;
    }
};

module.exports = login;