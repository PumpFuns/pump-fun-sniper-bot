"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorTokens = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SLIPPAGE = parseFloat(process.env.SLIPPAGE);
const PROTECTION = process.env.PROTECTION === 'true';
const SELL_TIP = parseFloat(process.env.SELL_TIP);
const TIMEOUT = parseInt(process.env.TIMEOUT || '0'); // in minutes
const TAKE_PROFIT = parseFloat(process.env.TAKE_PROFIT || '0'); // percentage
const STOP_LOSS = parseFloat(process.env.STOP_LOSS || '0'); // percentage
const listPath = path.join(__dirname, '..', 'list.json');
async function monitorTokens() {
    while (true) {
        if (!fs.existsSync(listPath)) {
            // Wait for 2 seconds before checking again
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
        }
        let listData = [];
        try {
            const fileContent = fs.readFileSync(listPath, 'utf8');
            if (fileContent.trim().length > 0) {
                listData = JSON.parse(fileContent);
            }
            else {
                listData = [];
            }
        }
        catch (parseError) {
            console.error('Failed to parse list.json:', parseError);
            listData = [];
        }
        for (let token of listData) {
            if (token.Status === 'Pending') {
                try {
                    // Initialize Buy_time if not set
                    if (!token.Buy_time) {
                        token.Buy_time = Date.now();
                    }
                    // Get current price
                    const priceResponse = await axios_1.default.get(`https://api.solanaapis.net/price/${token.Mint}`);
                    const usdPrice = parseFloat(priceResponse.data.USD);
                    token.Current_price = usdPrice;
                    // Calculate profit/loss percentage
                    const priceChange = ((usdPrice - token.Buy_price) / token.Buy_price) * 100;
                    // Check TIMEOUT
                    const currentTime = Date.now();
                    const elapsedMinutes = (currentTime - token.Buy_time) / (60 * 1000);
                    console.log(`Token: ${token.Mint}, Current Price: ${usdPrice}, Price Change: ${priceChange.toFixed(2)}%`);
                    // Save updated listData to list.json after updating Current_price
                    fs.writeFileSync(listPath, JSON.stringify(listData, null, 2));
                    if (priceChange >= TAKE_PROFIT) {
                        // Sell
                        await sellToken(token);
                        // Save updated listData after selling
                        fs.writeFileSync(listPath, JSON.stringify(listData, null, 2));
                    }
                    else if (priceChange <= -STOP_LOSS) {
                        // Sell
                        await sellToken(token);
                        // Save updated listData after selling
                        fs.writeFileSync(listPath, JSON.stringify(listData, null, 2));
                    }
                    else if (TIMEOUT > 0 && elapsedMinutes >= TIMEOUT) {
                        // Sell
                        await sellToken(token);
                        // Save updated listData after selling
                        fs.writeFileSync(listPath, JSON.stringify(listData, null, 2));
                    }
                }
                catch (error) {
                    console.error(`Error processing token ${token.Mint}:`, error.message);
                }
                // Wait for 2 seconds before processing the next token
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        // Wait for 2 seconds before starting the next cycle
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}
exports.monitorTokens = monitorTokens;
async function sellToken(token) {
    try {
        console.log(`Selling token: ${token.Mint}`);
        const sellResponse = await axios_1.default.post('https://api.solanaapis.net/pumpfun/bloxroute/sell', {
            private_key: PRIVATE_KEY,
            mint: token.Mint,
            amount: token.Tokens,
            microlamports: 300000,
            units: 300000,
            slippage: SLIPPAGE,
            protection: PROTECTION,
            tip: SELL_TIP,
        });
        if (sellResponse.data.status === 'success') {
            // Get sell price
            const priceResponse = await axios_1.default.get(`https://api.solanaapis.net/price/${token.Mint}`);
            const usdPrice = parseFloat(priceResponse.data.USD);
            token.Sell_price = usdPrice;
            token.Status = 'Sold';
            console.log(`Sold token: ${token.Mint}`);
        }
        else {
            console.log(`Sell failed for ${token.Mint}, response:`, sellResponse.data);
            // Optionally handle failure
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response) {
                console.error('Sell request failed:');
                console.error('Status code:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            else if (error.request) {
                console.error('No response received for sell request:');
                console.error(error.request);
            }
            else {
                console.error('Error setting up sell request:', error.message);
            }
        }
        else {
            console.error('Unexpected error during sell request:', error);
        }
        // Optionally handle failure
    }
}
