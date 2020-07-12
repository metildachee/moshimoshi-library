const router = require('express').Router();
const Creator = require("../models/creator");
const Movie = require('../models/movie');

router.get("/", (req, res) => {
    Creator.find().
    then( creators => { res.render("creator/index", { title: "Our creators..", creators: creators }); }).
    catch( err => console.log(err) );
})

router.get("/add", (req, res) => {
    res.render("creator/add", { title: "Add a new creator" });
})

router.post("/add", async (req, res) => {
    Creator.find({ name: req.body.name }). 
    then( item => { if (item != undefined ) res.redirect("/creator"); })

    let creator = await Creator.create({
        name: req.body.name,
        age: req.body.age,
        desc: req.body.desc,
        imagePath: req.body.imagePath
    })

    req.body.works.split(", ").forEach( work => { 
        try {
            Movie.create({ name: work, creator: creator._id }). 
            then( async movie => {  
                await Creator.findByIdAndUpdate(creator._id, { $push: { works: movie._id }}); 
                res.redirect("/creator");
            })            
        }
        catch(err) { console.log(err); }
    })
})

router.delete("/remove/:id", (req, res) => {
    console.log("Item deleted");
    Creator.findByIdAndDelete(req.params.id).
    then( () => res.redirect("/creator") ).
    catch( err => console.log(err) );
})

router.get("/edit/:id", (req, res) => {
    Creator.findByIdAndUpdate(req.params.id).
    then( creator => {
        res.render("creator/edit", { title: "Update " + creator.name, creator: creator })
    }).
    catch( err => console.log(err) )
})

router.get("/show/:id", (req, res) => {
    Creator.findById(req.params.id).
    populate("works").
    exec( (err, creator) => { 
        res.render("creator/show", { creator: creator, title: "Viewing " + creator.name }); 
    });
})

router.post("/edit/:id", (req, res) => {
    Creator.findByIdAndUpdate(req.params.id,  { age: req.body.age, desc: req.body.desc, imagePath: req.body.imagePath })
    .then( () => { res.redirect("/creator"); })
    .catch( err => console.log(err) )
})

module.exports = router;