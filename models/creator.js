const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const creatorSchema = Schema({
    name: String,
    age: Number,
    desc: String,
    works: [{type: Schema.Types.ObjectId, ref: "Movie"}],
    imagePath: String,
});

let Creator = mongoose.model("Creator", creatorSchema);

module.exports = Creator;