require('dotenv').config();
const Web3 = require('web3');
const marketplaceABI = require('./Marketplace.json').abi;

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT));
const marketplaceContract = new web3.eth.Contract(marketplaceABI, process.env.MARKETPLACE_CONTRACT_ADDRESS);
const account = process.env.ACCOUNT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

async function listItem(tokenId, price) {
    try {
        const tx = marketplaceContract.methods.listItem(tokenId, price);
        const gas = await tx.estimateGas({from: account}).catch(err => {
            console.error('Error estimating gas:', err);
            throw err;
        });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(account);

        const signedTx = await web3.eth.accounts.signTransaction({
            to: process.env.MARKETPLACE_CONTRACT_ADDRESS,
            data,
            gas,
            gasPrice,
            nonce,
        }, privateKey).catch(err => {
            console.error('Error signing transaction:', err);
            throw err;
        });

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction).catch(err => {
            console.error('Error sending transaction:', err);
            throw err;
        });
        console.log('Transaction receipt:', receipt);
    } catch (error) {
        console.error('Error listing item:', error);
    }
}

async function buyItem(itemId) {
    try {
        const tx = marketplaceContract.methods.buyItem(itemId);
        const gas = await tx.estimateGas({from: account}).catch(err => {
            console.error('Error estimating gas for buying item:', err);
            throw err;
        });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(account);

        const signedTx = await web3.eth.accounts.signTransaction({
            to: process.env.MARKETPLACE_CONTRACT_ADDRESS,
            data,
            gas,
            gasPrice,
            nonce,
        }, privateKey).catch(err => {
            console.error('Error signing transaction for buying item:', err);
            throw err;
        });

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction).catch(err => {
            console.error('Error sending transaction for buying item:', err);
            throw err;
        });
        console.log('Transaction receipt:', receipt);
    } catch (error) {
        console.error('Error buying item:', error);
    }
}

async function displayItemsForSale() {
    try {
        const items = await marketplaceContract.methods.getItemsForSale().call().catch(err => {
            console.error('Error fetching items for sale:', err);
            throw err;
        });
        console.log('Items for sale:', items);
    } catch (error) {
        console.error('Error retrieving items for sale:', error);
    }
}

module.exports = { listItem, buyItem, displayItemsForSale };