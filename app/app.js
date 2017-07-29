var express    = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app        = express();
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var router = express.Router();
var User   = require('./models/user');
var async = require('async');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/userReg');

app.use("/public", express.static('public'));

app.get('/setup', function(req, res) {

  var rajat = new User({
    name: 'Rajat',
    rollnumber: 'pass'
  });
  rajat.save(function(err) {
    if (err) throw err;

    console.log('User1 saved successfully');
    res.json({ success: true });
  });
});

//Hit the url -> http://localhost:3000/api/
app.get('/', function(req, res) {
    res.render('index', { title: 'Registration App' });
    //res.json({ message: 'hooray! welcome to our api!' });
});

//
router.route('/register')
.post( function(req, res) {
  console.log(req.body);
  var team = req.body.teamname;
  var roll1= req.body.entry1;
  var names1 = req.body.name1;
  var roll2 = req.body.entry2;
  var names2 = req.body.name2;
  var roll3 = req.body.entry3 || 'default';
  var names3 = req.body.name3 || 'default';
  var user1 = new User({
    name: names1,
    rollnumber: roll1,
    teamname:team

  });
  var user2 = new User({
    name: names2,
    rollnumber: roll2,
    teamname:team
  });
  var user3 = new User({
    name: names3,
    rollnumber: roll3,
    teamname:team
  });

var rollArray=[roll1,roll2,roll3];
if(roll3=='default'){
  console.log("roll3 is default")
  rollArray=[roll1,roll2];
}
    User.find({rollnumber:{$in:rollArray }}, function(err, users) {
        if (err)
        {
            res.send(err)
        }
        console.log(users);
        if (users.length==0){
            //save all users
            var people = [ user1, user2, user3];
            if(user3.name=='default'){
              people = [ user1, user2];
            }

            async.eachSeries(people, function(user, asyncdone) {
              user.save(asyncdone);
            }, function(err) {
              if (err) return console.log(err);
              //done(); // or `done(err)` if you want the pass the error up
              res.json({ RESPONSE_SUCCESS:'1', RESPONSE_MESSAGE: 'Registration completed'});
            });

        }else{
            res.json({RESPONSE_SUCCESS:'0',RESPONSE_MESSAGE: 'User already registered'});
        }
    });

});

//


router.route('/users')
.get( function(req, res) {
  User.find({}, function(err, users) {
    res.json({Users : users});
  });

})
.post( function(req, res) {
    User.findOne({name:req.body.user_name}, function(err, userN) {
        if (err)
        {
            res.send(err)
        }
    if (userN==null){
        var user = new User();
              user.name = req.body.user_name || 'default',
              user.rollnumber = req.body.roll_number || 'default',
        user.save(function(err) {
            if (err){
                res.send(err);
            }

            res.json({ message: 'user created!', User: user});
        });
    }else{
        res.json({message:'user Already exist',User: user});
    }
    });

});

router.route('/find_user')
.post( function(req, res) {

  User.findOne({name:req.body.user_name}, function(err, user) {
      if (err)
      {
          res.send(err)
      }
if(user!=null){
      res.json({User:user});
  }else{
      res.json({message:'user not exist'});
  }
  });
});
router.route('/find_user/:roll')
.get( function(req, res) {

  User.findOne({rollnumber:req.params.roll,teamname:req.query.teamName}, function(err, user) {
      if (err)
      {
          res.send(err)
      }
if(user!=null){
      res.json({User:user});
  }else{
      res.json({message:'user not exist'});
  }
  });
});
router.route('/delete_user')
.post(function(req, res)
{
    User.findOne({name:req.body.user_name,rollnumber:req.body.roll_number}, function(err, user) {
        if (err)
        {
            res.send(err)
        }
        if(user!=null){
        user.remove(function(err) {
            if (err) throw err;
        res.json({message:'User successfully deleted!'});
    //console.log('User successfully deleted!');
        });
    }else{
        res.json({message:'Username or password incorrect'});
    }
      //res.json(user);
    });
});

router.route('/delete_all')
.get(function(req, res)
{
    User.remove({}, function(err, users) {
        if (err)
        {
            res.send(err)
        }
        res.json({message:'All Users successfully deleted!'});
    });
});

app.use('/api', router);
app.listen(3000);
console.log('Magic happens on port 3000');
