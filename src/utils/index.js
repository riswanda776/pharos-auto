import { ethers } from 'ethers';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Constants
export const EXPLORER = "https://testnet.pharosscan.xyz/tx/";
export const CHAIN_ID = 688688;

// Utility functions
export function print(message, type = "info") {
    const colors = {
        info: "\x1b[36m", // Cyan
        success: "\x1b[32m", // Green
        error: "\x1b[31m", // Red
        warning: "\x1b[33m" // Yellow
    };
    const reset = "\x1b[0m";
    console.log(`${colors[type]}${message}${reset}`);
}

export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomWait(min, max) {
    const delay = randomNumber(min, max);
    return new Promise(resolve => setTimeout(resolve, delay * 1000));
}

export function displayBanner() {
    const banner = `
    ╔═══════════════════════════════════════════════════════════════╗
    ║                                                               ║
    ║                     PHAROS BOT                                ║
    ║                                                               ║
    ║                Automated Task Runner                          ║
    ║                                                               ║
    ╚═══════════════════════════════════════════════════════════════╝
    `;
    console.log(banner);
}

export function loadData(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'));
    } catch (error) {
        print(`Error reading file ${filePath}: ${error.message}`, "error");
        return [];
    }
}

export const saveJson = async (name, data, file) => {
    let all = {};
    try {
        const content = await fs.readFile(file, 'utf-8');
        all = JSON.parse(content);
    } catch {}
    
    all[name] = data;
    await fs.writeFile(file, JSON.stringify(all, null, 2));
};

export const loadEnv = async (path = '.env') => {
    const config = {};
    try {
        const content = await fs.readFile(path, 'utf-8');
        const lines = content.split('\n');
        
        for (const line of lines) {
            if (line.startsWith('#') || !line.includes('=')) continue;
            
            const [key, value] = line.split('=').map(s => s.trim());
            const cleanValue = value.replace(/^["']|["']$/g, '');
            
            if (cleanValue.toLowerCase() === 'true' || cleanValue.toLowerCase() === 'false') {
                config[key] = cleanValue.toLowerCase() === 'true';
            } else if (cleanValue.startsWith('[') && cleanValue.endsWith(']')) {
                try {
                    config[key] = JSON.parse(cleanValue.replace(/'/g, '"'));
                } catch {
                    config[key] = [];
                }
            } else if (/^\d+$/.test(cleanValue)) {
                config[key] = parseInt(cleanValue);
            } else {
                config[key] = cleanValue;
            }
        }
    } catch (error) {
        print(`Error loading .env file: ${error.message}`, "error");
    }
    return config;
};

export const generateRandomAddress = () => {
    return ethers.Wallet.createRandom().address;
}; 