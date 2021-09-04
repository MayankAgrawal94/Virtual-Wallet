const walletModel = require('../models/wallet.model')
const transactionsModel = require('../models/transactions.model')


//Initialise wallet
exports.create = async (req, res) => {
    // Validate request
    if( !req.body.name ) {
        return res.status(400).send({
            error : true,
            message: "Please fill the wallet name."
        });
    }

	const session = await walletModel.startSession();
  	session.startTransaction();

  	let walletResponse = {}
	try {
		const opts = { session };

		const wallet = new walletModel(req.body);
        
		const A = await wallet.save( opts )
		.then(data => {
	        // console.log( "data - ", data )
	        walletResponse['wallet'] = data
	    })

	    const saveTrans = {
			walletId: walletResponse['wallet']['_id'],
			amount: walletResponse['wallet']['balance'],
			balance: walletResponse['wallet']['balance'],
			type:  (walletResponse['wallet']['balance'] > -1) ? 'CREDIT' : 'DEBIT'
	    }
	    const transaction = new transactionsModel(saveTrans);

		const B = await transaction.save( opts )
		.then(data => {
	        // console.log( "data - ", data )
	        walletResponse['transaction'] = data
	    })

		await session.commitTransaction();

	} catch (error) {
		// If an error occurred, abort the whole transaction and
		// undo any changes that might have happened
		await session.abortTransaction();
        console.error(error)
        res.status(500).send({
            error : true,
            message: error.message || "Some error occurred while creating the Wallet."
        });
	} finally {
		// console.log( walletResponse )
		session.endSession();
        res.status(200).send({
           id: walletResponse['wallet']['_id'],
           balance: walletResponse['wallet']['balance'],
           transactionId: walletResponse['transaction']['_id'],
           name: walletResponse['wallet']['name'],
           date: walletResponse['wallet']['date']
        });

	}

};


//Credit/Debit amount
exports.createTrans = async (req, res) => {
    // Validate request
    if( !req.params.walletId || 
        !req.body.amount || 
        typeof req.body.amount !=='number') {

        return res.status(400).send({
            error : true,
            message: "Please provide the correct details."
        });
    }

	const session = await walletModel.startSession();
  	session.startTransaction();

  	let walletResponse = {}
    try{
    	const opts = { session };

	    await walletModel.findById(req.params.walletId)
	    .then(walletData => {
	    	// console.log( walletData )
	        if(!walletData){
				throw {message:"Request can't be processed because wallet not found."}
	        }
	        walletResponse['wallet'] = walletData
	    })

	    let _temp = req.body.amount + walletResponse['wallet']['balance']
	    _temp = parseFloat(parseFloat(_temp).toFixed(4))

	    const A = await walletResponse['wallet'].updateOne({balance : _temp}, opts)

	    const saveTrans = {
			walletId: walletResponse['wallet']['_id'],
			amount: req.body.amount,
			balance: _temp,
			type:  ( req.body.amount  > -1 ) ? 'CREDIT' : 'DEBIT',
			description: req.body.description
	    }
	    const transaction = new transactionsModel(saveTrans);

	    // console.log( "saveTrans - ", saveTrans )

		const B = await transaction.save( opts )
		.then(data => {
	        // console.log( "data - ", data )
	        walletResponse['transaction'] = data
	    })

	    await session.commitTransaction();


    }catch( error ) {
		// If an error occurred, abort the whole transaction and
		// undo any changes that might have happened
		await session.abortTransaction();
        console.error(error)
        res.status(500).send({
            error : true,
            message: error.message || "Some error occurred while processing the request."
        });
    }finally{
    	session.endSession();
        res.status(200).send({
           balance: walletResponse['transaction']['balance'],
           transactionId: walletResponse['transaction']['_id'],
        });
    }
	
}


//Fetch transactions
exports.getTransactions = async (req, res) => {
    // Validate request
    if( !req.query.walletId || 
        !req.query.skip ||
        !req.query.limit ) {

        return res.status(400).send({
            error : true,
            message: "Please provide the correct details."
        })
	}


	transactionsModel.find({walletId: req.query.walletId})
	.skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit))
	.then(data => {
        // console.log( "data - ", data )
        res.status(200).send(data);
    }).catch(err => {
        console.error(err)
        res.status(500).send({
            error : true,
            message: err.message || "Some error occurred while fetching the records."
        });
    })

}

exports.getTransactionsCount = (req, res) => {

    transactionsModel.countDocuments()
    .then(data => {
        res.status(200).send({count: data})
    }).catch(err => {
        console.error(err)
        res.sendStatus(500).send({
            error : true,
            message: err.message || "Some error occurred while fetching the records."
        });
    })

}

//Get wallet
exports.getWallet = async (req, res) => {

	walletModel.findById(req.params.id)
	.then(data => {
        // console.log( "data - ", data )
        res.status(200).send(data);
    }).catch(err => {
        console.error(err)
        res.status(500).send({
            error : true,
            message: err.message || "Some error occurred while fetching the records."
        });
    })

}