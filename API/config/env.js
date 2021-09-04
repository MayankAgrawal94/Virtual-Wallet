process.env.NODE_ENV = process.env.NODE_ENV || "PRODUCTION"  // "STAGING" // "PRODUCTION"

if(process.env.NODE_ENV == 'PRODUCTION'){
	// app variables
	process.env.PORT1="3010"

	// Dev database variables
	process.env.DB_SECRETURL = "mongodb+srv://{{}}"

	// secure data

	// previous variables

}else if(process.env.NODE_ENV == 'STAGING'){
	// app variables

	// Dev database variables

	// secure data

	// previous variables

}else{
	// app variables
	process.env.PORT1 = "31000"

	// Dev database variables
	process.env.DB_SECRETURL = "mongodb+srv://{{}}"

	// secure data

	// previous variables
}
