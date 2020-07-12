const router = require('express').Router();
const Genre = require('../models/genre');
const { route } = require('./creator');

router.get("/", (req, res) => {
    Genre.find().
    then( genres => { res.render("genre/index", { genres, title: "genres" }) });
})


router.get("/add", (req, res) => {
    res.render("genre/add", { title: "Add a new genre" });
})

router.post("/add", (req, res) => {
    Genre.create({ type: req.body.type, desc: req.body.desc }).
    then( () => res.redirect("/genre"));
})

router.get("/show/:id", (req, res) => {
    Genre.findById(req.params.id).
    then( genre => res.render("genre/show", { genre, title: "@" + genre.type.toLowerCase() + "-genre" })).
    catch( err => console.log(err) );
})

router.delete("/remove/:id", (req, res) => {
    Genre.findByIdAndDelete(req.params.id).
    then( () => res.redirect("/genre"));
})  

module.exports = router;

/*{ <p>Genre:</p>
<% movie.dir.forEach( dir => { %>
    <a href="/remove/creator/<%= dir %>/movie/<%= movie._id %>"><%= dir %></a>
<% }) %>



<p>Add genre</p>
<% creators.forEach( creator => { %>
    <a href="/add/creator/<%= creator.name %>/movie/<%= movie._id %>"><%= creator.name %></a>
<% }) %>    } */