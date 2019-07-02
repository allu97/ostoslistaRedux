var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
    content: {type: String },
});

// Export model.
module.exports = mongoose.model('Post', PostSchema);
