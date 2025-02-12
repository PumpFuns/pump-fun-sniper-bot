"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUrls = void 0;
const axios_1 = __importDefault(require("axios"));
async function checkUrls(metadataUrl) {
    try {
        const response = await axios_1.default.get(metadataUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json, text/plain, */*',
            },
        });
        const data = response.data;
        const isValidUrl = (url) => {
            try {
                new URL(url);
                return true;
            }
            catch (_) {
                return false;
            }
        };
        const hasTwitter = data.twitter && typeof data.twitter === 'string' && data.twitter.trim().length > 0 && isValidUrl(data.twitter);
        const hasTelegram = data.telegram && typeof data.telegram === 'string' && data.telegram.trim().length > 0 && isValidUrl(data.telegram);
        const hasWebsite = data.website && typeof data.website === 'string' && data.website.trim().length > 0 && isValidUrl(data.website);
        if (!hasTwitter) {
            //console.log('Twitter URL missing or invalid in metadata');
        }
        if (!hasTelegram) {
            //console.log('Telegram URL missing or invalid in metadata');
        }
        if (!hasWebsite) {
            //console.log('Website URL missing or invalid in metadata');
        }
        return hasTwitter && hasTelegram && hasWebsite;
    }
    catch (error) {
        console.error('Error in checkUrls:', error.message);
        return false;
    }
}
exports.checkUrls = checkUrls;
