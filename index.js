const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Movies = require('./models/movie.js');
const Creators = require("./models/creator.js");
const Genre = require('./models/genre.js');
require("dotenv").config();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}, () => { console.log("Mongodb connected!"); });

const app = express();
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));

app.use("/creator", require("./routes/creator"));
app.use("/genre", require("./routes/genre"));

app.get("/", (req, res) => {
    Movies.find().
    populate("creator").
    exec((err, movies) => {
        res.render("index", { movies: movies, title: "moshimoshi-library" });
    })
})

app.get("/show/:id", (req, res) => {
    Movies.findById(req.params.id).
    populate("creator genres").
    exec((err, movie) => {
        res.render("show",{ movie, title: movie.title });
    })
})

app.get("/add", (req, res) => {
    res.render("add", { title: "add-manga"});
})

app.post("/add", async (req, res) => { 
    let creator = await Creators.find({ name: req.body.creator }).
    then( async value => {
        if (value.length != 0) return value[0];
        else return await Creators.create({ name : req.body.creator });
    } ).
    catch( err => console.log(err) )
    
    let genreArr = [];
    for (let i = 0; i < req.body.genres.split(", ").length; i++) {
        let genre = req.body.genres.split(", ")[i];
        await Genre.find({ type: genre }).
        then( async value => {
            if (value != 0) genreArr.push(value._id);
            else {
                await Genre.create({ type: genre }).
                then( newGenre => { 
                    console.log(newGenre);
                    genreArr.push(newGenre._id);  
                });
            }
        })
    }

    let movie = await Movies.create({
        title: req.body.title,
        desc: req.body.desc,
        creator: creator._id,
        genres: genreArr,
        imagePath: req.body.imagePath,
    })
    
    Creators.findByIdAndUpdate(creator._id, { $push: { works: movie._id }}). 
    then( creator => { res.redirect("/"); }).
    catch( err => console.log(err) );
})

app.get("/edit/:id", (req, res) => { // Redirects to edit form
    Movies.findById(req.params.id).
    then( value => {  res.render("edit", { movie: value, title: "Update " + value.title }); })
})

app.post("/edit/:id", async (req, res) => {
    let creatorId = await Creators.find({ name: req.body.creator }).
    then( creator => {  return creator[0]._id; }).
    catch( err => console.log(err) );
    await Creators.findByIdAndUpdate(creatorId, { $push: { works: req.params.id }});

    let genreArr = [];
    for (let i = 0; i < req.body.genres.split(", ").length; i++) {
        let genre = req.body.genres.split(", ")[i];
        await Genre.find({ type: genre }).
        then( async value => {
            if (value != 0) genreArr.push(value._id);
            else {
                await Genre.create({ type: genre }).
                then( newGenre => { 
                    genreArr.push(newGenre._id);  
                });
            }
        })
    }

    Movies.findByIdAndUpdate(req.params.id, 
        { genres: genreArr, creator: creatorId, desc: req.body.desc, imagePath: req.body.imagePath }).
    then( value => { res.redirect("/"); }).
    catch( err => console.log(err) );
})

app.delete("/remove/:id", (req, res) => {
    Movies.findByIdAndDelete(req.params.id).
    then( () => res.redirect("/")).
    catch( err => console.log(err) );
})

// app.get("/add/creator/:creator_name/movie/:movie_id", (req, res) => {
//     console.log(req.params.creator_name);
//     Movies.findByIdAndUpdate(req.params.movie_id, { $push: { dir: req.params.creator_name }})
//     .then( value => {
//         res.redirect(`/show/${req.params.movie_id}`);
//     })
//     .catch( err => {  console.log(err);
//     })
// })

// app.get("/remove/creator/:dir/movie/:movie", (req, res) => {
//     console.log("Remove function");
//     Movies.findByIdAndUpdate(req.params.movie, { $pull: { dir: req.params.dir }})
//     .then( value => res.redirect(`/show/${req.params.movie}`))
//     .catch( err => console.log("An error occured "));
// })

app.listen(process.env.PORT, () => { console.log("Server started..."); })
