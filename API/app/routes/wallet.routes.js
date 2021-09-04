module.exports = (app) => {
    const wallet = require('../controllers/wallet.controller.js');

    // Initialise wallet
    app.post('/setup', wallet.create);

    // Credit/Debit amount
    app.post('/transact/:walletId', wallet.createTrans);
    
    //Fetch transactions
    app.get('/transactions', wallet.getTransactions);

    app.get('/transactionsCount', wallet.getTransactionsCount);
    
    app.get('/wallet/:id', wallet.getWallet);
}