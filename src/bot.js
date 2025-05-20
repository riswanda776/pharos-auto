import { ethers } from 'ethers';
import axios from 'axios';
import { 
    print, 
    randomElement, 
    randomNumber, 
    randomWait, 
    displayBanner 
} from './utils/index.js';
import { 
    ERC20_ABI, 
    USDC_ABI, 
    SWAP_ROUTER_ABI 
} from '../contracts/abis.js';
import { config } from './config/index.js';

class PharosBot {
    constructor(privateKey) {
        this.wallet = new ethers.Wallet(privateKey);
        this.address = this.wallet.address;
        this.provider = null;
        this.contracts = {};
        this.axios = axios.create({
            headers: config.HEADERS
        });
    }

    async initialize() {
        this.provider = new ethers.JsonRpcProvider(config.RPC_URL);
        this.wallet = this.wallet.connect(this.provider);

        // Initialize contracts
        this.contracts.wphrs = new ethers.Contract(
            config.WPHRS_ADDRESS,
            ERC20_ABI,
            this.wallet
        );
        this.contracts.usdc = new ethers.Contract(
            config.USDC_ADDRESS,
            USDC_ABI,
            this.wallet
        );
        this.contracts.swapRouter = new ethers.Contract(
            config.SWAP_ROUTER_ADDRESS,
            SWAP_ROUTER_ABI,
            this.wallet
        );
    }

    async signMessage(message = "pharos") {
        try {
            print(`Signing message: "${message}"`, "info");
            // Sign the message directly without hashing it first
            const signature = await this.wallet.signMessage(message);
            print(`Generated signature: ${signature}`, "info");
            return signature;
        } catch (error) {
            print(`Error signing message: ${error.message}`, "error");
            throw error;
        }
    }

    async auth() {
        try {
            print("Starting authentication process...", "info");
            const signature = await this.signMessage();
            // print(`Generated signature for address: ${this.address}`, "info");
            
            // print("Request details:", "info");
            // print(`URL: ${config.BASE_URL}/user/login`, "info");
            // print(`Address: ${this.address}`, "info");
            // print(`Signature: ${signature}`, "info");

            const response = await this.axios.post(
                `${config.BASE_URL}/user/login`,
                null,
                {
                    params: {   
                        address: this.address,
                        signature: signature
                    }
                }
            );

            const token = response.data?.data?.jwt;
            if (token) {
                this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                print("Authentication successful!", "success");
                return true;
            } else {
                print("No JWT token found in response", "error");
            }
        } catch (error) {
            print(`Authentication failed: ${error.message}`, "error");
            if (error.response) {
                print(`Response status: ${error.response.status}`, "error");
                print(`Response data: ${JSON.stringify(error.response.data, null, 2)}`, "error");
            }
        }
        return false;
    }

    async getProfile() {
        try {
            const response = await this.axios.get(
                `${config.BASE_URL}/user/profile`,
                {
                    params: { address: this.address }
                }
            );
            return response.data?.data?.user_info;
        } catch (error) {
            print(`Failed to get profile: ${error.message}`, "error");
            return null;
        }
    }

    async checkin() {
        try {
            
            // Direct check-in attempt
            const checkinResponse = await this.axios.post(
                `${config.BASE_URL}/sign/in`,
                null,
                {
                    params: { address: this.address }
                }
            );

            if (checkinResponse.data?.code === 0) {
                print("Check-in successful!", "success");
                return true;
            } else {
                print(`Already Checkin`, "warning");
                return false;
            }
        } catch (error) {
            print(`Check-in failed: ${error.message}`, "error");
            if (error.response) {
                print(`Response status: ${error.response.status}`, "error");
                print(`Response data: ${JSON.stringify(error.response.data, null, 2)}`, "error");
                print(`Response headers: ${JSON.stringify(error.response.headers, null, 2)}`, "error");
            } else if (error.request) {
                print("No response received from server", "error");
                print(`Request details: ${JSON.stringify(error.request, null, 2)}`, "error");
            } else {
                print(`Error details: ${error.message}`, "error");
            }
            return false;
        }
    }

    async faucet() {
        try {
            const response = await this.axios.post(
                `${config.BASE_URL}/faucet/daily`,
                null,
                {
                    params: { address: this.address }
                }
            );

            if (response.status === 200) {
                print("Faucet successfully claimed!", "success");
                return true;
            } else {
                print("Failed to claim faucet.", "warning");
                return false;
            }
        } catch (error) {
            print(`Faucet failed: ${error.message}`, "error");
            if (error.response) {
                print(`Response status: ${error.response.status}`, "error");
                print(`Response data: ${JSON.stringify(error.response.data, null, 2)}`, "error");
            }
            return false;
        }
    }

    async swapToken() {
        try {
            const amount = randomNumber(
                config.AMOUNT_SWAP[0],
                config.AMOUNT_SWAP[1]
            );
            const amountWei = ethers.parseEther(amount.toString());
            const amountWeiStr = amountWei.toString();              // String

            print(`Attempting to swap ${amount} WPHRS to USDC`, "info");

            // Approve WPHRS spending
            print("Approving WPHRS spending...", "info");
            const approveTx = await this.contracts.wphrs.approve(
                config.SWAP_ROUTER_ADDRESS,
                amountWei
            );
            await approveTx.wait();
            print("Token approval successful!", "success");

            // Get current nonce
            const nonce = await this.provider.getTransactionCount(this.address);
      
            
            // Get gas price
            const feeData = await this.provider.getFeeData();
           
           
            
            // Prepare swap parameters
            const params = {
                tokenIn: config.WPHRS_ADDRESS,
                tokenOut: config.USDC_ADDRESS,
                fee: 500,
                recipient: this.address,
                deadline: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
                amountIn: amountWei.toString(), // Convert BigInt to string
                amountOutMinimum: "0", // Use string instead of number
                sqrtPriceLimitX96: "0" // Use string instead of number
            };

            print("Executing swap with parameters:", "info");
            print(JSON.stringify(params, null, 2), "info");

            // Build and send transaction
            print("Building transaction...", "info");
            const tx = await this.contracts.swapRouter.exactInputSingle.populateTransaction(
                params,
                {
                    from: this.address,
                    nonce: nonce + 1,
                    gasLimit: 500000, // Increased gas limit
                    // maxFeePerGas: feeData.maxFeePerGas ? feeData.maxFeePerGas * BigInt(2) : undefined, // Double the max fee
                    // maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? feeData.maxPriorityFeePerGas * BigInt(2) : undefined, // Double the priority fee
                    chainId: config.CHAIN_ID,
                    value: amountWeiStr
                }
            );

            // Log gas settings
        

            print("Sending swap transaction...", "info");
            const signedTx = await this.wallet.signTransaction(tx);
            print("Transaction signed successfully", "info");
            print(`Raw transaction: ${signedTx}`, "info");

            print("Broadcasting transaction...", "info");
            const swapTx = await this.provider.broadcastTransaction(signedTx);
            print(`Transaction broadcasted with hash: ${swapTx.hash}`, "info");
            
            print("Waiting for transaction to be mined...", "info");
            const receipt = await swapTx.wait();
            
            print(`Swap successful! TX: ${config.EXPLORER}${receipt.hash}`, "success");
            return true;
        } catch (error) {
            print(`Token swap failed: ${error.message}`, "error");
            if (error.transaction) {
                print("Transaction details:", "error");
                print(JSON.stringify(error.transaction, null, 2), "error");
            }
            if (error.reason) {
                print(`Reason: ${error.reason}`, "error");
            }
            return false;
        }
    }

    async sendToken() {
        try {
            const numSends = randomNumber(10, 15);
            print(`Will send PHRS ${numSends} times`, "info");
            
            for (let i = 0; i < numSends; i++) {
                const amount = randomNumber(
                    config.AMOUNT_SEND[0],
                    config.AMOUNT_SEND[1]
                );
                const amountWei = ethers.parseEther(amount.toString());
                const randomAddress = ethers.Wallet.createRandom().address;

                print(`Sending ${amount} PHRS to ${randomAddress} (${i + 1}/${numSends})`, "info");
                
                const tx = await this.wallet.sendTransaction({
                    to: randomAddress,
                    value: amountWei
                });
                await tx.wait();
                print(`Token sent successfully to ${randomAddress}!`, "success");
                
                // Add random delay between sends
                await randomWait(config.DELAY_BETWEEN_REQUESTS);
            }
            
            print(`Completed ${numSends} token sends successfully!`, "success");
            return true;
        } catch (error) {
            print(`Token send failed: ${error.message}`, "error");
            return false;
        }
    }

    async staking() {
        try {
            const balance = await this.contracts.wphrs.balanceOf(this.address);
            const percent = randomNumber(
                config.PERCENT_STAKE[0],
                config.PERCENT_STAKE[1]
            );
            const amount = (balance * BigInt(Math.floor(percent * 100))) / BigInt(10000);

            const tx = await this.contracts.wphrs.transfer(
                config.STAKING_CONTRACT,
                amount
            );
            const receipt = await tx.wait();
            print(`Staking successful! TX: ${config.EXPLORER}${receipt.hash}`, "success");
            return true;
        } catch (error) {
            print(`Staking failed: ${error.message}`, "error");
            return false;
        }
    }

    async runAll() {
        displayBanner();
        print(`Starting operations for wallet: ${this.address}`, "info");

        await this.initialize();
        if (!await this.auth()) return;

        const profile = await this.getProfile();
        if (profile) {
            print(`Current points: ${profile.TaskPoints}`, "info");
        }

        await this.checkin();
        await randomWait(config.DELAY_BETWEEN_REQUESTS);

        await this.faucet();
        await randomWait(config.DELAY_BETWEEN_REQUESTS);

        // await this.swapToken();
        // await randomWait(config.DELAY_BETWEEN_REQUESTS);

        await this.sendToken();
        await randomWait(config.DELAY_BETWEEN_REQUESTS);

        await this.staking();
        await randomWait(config.DELAY_BETWEEN_REQUESTS);

        const finalProfile = await this.getProfile();
        if (finalProfile) {
            print(`Final points: ${finalProfile.TaskPoints}`, "success");
        }
    }
}

export default PharosBot; 