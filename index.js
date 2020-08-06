const express = require('express')
const path = require('path')
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const passprt = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var cors = require('cors');

initialize();


const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  //connectionString: 'postgres://postgres:2590@localhost/logindb'
  //connectionString: process.env.DATABASE_URL
  connectionString: 'postgres://postgres:root@localhost:5432/logindb'
})

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var sessionStore = new session.MemoryStore();
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false, store: sessionStore }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passprt.initialize());
app.use(passprt.session());
app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', checkNotAuthenticated, (req, res) => res.render('pages/index'));

//ROUTING
//renders to the register page in the views/pages.
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("pages/register");
});

app.get("/adminregister", checkNAuthenticated, (req, res) => {
  res.render("pages/adminRegister");
});


//renders to the login page in the views/pages.
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("pages/login");
});

app.get("/search", (req, res) => {
  res.render("pages/search");
});

app.get("/delete", (req, res) => {
  res.render("pages/delete");
});


//renders to the room (game) main page in the views/pages.
app.get("/gamehome", (req, res) => {
  res.redirect(301, "menu.html");
});

app.get("/adminlogin", checkNAuthenticated, (req, res) => {
  res.render("pages/adminlogin");
});

app.get("/admin", (req, res) => {
  res.render("pages/admin");
});



// logout the user and redirects to the login page.
app.get("/logout", checkAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out successfully");
  res.redirect("/login");
});

app.get("/log-out", checkAAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out successfully");
  res.redirect("/adminlogin");
});

app.get('/database', checkNAuthenticated, (req, res) => {
  var getusers = 'SELECT * FROM loginusers';
  pool.query(getusers, (error, result) => {
    if (error)
      res.end(error);
    var results = { 'rows': result.rows }
    res.render('pages/db', results);
  })
});


//Searchs and prints user with that id.
app.get('/searchUser', (req, res) => {
  var id = req.query.id;

  let errors = [];

  pool.query(
    `SELECT * FROM loginusers WHERE id = $1`,
    [id],
    (error, result) => {
      if (error) {
        throw error;
      }

      if (result.rows.length == 0) {
        errors.push({ message: "User doesnot exist!!" });
        res.render("pages/search", { errors });
      } else {
        var results = { 'rows': result.rows }
        res.render('pages/db', results);
      }

    });
});

app.get('/home', (req, res) => {
  if (req.isAuthenticated()) {
    var username = req.user.name;
    res.sendFile(path.join(__dirname, '/public', 'menu.html'));
  }
  else {
    res.send("not authenticated");
  }
});

const roomManager = require('./utils/ioManager.js');
app.get('/createroom', (req, res) => {
  var roomString = roomManager.generateNewRoom();
  res.redirect(`/room.html?${roomString}`);
});

app.get('/joinroom', (req, res) => {
  var roomId = req.query.roomCodeName;
  if (isRoom(roomId)) {
    res.redirect(`/room.html?${roomId}`);
  }
  else {
    res.send("Room does not exist.");
  }
});


//
app.post('/deleteUser', (req, res) => {
  var id = req.body.id;

  let errors = [];
  if (id > 0) {
    pool.query(
      `SELECT * FROM loginusers WHERE id = $1`,
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows.length == 0) {
          errors.push({ message: "User does not exist!!" });
          res.render("pages/delete", { errors });
        } else {
          pool.query(
            `delete FROM loginusers WHERE id = $1`,
            [id],
            (error, results) => {
              if (error) {
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
  if (errors.length > 0) {
    res.render("pages/register", { errors });
  } else {



    pool.query(
      `SELECT * FROM loginusers WHERE email = $1`,
      [email],
      (error, results) => {
        if (error) {
          throw error;
        }

        if (results.rows.length > 0) {
          errors.push({ message: "Email already registered!" });
          res.render("pages/register", { errors });
        } else {
          pool.query(
            `INSERT INTO loginusers(name, email, password, type)
         VALUES ($1, $2, $3, $4)
         RETURNING id, password`,
            [name, email, password, type],
            (error, results) => {
              if (error) {
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
app.post("/adminregister", checkNAuthenticated, async (req, res) => {
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

  if (errors.length > 0) {
    res.render("pages/adminRegister", { errors });
  } else {


    if (aadmin == type || publicc == type) {
      pool.query(
        `SELECT * FROM loginusers WHERE email = $1`,
        [email],
        (error, results) => {
          if (error) {
            throw error;
          }

          if (results.rows.length > 0) {
            errors.push({ message: "Email already registered!" });
            res.render("pages/adminRegister", { errors });
          } else {
            pool.query(
              `INSERT INTO loginusers(name, email, type, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, password`,
              [name, email, type, password],
              (error, results) => {
                if (error) {
                  throw error;
                }
                console.log(results.rows);
                req.flash("success_msg", "User registered successfully");
                res.redirect("/adminRegister");
              });
          }
        });
    }
    else {
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
    }, (email, password, done) => {
      pool.query(
        `SELECT * FROM loginusers WHERE email = $1`,
        [email],
        (error, results) => {
          if (error) {
            throw error;
          }
          if (results.rows.length > 0) {
            let user = results.rows[0];
            if (password == user.password) {
              return done(null, user);
            } else {
              return done(null, false, { message: "password is incorrect!!" });
            }
          } else {
            return done(null, false, { message: "User not found. Please register!!!" });
          }
        }
      );
    }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    pool.query(
      `SELECT * FROM loginusers WHERE id = $1`,
      [id],
      (error, results) => {
        if (error) {
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


app.post("/adminlogin", checkNAuthenticated, (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;
  pool.query(
    `SELECT * FROM loginusers WHERE email = '${email}'`,
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length > 0) {
        let user1 = results.rows[0];
        let usertype1 = 'admin';
        if (pass == user1.password && usertype1 == user1.type) {
          res.render("pages/admin");
        }
        else {
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
function checkDAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/admin");
  }
  return res.redirect("/adminlogin");
}

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

//Require socket.io for multiplayer
var io = require('socket.io').listen(server);
//Require passport.socketio to auth user
var passportIo = require('passport.socketio');
//Manages players in a game instance
const playerManager = require('./utils/playerManager.js');
const { isRoom } = require('./utils/ioManager.js');
const { authorize } = require('passport');

//Get socket.io to use passport authentication
io.use(passportIo.authorize({
  secret: 'secret',
  store: sessionStore,
  success: onAuthorizationSuccess,
  fail: onAuthorizationFail
}));

//If authorization succeeds allow the connection
function onAuthorizationSuccess(data, accept) {
  //console.log(data);
  //console.log(accept);
  console.log("Connection accepted");
  accept();
}

//If auth fails reject connection
function onAuthorizationFail(data, message, error, accept) {
  //console.log(data);
  //console.log(accept);
  console.log("Connection rejected");
  if (error) {
    accept(new Error(message));
  }
}

//When a user connects check which room they want to join and create a user and room if needed
io.on('connection', function (socket) {
  console.log("a user connected");
  socket.on('joinRoom', function (roomId) {
    var user = roomManager.userJoin(socket.id, socket.request.user.name, roomId);
    socket.join(user.room);
    console.log(`a ${user.name} joined room ${user.room}`);
    io.to(user.room).emit('lobbyJoin', user);
    var roomPlayerList = io.sockets.adapter.rooms[user.room];
    if (typeof roomPlayerList !== 'undefined') {
      //console.log(Object.keys(roomPlayerList.sockets));
      let getPlayerList = Object.keys(roomPlayerList.sockets);
      var usersInRoom = [];
      for (let i = 0; i < getPlayerList.length; i++) {
        if (getPlayerList[i] != socket.id) {
          usersInRoom.push(roomManager.getUser(getPlayerList[i]));
        }
      }
      io.to(socket.id).emit('getPlayers', usersInRoom);
    }
  });
  //put the user into the correct game instance depending on their roomid
  socket.on('joinGame', function (roomId) {
    var user = roomManager.userJoin(socket.id, socket.request.user.name, roomId);
    playerManager.addPlayer(socket.id, roomId, user.name);
    socket.join(user.room);
    //console.log(`a ${user.name} joined game ${user.room}`);
    socket.emit('spawnPos', playerManager.getPlayer(socket.id));
    socket.emit('listOfPlayers', playerManager.getPlayerList());
    //console.log('player = ', playerManager.getPlayerList());
    socket.to(user.room).emit('playerJoin', playerManager.getPlayer(socket.id));
  });
  //send all players from the room to the game
  socket.on('playGame', function(readyPlayers) {
    //TODO check if everyone is ready then go
    io.in(roomManager.getUser(socket.id).room).emit('game-start');
    var room = roomManager.getUser(socket.id).room
    setTimeout(function() {
      console.log('over');
      console.log(room);
      io.in(room).emit('game-over');
    }, 130000);
  });
  socket.on('disconnect', function () {
    //console.log(socket.request.user);
    //console.log(socket.id);
    var user = roomManager.userLeave(socket.id);
    //console.log(user);
    if (user) {
      console.log(`a ${user.name} disconnected`);
      io.to(user.room).emit('lobbyLeave', user);
      socket.to(user.room).emit('playerLeave', playerManager.getPlayer(socket.id));
      playerManager.removePlayer(socket.id);
      //console.log(io.sockets.adapter.rooms[user.room]);
    }
  });
  //Send player movement data to certain game instance/room
  socket.on('playerMoved', function(playerPosition) {
    playerManager.setPlayerX(socket.id, playerPosition.x);
    playerManager.setPlayerY(socket.id, playerPosition.y);
    socket.to(playerPosition.roomId).emit('movePlayer', playerManager.getPlayer(socket.id));
  });
  socket.on('throwAxe', function(axeInfo) {
    position = axeInfo.position;
    id = axeInfo.id;
    socket.to(roomManager.getUser(socket.id).room).emit('axeThrow', {position, id});
  });
  socket.on('killed', function() {
    socket.to(roomManager.getUser(socket.id).room).emit('playerKilled', socket.id);
  });
  socket.on('respawn', function() {
    socket.to(roomManager.getUser(socket.id).room).emit('playerRespawn', socket.id);
  });
});

module.exports = app;
