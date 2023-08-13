const express = require("express")
const app = express()
const path = require("path")
const cookieparser = require("cookie-parser")
const passport = require("passport")
const googleOauth2 = require("passport-google-oauth20").Strategy;
const session = require("express-session")

app.use(express.static(path.join(__dirname,'views')))
app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))



passport.use(new googleOauth2({
  clientID: "437217891511-r08ir6tk54caib7emd2asseuukh0uarf.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "https://dapper-mandazi-f11034.netlify.app/auth/google/callback"
},

(accessToken, refreshToken, profile, done) => {
  // Profile contains user information returned by the provider
  console.log("profile details")
  //console.log(profile)
  return done(null, profile);
}));

// Serialize user into the session
passport.serializeUser((user, done) => {
done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user,done) => {
  done(null, user);
});

// Initialize Passport and use session for tracking authentication
app.use(passport.initialize());
app.use(passport.session());

// Route to initiate OAuth 2.0 authorization
app.get('/auth/google', passport.authenticate('google', { scope: ['email','profile']}));

// Callback route after successful authorization
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/auth/google' // can i redirect to index page?
}));

// Example protected route, app.get to display the user after verification
app.get('/profile', (req, res) => {
 console.log(req);
console.log("req.user what is the value")
console.log(req.user.displayName); 

let usernameFromFile = req.user.displayName

console.log("inputing condition to display the login page")
if(usernameFromFile)
res.sendFile("dapper-mandazi-f11034.netlify.app/profile/login.html")
//res.sendFile(path.join(__dirname,"views","login.html"))
})

app.post("/logout",(req,res)=>{

  req.session.destroy(err=>{
    if(err){console.log(err)}
    else(console.log("session destroyed"))

console.log("the end")
res.redirect("https://dapper-mandazi-f11034.netlify.app/") // since we cant access below file in render website which hosts only BE (it doesnt have front end file), we need to redirect to the netlify website URL where the frontend is displayed
//res.sendFile(path.join(__dirname,"views","index.html")) // in render website
  }) // now change the CALLBACK url of google console also
})

app.listen(3300,(res,req)=>{
    console.log("listening to server 3300")
})