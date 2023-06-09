const express = require('express')
const mongoose = require('mongoose')
const Health = require('./models/blog_input.js')
const methodOverride = require('method-override')

const app = express()

// Syntax to provide our form the method to use
app.use(methodOverride('_method'))
//To send json data back and forth with no issues
app.use(express.urlencoded({extended: true}))
// So that we can link staic files 
app.use(express.static(__dirname + "/public"))

// Getting our index.ejs file and rendering it on browser at health route
app.get('/blog', (req,res) => {
    Health.find({}).then((allHealth) => {
        res.render('blog.ejs', {
            health: allHealth
        })
    })
})

// Getting our mental.ejs file and rendering it in our browwser at health/mental route
app.get('/blog/new', (req, res) => {
    res.render('createNew.ejs')
})

// Getting our blog/about route and rendering our about.ejs file
app.get('/blog/about', (req, res) => {
    res.render('about.ejs')
})

app.get('/blog/:id', (req, res) =>{
    Health.findById(req.params.id).then((foundPost) => {
        res.render('show.ejs', {
            health: foundPost
        })
    })
})

// This ia a route to catch all tags
// (this gets the route tag, and then it passes in the parameter of the tag the database, finds all of the post with tag and a specific tag value and renders all of those post with those values on the ejs page.)
app.get('/tags/:tag', (req, res) => {
    Health.find({tag: req.params.tag}).then((foundPost) => {
        res.render('tags.ejs',{
            health: foundPost,
            tag: req.params.tag,
        })
    })
})

// This is the create route
app.post('/blog', (req, res) => {
    // Create method
Health.create(req.body).then((healthBlogInput) => {
    res.redirect('/blog')
})
})
// This is the delete route
app.delete('/blog/:id', (req, res) => {
    Health.findByIdAndRemove(req.params.id).then(() => {
        res.redirect('/blog')
    })
})

// This is the edit route
app.put('/blog/:id', (req,res) => {
    Health.findByIdAndUpdate(req.params.id, req.body).then(() => {
        res.redirect('/blog')
    })
})
// This is the edit route (show route that allows us to edit)
app.get('/blog/:id/edit', (req,res) => {
    Health.findById(req.params.id).then((foundPost) => {
        res.render('edit.ejs', {
            health: foundPost
        })
    })
})

// Connects mongodb to mongoose
mongoose.connect('mongodb://localhost:27017/blogcrud').then(() => {
    console.log('connection with mongo established');
})

app.listen(3000, () => {
    console.log("hi kayisha, i'm listening..");
})