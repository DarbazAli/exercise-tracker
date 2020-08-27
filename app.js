const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors');
const { json } = require('body-parser');
require('dotenv').config()

const USER = require('./Schema').USER;
// const EXERCISE = require('./Schema').EXERCISE;

const app = express();

app.listen(3000, () => console.log("Listening on 3000"))
console.clear();
// setup template engine
app.set('views', './views');
app.set('view engine', 'pug');

// serve static files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(cors())

// create the home url
app.get('/', (req, res) => {
    res.render('index', {title: 'Home'})
})

app.get('/about', (req, res) => {
    res.render('about')
})

 /*============= 1. Create a MongoDB database and connect . ===========*/
 const MONGO_URL = process.env.MONGO_URL_LOCAL;
 mongoose.connect(MONGO_URL, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     serverSelectionTimeoutMS: 5000
 })



//  Setup POST Route to new user
app.post('/api/exercise/new-user', (req, res) => {
    const username = req.body.username;

    // check if username already exist
    const isExist = USER.countDocuments({username: username}, (err, count) => {
        if ( err ) res.send(err)
        // if user is exist, then set status to 401, and redirect to the form
        if ( count > 0 ) {
            res.status(401).render('index', {message: "User already exist!"})
        }

        /*  if user is new, then create a new username based on provided 
            username from the form, and save it to database
        */
        else {
            // create new user
            const newUser = new USER({
                username: username
            })

            // save to database
            newUser.save((err, user) => {
                if (err) res.send(err)
                res.json({
                    "username": user.username,
                    "_id": user._id
                })
            })
        } 
        

    });

    
    
})

// get all users that has been created in the database in this url "api/exercise/users"
app.get('/api/exercise/users', (req, res) => {
    USER.find((err, users) => {
        if ( err ) res.send(err)
        res.json(users)
    })
})



/*======================================================================= 
    SETUP POST ROUTER TO ADD NEW EXERCISE
=======================================================================*/

app.post('/api/exercise/add', (req, res) => {
    let { userId, description, duration, date } = req.body;

    const event = !date ? new Date().toDateString() :
        new Date(date).toDateString();

    // search for username based on provided userid

    if ( !userId || !description || !duration ) {
        res.send("userid, Description, and Duration fields are required!")
    }

    const exerciseInstance = {
        description: description,
        duration: parseInt(duration),
        date: event
    }
    // find user in db and update
    USER.findByIdAndUpdate(
        userId,
        {$push: { exercise: exerciseInstance}},
        (err, doc) => {
            if ( err ) res.send(err)
            res.json({
                
                username: doc.username,
                description: description,
                duration: parseInt(duration),
                _id: doc._id,
                date: event,
                
                
            })
        }
    )
})


// retrive all exercise by id
app.get('/api/exercise/log', (req, res) => {
    // extract parameters
    let {userId, limit, from, to } = req.query;
   
    // // check if userid param is enterd
    if ( !userId ) {
        res.send('Unknown userID');
    } 

    let log = [];
    USER.findOne({_id: userId}, (err, data) => {

      if (err) {
        res.send(err);
      }

      log = data.exercise.slice();

      if (from && !to) {
        log = log.filter(item => new Date(item.date).getTime() > new Date(from).getTime());
      } 
      
      else if (!from && to) {
        log = log.filter(item => new Date(item.date).getTime() < new Date(to).getTime());
      } 
      
      else if (from && to) {
        log = log.filter(item => new Date(item.date).getTime() > new Date(from).getTime() 
                      && new Date(item.date).getTime() < new Date(to).getTime());
      }
      if (limit) {
        log = log.slice(0, limit);
      }
      res.send({

          _id: data._id,
          username: data.username,
          count: data.exercise.length,
          log: log
      })
    })
    
})


