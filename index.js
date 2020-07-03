const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));

app.get("/users/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/users/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/users/logout", (req, res) => {
  req.logout();
  res.render("index", { message: "You have logged out successfully" });
});



app.post("/users/register", async (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var passwordre = req.body.passwordre;

  let error = [];

  if (password !== passwordre) {
    error.push({ message: "Passwords do not match!!!!" });
  }

  if (password.length < 5) {
    error.push({ message: "Password too short, must be greater >5" });
  }

  if (!name || !email || !password || !passwordre) {
    error.push({ message: "Please enter all the fields properly" });
  }

});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
