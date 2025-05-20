import { loadData } from './utils/index.js';
import PharosBot from './bot.js';
import { config } from './config/index.js';

async function main() {
    const privateKeys = loadData('privateKeys.txt');
    
    if (privateKeys.length === 0) {
        console.error('No private keys found in privateKeys.txt');
        process.exit(1);
    }

    for (let i = 0; i < privateKeys.length; i++) {
        try {
            const bot = new PharosBot(privateKeys[i]);
            await bot.runAll();
            
            if (i < privateKeys.length - 1) {
                const delay = config.DELAY_BETWEEN_REQUESTS;
                console.log(`Waiting ${delay} seconds before next wallet...`);
                await new Promise(resolve => setTimeout(resolve, delay * 1000));
            }
        } catch (error) {
            console.error(`Error processing wallet #${i + 1}:`, error.message);
        }
    }
}

main().catch(console.error); 