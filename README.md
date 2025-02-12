# Pump-Fun Sniper Bot

This repository contains the codebase for the Pump-Fun Sniper Bot developed by [Official Website](https://sniperbotpump.fun) . Although this project is archived and not intended for further iteration, this README provides a comprehensive overview to help anyone who may want to understand or run the bot.

## Overview

The Pump-Fun Sniper Bot is designed to interact with the Solana blockchain, purchasing newly minted coins and managing them, based on our replication of orcACR...'s strategy. I detail the strategy more in my first blog post on this project, which can be found [here](https://sniperbotpump.fun/docs.html).

## Features
- **Take Profit (%):** Automatically sell tokens when a set profit percentage is reached.
- **Stop Loss (%):** Minimize losses by automatically selling at a specified loss percentage.
- **Timeout Functionality:** Sell tokens if neither take profit nor stop loss conditions are met within a set time.
- **Metadata Validation:** Filters to check for valid URLs (e.g., Telegram, Twitter, Website).
- **Snipe Tag:** Filters to check name in METADATA and only buys the valid ones.
- **BloXroute TIPs:** Leverage TIPs for faster transaction processing.
- **No RPC Required:** Simplified setup without the need for an RPC server.

## Requirements
Ensure you have the latest version of Node.js installed. Download Node.js from [here](https://nodejs.org/en/download)

### Installation
1. Download and unzip the PumpFun Sniper Bot source code.
2. Open the folder in Visual Studio Code or your terminal.
3. Run the installation command:

  ```go
  npm install
  ```

## Configurations
After installation, configure your .env file with the required settings:

<table>
  <tr>
    <th> Key  </th>
    <th> Description</th>
  </tr>
  <tr>
    <td>PRIVATE_KEY </td>
    <td> Your wallet's private key in base58 format (e.g., Phantom wallet private key).</td>
   
  </tr>
  <tr>
 <td>WALLET </td>
       <td> The public key of your wallet.</td>
   
  </tr>
    <tr>
 <td>AMOUNT </td>
       <td> The amount (in SOL) to spend on each token.</td>
   
  </tr>
    <tr>
 <td> SLIPPAGE </td>
       <td> Slippage tolerance (e.g., 10 for 10%).</td>
   
  </tr>
    <tr>
 <td>PROTECTION  </td>
       <td>Set to true for MEV protection or false for maximum speed.</td>
   
  </tr>
   <tr>
 <td>BUY_TIP </td>
       <td>BloXroute TIP for buy transactions (in SOL).</td>
   
  </tr>
   <tr>
 <td> SELL_TIP  </td>
       <td>BloXroute TIP for sell transactions (in SOL).</td>
   
  </tr>
   <tr>
 <td> TAKE_PROFIT  </td>
       <td> Profit-taking percentage (e.g., 10 for 10%).</td>
   
  </tr>
   <tr>
 <td>STOP_LOSS   </td>
       <td>Stop-loss percentage (e.g., 10 for 10%).</td>
   
  </tr>
   <tr>
 <td> TIMEOUT	 </td>
       <td> Timeout value (in minutes) for automatic sell if no stop loss or take profit is triggered.</td>
   
  </tr>

   <tr>
 <td> CHECK_URLS   </td>
       <td>Set to true to validate token metadata (Telegram, Twitter, Website URLs), or false to skip validation.</td>
   
  </tr>
  <tr>
 <td> TIMEOUT	 </td>
       <td> Timeout value (in minutes) for automatic sell if no stop loss or take profit is triggered.</td>
   
  </tr>   

  <tr>
 <td> SNIPE_BY_TAG </td>
       <td>  Set A value to snipe only the tokens with that name in token name metadata empty if you don't need this feature.</td>
   
  </tr>   
  
</table>

## Start the Bot
After setting up your .env file, start the bot with the following command:

```go
npm start
```
## How It Works
The bot continuously monitors PumpFun for new token mints. Upon detecting a new token, it:

- **Buys the token based** on your configurations.
- **Saves transaction data in** list.json.
- **Monitors the token for**:
Take profit conditions.
Stop loss conditions.
- **Timeout conditions.**
Updates list.json with the status of each bought token.
## Additional Information

- **Solana RPC and WebSocket**: Ensure you are using high-performance RPC and WebSocket URLs for optimal performance.
- **Best sniper trade tip**: Make sure you have minimum 1-5 SOL to snipe the tokens.
- **Jito Integration**: Optional integration for improved transaction handling.



## Learn More

Read more about the development of this project on my [docs](https://sniperbotpump.fun/docs.html).
