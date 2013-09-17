var settings = require('../../settings');
var mongoose = require('mongoose');
var dbURI = 'mongodb://' + settings.DB_HOST + ':' + settings.DB_PORT + '/' + settings.DB_NAME;

// see http://stackoverflow.com/questions/11928151/mongoose-output-the-error-error-connection-closed
// "mongoose.connect() Is not accepting any callback functions"
/*mongoose.connect(dbURI, function(err) {
	if(!err) {
		console.log('Connect to db success!' + '\ndbURI: ' + dbURI);
	} else {
		console.error('Connect to db error.\ndbURI: '+dbURI+'.\nError message: ' + err.message);
	}
});*/
var db = mongoose.connection;
db.on('error', function(err) {
	console.error('Error in MongoDb connection: ' + err);
	mongoose.disconnect();
});
db.on('connected', function() {
	console.log('Connect to MongoDb success.');
});
db.on('disconnected', function() {
	console.log('MongoDB disconnected!');
	mongoose.connect(dbURI, {server: {auto_reconnect: true}});
});
mongoose.connect(dbURI, {server: {auto_reconnect: true}});

require('./user');
require('./post');
require('./tag');
require('./comment');

exports.User = mongoose.model('User');
exports.Post = mongoose.model('Post');
exports.Tag = mongoose.model('Tag');
exports.Comment = mongoose.model('Comment');