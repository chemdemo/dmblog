/*
 * GET home routes page.
 */
var settings = require('../../settings');
var controller = require('../controller');
//var user = controller.user;
var sign = controller.sign;
var post = controller.post;
var tag = controller.tag;
var comment = controller.comment;

var EventProxy = require('eventproxy');

function home(req, res, next) {
	//console.log('session: ', req.session);
	//console.log('cookie: ', req.cookies);
	var proxy = EventProxy.create('posts', 'tags', 'counts', function(posts, tags, counts) {
		var sUser = req.session.user;
		var user = {admin: sUser ? sUser.admin : false};
		res.render('index', {
			user: user,
			posts: posts,
			tags: tags,
			counts: counts,
			home: true
		});
	}).fail(next);

	post.fetchByPage(0, 10, function(err, doc) {
		//console.log('fetchByPage: ', err, doc)
		if(err) return proxy.emit('error', err);
		proxy.emit('posts', doc);
	});

	tag.findAllTags(function(err, doc) {
		//console.log('findAllTags: ', err, doc)
		if(err) return proxy.emit('error', err);
		proxy.emit('tags', doc);
	});

	post.findCounts(null, function(err, doc) {
		//console.log('countMonthy: ', err, doc)
		if(err) return proxy.emit('error', err);
		proxy.emit('counts', doc);
	});
}

function routes(app) {
	// index
	app.get('/', home);
	app.get('/index', home);
	app.get('/home', home);
	
	// user about
	//app.get('/signup', sign.signup);
	//app.post('/signup', sign.signup);
	app.get('/login', sign.login);
	app.post('/login', sign.login);
	app.get('/logout', sign.logout);
	app.get('/info', sign.info);
	//app.get('/social/oauth/callback', sign.socialLogin);
	
	// post about
	app.get('/edit/:postid?', sign.loginCheck, sign.adminCheck, post.edit);
	//app.post('/edit/:postid?', sign.loginCheck, sign.adminCheck, post.save);// post.create
	app.put('/post/create', sign.loginCheck, sign.adminCheck, post.create);
	app.post('/post/update/:postid?', sign.loginCheck, sign.adminCheck, post.update);
	app.delete('/post/delete/:postid', sign.loginCheck, sign.adminCheck, post.remove);
	app.get('/post/:postid', post.show);
	app.get('/post/content/:postid?', post.getPostContent);

	// comment about
	app.get('/comment/:postid?', comment.findAllByPostId);
	app.put('/comment/add/:postid?', comment.add);
	app.delete('/comment/delete/:commentid?', /*sign.loginCheck, */comment.remove);

	// tag about
	app.get('/tag/:tag', tag.findPostsByTag);

	// post counts about
	app.get('/posts/:year/:month', post.counts);

	// search
	app.post('/search', post.search);
}

module.exports = routes;