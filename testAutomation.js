const schedule = require('node-schedule');
const fs = require('fs').promises;
const path = require('path');
const { downloader } = require("./instagramVideoDownloader");
const { postVideo } = require("./postVideo");
const { getUrls } = require("./reelsUrlsExtractor");
const getViewsCount = require("./viewsCount");
const sendMessage = require('./sendMessage');
require('dotenv').config();

// Configuration
const INTERVAL_HOURS = 6; // Run every 6 hours
const REELS_FILE = 'reelsUrls.json';
let currentIndex = 0;

// Extract username from URL
function extractUsername(url) {
    const match = url.match(/instagram\.com\/([^\/]+)/);
    return match ? match[1] : null;
}

async function readReelsFile() {
    try {
        const data = await fs.readFile(REELS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        await sendMessage(`Error reading reels file: ${error.message}`);
        throw error;
    }
}

async function updateReelsFile(reels) {
    try {
        await fs.writeFile(REELS_FILE, JSON.stringify(reels, null, 2));
    } catch (error) {
        await sendMessage(`Error updating reels file: ${error.message}`);
        throw error;
    }
}

async function processNextReel() {
    try {
        // Read the current list of reels
        const reels = await readReelsFile();
        
        if (reels.length === 0) {
            await sendMessage("⚠️ No more reels to process. Please add more URLs to reels.json");
            return;
        }

        // Get the next reel URL
        if (currentIndex >= reels.length) {
            currentIndex = 0; // Reset to start if we've reached the end
            await sendMessage("🔄 Completed one full cycle of all reels, starting again from beginning");
        }
        
        const reelUrl = reels[currentIndex];
        const username = extractUsername(reelUrl);
        
        await sendMessage(`🎬 Starting to process reel ${currentIndex + 1}/${reels.length}\nUser: ${username}\nURL: ${reelUrl}`);

        // Download the reel
        const metaData = await downloader(reelUrl);
        await sendMessage(`✅ Downloaded reel from ${username}`);

        // Post the video
        await postVideo(metaData.fileName, username);
        await sendMessage(`✅ Posted video successfully\nFile: ${metaData.fileName}\nUser: ${username}`);

        // Get views count for the account (only once every 4 posts to avoid too many requests)
        if (currentIndex % 4 === 0) {
            try {
                const views = await getViewsCount(username);
                await sendMessage(`📊 Current views for ${username}: ${views}`);
            } catch (error) {
                await sendMessage(`⚠️ Could not get views count: ${error.message}`);
            }
        }

        // Update index for next run
        currentIndex++;
        
        // Store current index in a file to resume from same position after restart
        await fs.writeFile('current_index.txt', currentIndex.toString());
        
        await sendMessage(`✅ Successfully processed reel ${currentIndex}/${reels.length}`);

    } catch (error) {
        await sendMessage(`❌ Error processing reel:\nError: ${error.message}\nURL: ${reels[currentIndex]}`);
        console.error('Error in processNextReel:', error);
        
        // Move to next reel even if current one fails
        currentIndex++;
        await fs.writeFile('current_index.txt', currentIndex.toString());
    }
}

async function initializeScheduler() {
    // Try to read the last processed index
    try {
        const savedIndex = await fs.readFile('current_index.txt', 'utf8');
        currentIndex = parseInt(savedIndex) || 0;
        await sendMessage(`🔄 Resuming from reel index: ${currentIndex}`);
    } catch (error) {
        currentIndex = 0;
    }

    // Create a rule that runs every INTERVAL_HOURS
    const rule = new schedule.RecurrenceRule();
    rule.hour = new schedule.Range(0, 23, INTERVAL_HOURS);
    rule.minute = 0;
    
    // Schedule the job
    const job = schedule.scheduleJob(rule, async () => {
        await sendMessage(`🕐 Starting scheduled task at ${new Date().toISOString()}`);
        await processNextReel();
    });

    // Run immediately on startup
    await sendMessage(`🚀 Bot started! Will process reels every ${INTERVAL_HOURS} hours`);
    await processNextReel();
    
    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
        await sendMessage('⚠️ Bot is shutting down...');
        job.cancel();
        process.exit(0);
    });

    // Handle errors
    process.on('uncaughtException', async (error) => {
        await sendMessage(`❌ Uncaught error: ${error.message}`);
        console.error('Uncaught error:', error);
    });
}

// Start the scheduler
initializeScheduler().catch(console.error);