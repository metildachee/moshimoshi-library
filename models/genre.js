const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = Schema({
    type: String,
    desc: String,
    works: [{type: Schema.Types.ObjectId, ref: "Movie"}]
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;