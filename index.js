const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

initialize(passport);
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: 'postgres://postgres:2590@localhost/users'
})

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'secret',resave: false, saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', checkNotAuthenticated, (req, res) => res.render('pages/login'));


//renders to the register page in the views/pages.
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("pages/register");
});

//renders to the login page in the views/pages.
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("pages/login");
});

//renders to the game main page in the views/pages.
app.get("/gamehome", checkAuthenticated, (req, res) => {
  res.render("pages/game_home");
});


// logout the user and redirects to the login page.
app.get("/logout", checkAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out successfully" );
  res.redirect("/login");
});


//registers the user in the database and handles the errors and success.
app.post("/register", checkNotAuthenticated, async (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var passwordre = req.body.passwordre;

  console.log(name, email, password);

  let errors = [];

  if (password !== passwordre) {
    errors.push({ message: "Passwords does not match!!!!" });
  }

  if (password.length < 5) {
    errors.push({ message: "Password too short, must be greater (>5)" });
  }

  if (!name || !email || !password || !passwordre) {
    errors.push({ message: "Please correctly enter all the fields" });
  }
  if(errors.length > 0) {
    res.render("pages/register", {errors});
  }else {
  var protectedpassword = await bcrypt.hash(password, 8);


  pool.query(
    `SELECT * FROM usrs WHERE email = $1`,
    [email],
    (error, results) => {
    if (error) {
      throw error;
    }
    console.log(results.rows);

    if( results.rows.length > 0) {
        errors.push({ message: "Email already registered!" });
        res.render("pages/register", {errors});
      }else {
        pool.query(
         `INSERT INTO usrs(name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, password`,
          [name, email, protectedpassword],
          (error,results) => { if (error) {
            throw error;
          }
          console.log(results.rows);
          req.flash("success_msg", "User registered successfully, Please login...");
          res.redirect("/login");
        }
      );
    }
  }
  );
}
});


//compares the provided email and password with the one in the database
//and gives access to the game main page and handles the error uses passport dependency.
function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    pool.query(
      `SELECT * FROM usrs WHERE email = $1`,
      [email],
      (error, results) => {
      if (error) {
        throw error;
      }
      if(results.rows.length > 0){
        console.log(results.rows[0]);
        const user = results.rows[0];
        bcrypt.compare(password, user.password, (error, result) =>{
          if(error){
            throw error;
          }
          if(result == true){
            return done(null, user);
          }
          if(result == false){
            return done(null, false, {message: "password is incorrect!!"});
          }

        });
      }else{
        return done(null, false, {message: "User not found. Please register!!!"});
      }
    }
  );
};
//addresses the local Strategy used to search in the database.
// and calls the authenticate function.
  passport.use(
    new LocalStrategy({
      usernameField: "email"
    },
    authenticateUser
  )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) =>{
    pool.query(
      `SELECT * FROM usrs WHERE id = $1`,
      [id],
      (error, results)=>{
        if(error){
          throw error;
        }
        return done(null, results.rows[0]);
      });
  });
}


// uses passport to check the authentication and
//if success directs to gamehome page otherwise to the login page.
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/gamehome",
  failureRedirect: "/login",
  failureFlash: true
})
);


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
   return res.redirect("/gamehome");
  }
    next();
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
