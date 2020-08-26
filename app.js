const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors');
require('dotenv').config()

const USER = require('./Schema').USER;
const EXERCISE = require('./Schema').EXERCISE;

const app = express();

app.listen(3000, () => console.log("Listening on 3000"))

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
    const isExist = USER.count({username: username}, (err, count) => {
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

// retrive all exercise by id
app.get('/api/exercise/log', (req, res) => {
    let userID = req.query.user_id;
    // console.log(userID);
    EXERCISE.find({userid: userID}, (err, data) => {
        res.json(data)
    })

    // EXERCISE.find((err, data) => {
    //     res.json(data)
    // })
})


/*======================================================================= 
    SETUP POST ROUTER TO ADD NEW EXERCISE
=======================================================================*/

app.post('/api/exercise/add', (req, res) => {
    let { userid, description, duration, date } = req.body;

    if ( !date ) {
        date = new Date();
    }

    // search for username based on provided userid

    USER.find({_id: userid}, (err, user) => {
        if (err) res.send(err)
        // return user.username;
        const username = user[0].username;
        const exercise = new EXERCISE({
            userid: userid,
            username: username,
            date: date,
            duration: duration,
            description: description
        })
    
        exercise.save((err, data) => {
            if ( err ) res.send(err);
            res.json({
                _id: data._id,
                username: data.username,
                data: data.date,
                duration: data.duration,
                description: data.description
            })
        })
    
    })
   
    
    

    

    /* 
        "_id": "5f461f08ad2edf00314b4692",
        "username": "darbazali",
        "date": "Fri May 01 2020",
        "duration": 44,
        "description": "bullshit"
    */
    
    

})

