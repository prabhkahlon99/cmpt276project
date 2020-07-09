const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const passprt = require('passport');
const LocalStrategy = require('passport-local').Strategy;

initialize();


const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: 'postgres://postgres:2590@localhost/logindb'
})

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'secret',resave: true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passprt.initialize());
app.use(passprt.session());
app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', checkNotAuthenticated, (req, res) => res.render('pages/index'));
app.get('/', checkNAuthenticated, (req, res) => res.render('pages/index'));

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

app.get("/adminlogin",checkNAuthenticated, (req, res) => {
  res.render("pages/adminlogin");
});

app.get("/admin", checkAAuthenticated, (req, res) => {
  res.render("pages/admin");
});



// logout the user and redirects to the login page.
app.get("/logout", checkAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out successfully" );
  res.redirect("/login");
});

app.get("/log-out", checkAAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out successfully" );
  res.redirect("/adminlogin");
});

app.get('/database', (req, res) => {
  var getusers = 'SELECT * FROM loginusers';
  pool.query(getusers, (error,result) => {
    if (error)
      res.end(error);
    var results = {'rows':result.rows}
    res.render('pages/db', results);
  })
});

//registers the user in the database and handles the errors and success.
app.post("/register", checkNotAuthenticated, async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let passwordre = req.body.passwordre;
  let type = 'public';

  console.log(name, email, password, type);

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



  pool.query(
    `SELECT * FROM loginusers WHERE email = $1`,
    [email],
    (error, results) => {
    if (error) {
      throw error;
    }

    if( results.rows.length > 0) {
        errors.push({ message: "Email already registered!" });
        res.render("pages/register", {errors});
      }else {
        pool.query(
         `INSERT INTO loginusers(name, email, password, type)
         VALUES ($1, $2, $3, $4)
         RETURNING id, password`,
          [name, email, password, type],
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

// initialize();
//compares the provided email and password with the one in the database
//and gives access to the game main page and handles the error uses passport dependency.
//addresses the local Strategy used to search in the database.
// and calls the authenticate function.
function initialize() { //user
  passport.use(
    new LocalStrategy({
      usernameField: "email"
    },(email, password, done) => {
    pool.query(
      `SELECT * FROM loginusers WHERE email = $1`,
      [email],
      (error, results) => {
      if (error) {
        throw error;
      }
      if(results.rows.length > 0){
        let user = results.rows[0];
        if(password == user.password){
            return done(null, user);
          }else{
            return done(null, false, {message: "password is incorrect!!"});
          }
      }else{
        return done(null, false, {message: "User not found. Please register!!!"});
      }
    }
  );
}
)
);

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) =>{
    pool.query(
      `SELECT * FROM loginusers WHERE id = $1`,
      [id],
      (error, results)=>{
        if(error){
          throw error;
        }
        return done(null, results.rows[0]);
      });
  });
}


// function initialise() { //admin
//   passprt.use(
    // new LocalStrategy({
    //   usernameField: "email"
    // },(email, password, done) => {
    // pool.query(
    //   `SELECT * FROM loginusers WHERE email = $1`,
      // [email],
      // (error, results) => {
      // if (error) {
      //   throw error;
      // }
      // if(results.rows.length > 0){
      //   let user1 = results.rows[0];
      //   let usertype1 = 'admin';
      //   if(password == user1.password && usertype1 == user1.type){
      //       return done(null, user1);
      //     }else{
      //       return done(null, false, {message: "Access not allowed!!!!"});
      //     }
//       }else{
//         return done(null, false, {message: "User not found. Please register!!!"});
//       }
//     }
//   );
// }
// )
// );
//
//   passprt.serializeUser((user1, done) => done(null, user1.id));
//   passprt.deserializeUser((id, done) =>{
//     pool.query(
//       `SELECT * FROM loginusers WHERE id = $1`,
//       [id],
//       (error, results)=>{
//         if(error){
//           throw error;
//         }
//         return done(null, results.rows[0]);
//       });
//   });
// }




// uses passport to check the authentication and
//if success directs to gamehome page otherwise to the login page.
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {

successRedirect: "/gamehome",
failureRedirect: "/login",
failureFlash: true
})
);
// initialise(passprt);
// app.post("/adminlogin", checkNAuthenticated, passprt.authenticate("local", {
//
// successRedirect: "/admin",
// failureRedirect: "/adminlogin",
// failureFlash: true
// })
// );

app.post("/adminlogin", checkNAuthenticated, (req,res) => {
  const email = req.body.email;
  const pass = req.body.password;
  pool.query(
    `SELECT * FROM loginusers WHERE email = '${email}'`,
    (error, results) => {
    if (error) {
      throw error;
    }
    if(results.rows.length > 0){
      let user1 = results.rows[0];
      let usertype1 = 'admin';
      if(pass == user1.password && usertype1 == user1.type){
          res.render("pages/admin");
        }
        else{
          req.flash("success_msg", "Access not allowed!!!!");
          res.render("pages/adminlogin");

        }
      }
  });

});


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

function checkAAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/adminlogin");
}

function checkNAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
   return res.redirect("/admin");
  }
    next();
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
