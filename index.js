const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');
const Sequelize = require('sequelize');

const dbMySql = require('./dbMySql');
const routes = require('./routes');
const Users = require('./models/users');

function checkAuth(req, res, next) {
  if (
    req.url !== '/login' &&
   (!req.session || !req.session.authenticated)) {
    res.sendStatus(403);
    return;
  }

  next();
}

// app.use(express.static('kicksClient/dist'));
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
app.use(expressSession({
  key: expressSession.sid,
  secret: 'shhhh'
  }));

app.use(bodyParser.json());


app.use('/', routes);

app.get('/logedIn', (req, res) => {
  res.json({ok: req.session.authenticated ? true : false});
});

app.post('/login', async (req, res) => {
  let inputName = req.body.username;
  let inputPassword = req.body.password;
  let dbPassword = '';
  let userId = 'baa';

  let t = await Users.getUsers({user_name: inputName});
  dbPassword = t[0].password;
  userId = t[0]._id.toString();

  if (inputPassword === dbPassword) {
    req.session.authenticated = true;
    req.session.userId = userId;
    req.session.username = inputName;
    req.session.save();
    res.json({ok: true});
  } else {
    res.json({ok: false});
  };
  });

app.get('/logout', (req, res) => {
  delete req.session.authenticated;
  delete req.session.userId;
  res.sendStatus(204);
});

app.listen(8080, () => {
  console.log('server listening on port 8080');
})


