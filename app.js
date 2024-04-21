require('dotenv').config();
const Web3 = require('web3');
const marketplaceABI = require('./Marketplace.json').abi;

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT));
const marketplaceContract = new web3.eth.Contract(marketplaceABI, process.env.MARKETPLACE_CONTRACT_ADDRESS);
const account = process.env.ACCOUNT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

async function listItem(tokenId, price) {
    const tx = marketplaceContract.methods.listItem(tokenId, price);
    const gas = await tx.estimateGas({from: account});
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(account);

    const signedTx = await web3.eth.accounts.signTransaction({
        to: process.env.MARKETPLACE_CONTRACT_ADDRESS,
        data,
        gas,
        gasPrice,
        nonce
    }, privateKey);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .then(receipt => console.log('Transaction receipt:', receipt))
        .catch(error => console.error('Error listing item:', error));
}

async function buyItem(itemId) {
    const tx = marketplaceContract.methods.buyItem(itemId);
    const gas = await tx.estimateGas({from: account});
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(account);

    const signedTx = await web3.eth.accounts.signTransaction({
        to: process.env.MARKETPLACE_CONTRACT_ADDRESS,
        data,
        gas,
        gasPrice,
        nonce
    }, privateKey);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .then(receipt => console.log('Transaction receipt:', receipt))
        .catch(error => console.error('Error buying item:', error));
}

async function displayItemsForSale() {
    marketplaceContract.methods.getItemsForSale().call()
        .then(items => console.log('Items for sale:', items))
        .catch(error => console.error('Error retrieving items for sale:', error));
}