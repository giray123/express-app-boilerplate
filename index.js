const config = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const path = require('path')
const morgan = require('morgan')

const app = express()
const db = require('./db')

const auth = require('./auth')()

/* * * * * * * * * *
 *  APP SETTINGS   *
 * * * * * * * * * */

app.use(bodyParser.urlencoded({extended: true})) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.use(morgan('combined')) //logger
app.use(expressSession({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
})) // session for twitter login
app.set('views', './views') // location of HMTL files
// app.set('view engine', 'mustache') //set view engine


/* * * * * * *
 *  ROUTES   *
 * * * * * * */

app.use(auth.initialize())

// here are the static assets like images
app.use('/assets', auth.authenticate(), express.static(path.join(__dirname, 'assets')))

// this will be the homepage
app.get('/', function (req, res){
    res.sendFile(path.join(__dirname+'/views/home.html'))
    // res.render('home')
})

//api routes
const apiRoutes = require('./api/routes/apiRoutes')
app.use('/api', apiRoutes)


//404 for all other routes
// location of this route should be at the end
app.use((req, res)=>{
    res.status(404).send({
        url: req.originalUrl + ' not found'
    })
})

/* * * * * * *
 *  SERVER   *
 * * * * * * */

//start the server
app.listen(process.env.PORT || 3000, ()=>console.log('listening on port 3000!'))