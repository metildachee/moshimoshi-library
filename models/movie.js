const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = Schema({
    title: String,
    desc: String,
    genres: [{type: Schema.Types.ObjectId, ref: "Genre"}],
    creator: { type: Schema.Types.ObjectId, ref: "Creator"},
    imagePath: String
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;