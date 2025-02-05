//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
//dl 
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://vaibd:abcd@1234@cluster0-do9de.mongodb.net/Users", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);


const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String,
  name: String,
  phone: String,
  usr: String,
  role: { type: String, default: "User" },
  songName: String
});

  
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://dl-rhyme.herokuapp.com/download",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res){
  res.render("home");
});

//app.get("/index.html", function(req, res){
 // res.render("index.html");
//});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    //res.redirect("/secrets");
    //res.redirect(__dirname + "/index.html");
      res.redirect("/download")
  });

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers});
      }
    }
  });
});

app.get("/submit", function(req, res){
  if (req.isAuthenticated()){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

//xxxxxxxxxxxxxxxxxxxxx

app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;
  
  
  
//xxxxxxxxxxxxxxxxxxxxx  
  

//Once the user is authenticated and their session gets saved, their user details are saved to req.user.
  // console.log(req.user.id);

  User.findById(req.user.id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function(){
          //res.redirect("/secrets");
          //res.redirect(__dirname + "/index.html");
          res.sendFile(__dirname + "/index.html");
        });
      }
    }
  });
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res){

  User.register({username: req.body.username, name: req.body.name, phone: req.body.number, usr: req.body.usr}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        //res.redirect("/secrets");
        //res.redirect(__dirname + "/index.html");
        res.redirect("/download")
      });
    }
  });

});

app.get("/download",function(req,res){
  res.sendFile(__dirname+"/index.html")
});



app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        //res.redirect("/secrets"); 
        //res.redirect(__dirname + "/index.html");
        res.redirect("/download")
      });
    }
  });

});







app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000.");
});

//dl 



app.post('/stat', function (req, res, next) {
    if (req.isAuthenticated()){
         let list = {songName: req.body.stat};
          User.updateOne({_id: req.user._id}, {$push: {songName: req.body.stat}}, function (err){
        if (err) console.log(err);
        res.redirect('/download');
        });  
        
        
  } else {
    res.redirect("/error");
  }
});



app.get('/downloadmp3', async (req, res, next) => {  
	try {
		 let url = req.query.url;
		let title = 'audio';
		await ytdl.getBasicInfo(url, {
			format: 'mp4'
		}, (err, info) => {
			title = info.player_response.videoDetails.title;
		});

		res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
		ytdl(url, {
			format: 'mp3',
			filter: 'audioonly',
		}).pipe(res);         
	} catch (err) {
		console.error(err);
	}	 
});



app.get('/downloadmp4', async (req, res, next) => {
	try {
		let URL = req.query.url;
		let title = 'video';

		await ytdl.getBasicInfo(URL, {
			format: 'mp4'
		}, (err, info) => {
			title = info.player_response.videoDetails.title;
		});

		res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
		ytdl(URL, {
			format: 'mp4',
		}).pipe(res);
	} catch (err) {
		console.error(err);
	}
});
 



app.get("/edit", function(req, res, next) {
  if (req.isAuthenticated()){
       res.render('edit', {
         user: req.user
         });
  } else {
    res.redirect("/error");
  }
});

app.post('/edit', function (req, res, next) {
    if (req.isAuthenticated()){
          User.updateOne({_id: req.user._id}, {$set: req.body}, {
            username: req.body.username,
            name: req.body.name,
            phone: req.body.number,
            usr: req.body.usr,
            password: req.body.password
    }, function (err){
        if (err) console.log(err);
        res.render('login', {
        user: req.user
    });
});  
        
        
  } else {
    res.redirect("/error");
  }
});

         
app.get("/play",function(req,res){
  res.sendFile(__dirname+"/play.html")
})       
         
app.get("/view", function(req, res){
  User.find({_id: req.user._id}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("view", {usersWithSecrets: foundUsers});
      }
    }
  });
});

app.get("/admin", function(req, res){
    
      if (req.user.role === "admin") {
 
            User.find({}, function(err, foundUsers){
            if (err){
                console.log(err);
            } else {
                    if (foundUsers) {
                        console.log(foundUsers);
                        res.render("admin", {userList: foundUsers});
                    }
              }
            });

      } else {
         res.redirect("/error");
         }
});

 

app.get("/adminEdit", function(req, res){

      if (req.user.role === "admin") {
 
            User.find({}, function(err, foundUsers){
            if (err){
                console.log(err);
            } else {
                    if (foundUsers) {
                        res.render("adminEdit", {userList: foundUsers});
                    }
              }
            });

      } else {
         res.redirect("/error");
         }
});

app.post("/editAdmin", function(req, res){

      if (req.user.role === "admin") {
 
                User.updateOne({_id: req.body.id}, {$set: req.body}, {
                    username: req.body.username,
                    name: req.body.name,
                    phone: req.body.number,
                    usr: req.body.usr,
                    password: req.body.password
                }, function (err){
                    if (err) console.log(err);
                    res.redirect('adminEdit');
                }); 

      } else {
         res.redirect("/error");
         }
});

 



app.post("/admindelete", function(req, res){

      if (req.user.role === "admin") {
 
              User.deleteOne({_id: req.body.id}, function (err){
                    if (err) console.log(err);
                    res.redirect('adminEdit');
                }); 

      } else {
         res.redirect("/error");
         }
});
 
