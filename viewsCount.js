const puppeteer = require('puppeteer');
const fs = require('fs');
const sendMessage = require('./sendMessage');
require('dotenv').config();

// Helper function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Counts the total views from Instagram reels and sends the result to Telegram.
 */
const getViewsCount = async (baseUrl = 'https://www.instagram.com/fadhakkir_quran/reels/') => {
    let page;
    let totalViews = 0;

    try {
        // Launch the browser
        const browser = await puppeteer.launch({ headless: true }); // Set headless to false if you want to see the web page.
        page = await browser.newPage();

        // Load cookies from the file
        if (fs.existsSync('cookies.json')) {
            const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
            await page.setCookie(...cookies);
            console.log('Cookies loaded from cookies.json.');
        } else {
            console.log('No cookies found. Please log in first.');
            return;
        }

        // Navigate to the reels page
        await page.goto(baseUrl);
        await page.waitForSelector('div._aajy'); // Wait for the reels container to load

        let previousHeight;
        let hasMoreReels = true;

        // Scroll until no more reels are loaded
        while (hasMoreReels) {
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await delay(2000); // Wait for new reels to load

            const newHeight = await page.evaluate('document.body.scrollHeight');
            if (newHeight === previousHeight) {
                hasMoreReels = false; // No more reels to load
            }
        }

        // Extract all view counts
        const viewCounts = await page.$$eval(
            'div._aajy span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs',
            elements => elements.map(el => {
                const text = el.textContent.trim();
                return parseInt(text.replace(/,/g, ''), 10); // Remove commas and convert to number
            })
        );

        // Calculate the total views
        totalViews = viewCounts.reduce((sum, views) => sum + views, 0);

        console.log('Total views count:', totalViews);

        // Send the total views count to Telegram
        const message = `Total views count: ${totalViews}`;
        await sendMessage(message); // Use the sendMessage module

        await browser.close();
    } catch (error) {
        console.error('An error occurred:', error);

        // Send error message to Telegram
        const errorMessage = `An error occurred: ${error.message}`;
        await sendMessage(errorMessage); // Use the sendMessage module
    }
};

module.exports = getViewsCount;