const puppeteer = require('puppeteer');
const fs = require('fs');
const sendMessage = require('./sendMessage');
require('dotenv').config();

// Helper function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Extracts account data and calculates totals for views, loves, and comments.
 */
const getViewsCount = async (accountUserName) => {
    let page;
    let totalViews = 0;
    let totalLoves = 0;
    let totalComments = 0;

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
        await page.goto(`https://www.instagram.com/${accountUserName}/reels/`);
        console.log(`Navigated to: https://www.instagram.com/${accountUserName}/reels/`);

        // Wait for the reels container to load
        await page.waitForSelector('div div div span span.html-span');

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

        // Extract all text content from the specified selector
        const textContents = await page.$$eval(
            'div div div span span.html-span',
            elements => elements.map(el => el.textContent.trim())
        );

        console.log('Extracted text contents:', textContents);

        // Parse the first three numbers (posts, followers, following)
        const posts = parseInt(textContents[0], 10);
        const followers = parseInt(textContents[1], 10);
        const following = parseInt(textContents[2], 10);

        // Parse the remaining numbers (views, loves, comments)
        for (let i = 3; i < textContents.length; i += 3) {
            const loves = parseInt(textContents[i], 10);
            const comments = parseInt(textContents[i + 1], 10);
            const views = parseInt(textContents[i + 2], 10);

            if (!isNaN(views)) totalViews += views;
            if (!isNaN(loves)) totalLoves += loves;
            if (!isNaN(comments)) totalComments += comments;
        }

        console.log('Account Data:', { posts, followers, following });
        console.log('Totals:', { totalViews, totalLoves, totalComments });

        // Send the formatted message to Telegram
        const message = `
📊 Account Data for https://www.instagram.com/${accountUserName}:
- Posts: ${posts}
- Followers: ${followers}
- Following: ${following}

📈 *Totals*:
- Total Views: ${totalViews}
- Total Loves: ${totalLoves}
- Total Comments: ${totalComments}
        `;

        await sendMessage(message); // Use the sendMessage module

        // await browser.close();
        return { posts, followers, following, totalViews, totalLoves, totalComments };
    } catch (error) {
        console.error('An error occurred:', error);

        // Send error message to Telegram
        const errorMessage = `An error occurred: ${error.message}`;
        await sendMessage(errorMessage); // Use the sendMessage module
    }
};

module.exports = getViewsCount;