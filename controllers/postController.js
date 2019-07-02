var Post = require('../models/post');

// Good validation documentation available at https://express-validator.github.io/docs/
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all posts.
exports.index = function(req, res, next) {

  Post.find({}).exec(function (err, list_posts) {
    if (err) { return next(err); }
    // Successful, so render
    //res.render('posts', { title: 'Ostoslista', post_list: list_posts});
    res.render('posts', { title: 'Ostoslista', success: req.session.success, errors: req.session.errors, post_list: list_posts});
    req.session.errors = null;
    req.session.success = null;
  });
};

// Handle book create on POST.
exports.create =  function(req, res, next) {
  sanitizeBody('*').trim().escape();
  req.check('content', 'Sallittu merkkijono on 1-30 merkkiä pitkä.').isLength({min: 1, max: 30});
  req.check('content', 'Virheellinen merkki.').matches(/^[_A-z0-9ÖÄÅöäå.,]*((-|\s)*[_A-z0-9ÖÄÅöäå.,])*$/g,"i");
  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/posts');
  }
  else {
    // Create a post object
    // Improve: Use promises with .then()
    var post = new Post(
    { content: req.body.content,
    });
    post.save(function (err) {
      if (err) { return next(err); }
      // Successful - redirect to new book record.
      req.session.success = true;
      res.redirect('/posts');
    });
  }
};

exports.delete = function(req, res, next) {
  Post.remove({content: req.body.content}, function deleteContent(err) {
    if (err) { return next(err); }
    res.redirect('/posts');
  });
};
