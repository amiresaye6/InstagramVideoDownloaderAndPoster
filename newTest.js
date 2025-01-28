const schedule = require('node-schedule');
const axios = require('axios');
require('dotenv').config();

// Configuration
const INTERVAL_MINUTES = 2;
let messageCount = 0;

/**
 * Sends a message to Telegram using the bot API.
 * @param {string} message - The message to send.
 */
async function sendMessage(message) {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    try {
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: message,
        });
        console.log('Message sent to Telegram:', message);
    } catch (error) {
        console.error('Failed to send message to Telegram:', error.message);
    }
}

function scheduleMessages() {
    // Schedule to run every 2 minutes
    const job = schedule.scheduleJob('*/2 * * * *', async () => {
        messageCount++;
        const timestamp = new Date().toLocaleString();
        const message = `🔔 Scheduled Message #${messageCount}\n⏰ Time: ${timestamp}`;
        
        try {
            await sendMessage(message);
        } catch (error) {
            console.error('Error in scheduled task:', error);
        }
    });

    // Send initial message
    sendMessage('🚀 Telegram message scheduler started!\nWill send messages every 2 minutes.');
    
    console.log('Message scheduler started. Will send messages every 2 minutes.');

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
        await sendMessage('⚠️ Bot is shutting down...');
        job.cancel();
        process.exit(0);
    });

    // Handle errors
    process.on('uncaughtException', async (error) => {
        await sendMessage(`❌ Error occurred: ${error.message}`);
        console.error('Uncaught error:', error);
    });
}

// Start the scheduler
scheduleMessages();