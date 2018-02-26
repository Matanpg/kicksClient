const express = require('express');
const expressSession = require('express-session');
const router = express.Router();
const Sequelize = require('sequelize');

const Projects = require('./models/projects');
const Fields = require('./models/fields');
const Users = require('./models/users');

module.exports = router;

// get all projects
router.get('/projects', (req, res) => {
  Projects.findAll({}).then(projects => {
    res.json(projects);
    })
  });

// get specific project
router.get('/project/:projid', (req, res) => {
  Projects.find({where: {id: req.params.projid}}).then(projects => {
    res.json(projects);
    })
  });

// get projects for specific user
router.get('/projects/user', async (req, res) => {
  let userId = await req.session.userId;
  Projects.findAll({where: {user_id: userId}}).then(projects => {
    res.json(projects);
    })
  });

// Fund a project
router.put('/project/:projid', (req, res) => {
  let currentBalance = 0;
  const sum = req.body.fundingFromUser;
  const projid = req.params.projid;

  async function a() {
    currentBalance = await Projects.findOne({where: {id: projid}});
    newBalance = currentBalance.dataValues.totalFunds + sum;
    await Projects.update(
          {totalFunds: newBalance},
          {where: {id: req.params.projid}}
        );
    await Projects.SP_update_status(projid);
    res.sendStatus(200);
      };
  a();
  });

// count all projects
router.get('/countprojects', (req, res) => {
  Projects.count().then(projectsNum => {
    res.json(projectsNum);
    })
  });

// count projects with funding
router.get('/countfundedprojects', (req, res) => {
  Projects.count({where: {totalFunds: {[Sequelize.Op.ne]: 0}}})
  .then(projectsNum => {
    res.json(projectsNum);
    })
  });


// create new project
router.post('/startProject', (req, res) => {
  const name = req.body.name;
  const field = req.body.field;
  const description = req.body.description;
  const fundingTarget = req.body.fundingTarget;
  const user_id = req.session.userId;
  const pic = req.body.picBig;
  let removeQutes = new Promise((resolve, reject) => {
      let slicedPic = pic.slice(1,-1);
      resolve(slicedPic);
      reject(error);
    })
    .then((picture_big) => {
      Projects.create({name, field, description, fundingTarget, user_id, picture_big})
      .then((x) => {
            let a = x.get('id');
            res.json(x);
        })
      })
    .catch((err) => {
          res.sendStatus(500);
      })
  });

// get project 'field' values from mongo
router.get('/fields', (req, res) => {
  Fields.getFields((err, fields) => {
    if(err){
      throw err;
    }
    res.json(fields);
  });
});


// create new user in mongo
router.post('/createUser', (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let userName = req.body.userName;
  let email = req.body.email;
  let password = req.body.password;
  let type = 'basic';
  
  let dbUser;
  
  async function a() {
    dbUser = await Users.getUsers({user_name: userName});
    if (dbUser[0] != undefined) {
      res.sendStatus(401)
    } else {
     await Users.createUser(
            {
              first_name: firstName,
              last_name: lastName,
              user_name: userName,
              email: email,
              password: password,
              type: type
          }
        )
      res.sendStatus(200)
    }
  }

  a();

});


  // get all users from mongo
router.get('/users', (req, res) => {
  Users.getUsers((err, users) => {
    if(err){
      throw err;
    }
    res.json(users);
  });
});

  // get specific user from mongo
router.get('/user', async (req, res) => {
  let userId = await req.session.userId;

  let t = await Users.getUsers({_id: userId});
  res.json(t[0]);
  });

// get number of users from mongo
router.get('/countusers', (req, res) => {
  Users.count((err, users) => {
    if(err){
      throw err;
    }
    res.json(users);
  });
});


  