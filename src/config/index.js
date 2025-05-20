export const config = {
    // Network Configuration
        BASE_URL: "https://api.pharosnetwork.xyz",
    RPC_URL: "https://testnet.dplabs-internal.com",
    CHAIN_ID: 688688,
    DELAY_BETWEEN_REQUESTS: [3, 10],
    USE_PROXY: false,
    REF_CODE: "",

    // Token amounts
    AMOUNT_SWAP: [0.001, 0.002],
    AMOUNT_SEND: [0.001, 0.002],
    PERCENT_STAKE: [5, 10],

    // Contract addresses
    WPHRS_ADDRESS: "0x76aaada469d23216be5f7c596fa25f282ff9b364",
    USDC_ADDRESS: "0x4d21582f50Fb5D211fd69ABF065AD07E8738870D",
    USDT_ADDRESS: "0x2eD344c586303C98FC3c6D5B42C5616ED42f9D9d",
    SWAP_ROUTER_ADDRESS: "0x1a4de519154ae51200b0ad7c90f7fac75547888a",
    STAKING_CONTRACT: "0x0000000000000000000000000000000000000000",

    // API Headers
    HEADERS: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json',
        'Origin': 'https://testnet.pharosnetwork.xyz',
        'Referer': 'https://testnet.pharosnetwork.xyz/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    }
}; 