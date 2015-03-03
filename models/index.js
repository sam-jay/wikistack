var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		Page, User;

var pageSchema = new Schema({
	title: String,
	url_name: String,
	owner_id: String,
	body: String,
	date: { type: Date, default: Date.now },
	status: Number
});

pageSchema.virtual('full_route').get(function() {
	return '/wiki/' + this.url_name;
});

var userSchema = new Schema({
	name: {
		first: String,
		last: String
	},
	email: String
});

Page = mongoose.model('Page', pageSchema);
User = mongoose.model('User', userSchema);

module.exports = {"Page": Page, "User": User};