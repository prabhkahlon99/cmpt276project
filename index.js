const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const passprt = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var cors = require('cors');
const jwt = require('jsonwebtoken');

initialize();


const PORT = process.env.PORT || 5000

//connect to database
const { Pool } = require('pg');
var pool;
pool = new Pool({
   connectionString: 'postgres://postgres:2590@localhost/logindb'
  //connectionString: process.env.DATABASE_URL
  //connectionString: 'postgres://postgres:root@localhost:5432/logindb'
})

//middlewares
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'secret',resave: false, saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passprt.initialize());
app.use(passprt.session());
app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', checkNotAuthenticated, (req, res) => res.render('pages/index'));



//renders to the register page in the views/pages.
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("pages/register");
});

app.get("/reset",(req, res) => {
  res.render("pages/reset");
});

app.get("/adminregister", checkNAuthenticated, (req, res) => {
  res.render("pages/adminRegister");
});


//renders to the login page in the views/pages.
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("pages/login");
});

app.get("/search",(req, res) => {
  res.render("pages/search");
});

app.get("/delete",(req, res) => {
  res.render("pages/delete");
});


//renders to the game main page in the views/pages.
app.get("/gamehome", (req, res) => {
  res.redirect(301, "game.html");
});

app.get("/adminlogin",checkNAuthenticated, (req, res) => {
  res.render("pages/adminlogin");
});

app.get("/admin", (req, res) => {
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

app.get('/database', checkNAuthenticated, (req, res) => {
  var getusers = 'SELECT * FROM loginusers';
  pool.query(getusers, (error,result) => {
    if (error)
      res.end(error);
    var results = {'rows':result.rows}
    res.render('pages/db', results);
  })
});


//Searchs and prints user with that id.
app.get('/searchUser',(req, res) => {
  var id = req.query.id;

  let errors = [];

  pool.query(
    `SELECT * FROM loginusers WHERE id = $1`,
    [id],
    (error, result) => {
    if (error) {
      throw error;
    }

    if( result.rows.length == 0) {
        errors.push({ message: "User doesnot exist!!" });
        res.render("pages/search", {errors});
    }else {
      var results = {'rows':result.rows}
      res.render('pages/db', results);
    }

});
});


//
app.post('/deleteUser',(req, res) => {
  var id = req.body.id;

  let errors = [];
  if( id > 0){
    pool.query(
      `SELECT * FROM loginusers WHERE id = $1`,
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        if( results.rows.length == 0) {
          errors.push({ message: "User doesnot exist!!" });
          res.render("pages/delete", {errors});
        }else {
          pool.query(
            `delete FROM loginusers WHERE id = $1`,
            [id],
            (error,results) => { if (error) {
              throw error;
            }
            req.flash("success_msg", "User deleted successfully...");
            res.render('pages/delete', results);
          }
        );
      }
    });
  } else {
    req.flash("success_msg", "Sorry, Cannot delete the main user!!!");
    res.render('pages/delete');
  }
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

//admin add getusers
app.post("/adminregister", verifyToken, async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let type = req.body.type;
  let password = req.body.password;
  let passwordre = req.body.passwordre;
  let aadmin = 'admin';
  let publicc = 'public';


  console.log(name, email, type, password);

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
    res.render("pages/adminRegister", {errors});
  }else {


  if(aadmin == type || publicc == type){
    pool.query(
      `SELECT * FROM loginusers WHERE email = $1`,
      [email],
      (error, results) => {
        if (error) {
          throw error;
        }

        if( results.rows.length > 0) {
          errors.push({ message: "Email already registered!" });
          res.render("pages/adminRegister", {errors});
        }else {
          pool.query(
            `INSERT INTO loginusers(name, email, type, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, password`,
            [name, email, type, password],
            (error,results) => { if (error) {
              throw error;
            }
            console.log(results.rows);
            req.flash("success_msg", "User registered successfully");
            res.redirect("/adminRegister");
          });
        }
      });
    }
    else{
      req.flash("success_msg", "Please specify the type from admin or public!!");
      res.render("pages/adminRegister");
    }
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

// uses passport to check the authentication and
//if success directs to gamehome page otherwise to the login page.
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {

successRedirect: "/gamehome",
failureRedirect: "/login",
failureFlash: true
})
);


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
      const user1 = results.rows[0];
      const usertype1 = 'admin';
      if(pass == user1.password && usertype1 == user1.type){
        const token = jwt.sign({ user1 }, 'secretkey');
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

function verifyToken(req, res, next){

  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    // Forbidden
    res.json({message:'Access not allowed'});
  }

}


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

module.exports = app;
