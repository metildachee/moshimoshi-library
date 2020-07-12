const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = Schema({
    type: String,
    desc: String,
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;