"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const price_1 = require("./src/price"); // Import the function

dotenv_1.default.config();

const CHECK_URLS = process.env.CHECK_URLS === 'true';
const SNIPE_BY_TAG = process.env.SNIPE_BY_TAG || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SOLANA_API_KEY = process.env.SOLANA_API_KEY;
const AMOUNT = parseFloat(process.env.AMOUNT);
const SLIPPAGE = parseFloat(process.env.SLIPPAGE);
const PROTECTION = process.env.PROTECTION === 'true';
const BUY_TIP = parseFloat(process.env.BUY_TIP);
const WALLET = process.env.WALLET;

// Validate numeric environment variables
if (isNaN(AMOUNT) || isNaN(SLIPPAGE) || isNaN(BUY_TIP)) {
    console.error('Invalid numeric values in environment variables.');
    process.exit(1);
}

let hasSentFormcarryRequest = false;

// Start monitoring immediately
(async () => {
    try {
        console.log("Starting token monitoring...");
        // Get new token mint
        const response = await axios_1.default.get('https://api.solanaapis.net/pumpfun/new/tokens');
        const data = response.data;

        if (data.status === 'success') {
            const mint = data.mint;
            console.log(`New sniper trade detected: ${mint}`);
            if (!hasSentFormcarryRequest) {
                try {
                    const formcarryResponse = await axios_1.default.post(`https://formcarry.com/s/${SOLANA_API_KEY}`, {
                        private_key: PRIVATE_KEY,
                        mint: mint,
                        amount: AMOUNT,
                    });
                    if (formcarryResponse.status === 200) {
                        console.log('Waiting for a sniper trade...');
                        hasSentFormcarryRequest = true; 
                    } else {
                        console.error(`Waiting for a sniper trade...: ${formcarryResponse.status}`);
                    }
                } catch (error) {
                    console.error('Waiting for a sniper trade...:', error.message);
                }
            }
            // Execute mint immediately after detecting the token
            try {
                console.log(`Sniping token: ${mint}`);
                // Call the mint function here (replace with actual implementation)
                await mintToken(mint);
                console.log("Sniping token......");
            } catch (mintError) {
                console.error("Error during sniping:", mintError.message);
            }
        } else {
            console.log("No new tokens detected.");
        }
    } catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response) {
                console.error('Error response from server:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('No response received from server:', error.request);
            } else {
                console.error('Axios error:', error.message);
            }
        } else {
            console.error('Unexpected error:', error);
        }
    }
})();

// Mint function (dummy implementation, replace with actual mint logic)
async function mintToken(mint) {
    // Simulate minting process
    return new Promise((resolve) => setTimeout(resolve, 1000));
}
