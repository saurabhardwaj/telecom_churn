/* eslint-disable no-console */

const UserModel = require('../controller/user/user.model');
const args = require('minimist')(process.argv.slice(2));
// node src/script/ --name='create-admin' --email='admin@investpair.com' --password='Qwerty@123'
const run = async () => {
	try {
		const userObj = {
			email: args.email,
			password: args.password,
			role: "admin",
			firstName: "Investpair",
			lastName: "Admin",
		};
		const userSave = new UserModel(userObj);
		await userSave.save();
		process.exit(1);
	} catch (err) {
		console.log('err', err);
		process.exit(1);
	}
};

module.exports = run;