require('dotenv').config();
const args = require('minimist')(process.argv.slice(2));
const mongoose = require('../lib/mongoose');

mongoose.connect();

// migration command:
// node src/script/ --name=`YOUR FILE NAME`

const run = require(`./${args.name}`);

setTimeout(() => {
	run();
}, 3000);