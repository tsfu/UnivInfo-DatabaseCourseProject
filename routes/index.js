var express = require('express');

// connect mongoose
//mongoose.connect("mongodb+srv://Janice:123abc@cluster0-eendv.mongodb.net/test?retryWrites=true");

var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'fling.seas.upenn.edu',
  user: 'kengpian',
  password: '550project!',
  database: 'test'
});

var city="";
var state = "";
var i = 3;

// Connect string to MySQL

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'));
});

router.get('/dashboard', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'));
});

router.get('/results', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'results.html'));
});

router.get('/uprofile', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'uprofile.html'));
});


router.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
});


// oracle version

// var oracledb = require('oracledb');


// router.get('/dashboard/:school', function(req, res){
//   var school = req.params.school;
//   console.log("school="+school+"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  // var query = "SELECT A1.chronname as name, website, control, yearlevel, LH.tuition as tuition, LH.city as city, avg_housing_rate from (SELECT chronname, unitid, yearlevel, control, website FROM university WHERE chronname = '%"+ school +"%' as A1, awards_tuition AT, (SELECT * from location L , housing H where L.city = H.city and L.statename = H.statename) as LH where A1.unitid = AT.unitid and A1.unitid = LH.unitid;";
  // connection.query(query, function(err, rows) {
  //   console.log("rows="+rows+"!!!");
  //   if (err) console.log(err);
  //   else {
  //        res.json(rows);
     
  //     }
  // });

//   oracledb.getConnection(
//  {
//   user: 'kengpian',
//   password: 'project550',
//   connectString: 'cis550project.czgstkqm3tfs.us-east-2.rds.amazonaws.com'
//  },
 
//  function(err, connection)
//  {
//    if (err) { console.error(err); return; }
//    console.log("Connected!!!!!!!!!!!!!!!!");
//    connection.execute(
//      "select * from (select unitid, chronname, website, control from university where UPPER(chronname) like UPPER('%"+school+"%')) A natural join location L;",
//      function(err, result)
//      {
//        if (err) { console.error(err); return; }
//        console.log(result);
//        res.json(result);     
//      });
//  }
//  );
// });




router.get('/showResults/:school', function(req, res){
  var school = req.params.school;
  console.log("school="+school+"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  var query =  "select * from (select unitid, chronname, website, control from university where UPPER(chronname) like UPPER('%"+school+"%')) A natural join location L;";
  connection.query(query, function(err, rows) {
    console.log("rows="+rows+"!!!");
    if (err) console.log(err);
    else {
      res.json(rows);
      }
  });
});


router.get('/advResults', function(req, res){
  var type = req.query.t;
  var state = req.query.l;
  var cost = req.query.c;
  var ranking = req.query.r;
  console.log("filter set = "+ type + state + cost + ranking + "!!!!!!!!!");

  // quert parts
  var str1 = "SELECT * FROM ( SELECT * FROM university "
  var str2 = "NATURAL JOIN (SELECT unitid, chronname, flagship, website FROM university WHERE flagship = " + type + ")AS F1 "
  var str3 = "NATURAL JOIN (SELECT * FROM location WHERE statename = '" + state + "')AS F2 "
  var str4 = "NATURAL JOIN (SELECT unitid, chronname, tuition FROM award_tuition WHERE tuition < " + cost + ")AS F3 "
  var str5 = "NATURAL JOIN (SELECT * FROM rank WHERE Rank < " + ranking + ")AS F4 "
  var str6 = ")AS F LIMIT 5;"

  // if user leave some filter as blank:
    if(type == null){
    str2 = "";
  }
    if(state == null){
    str3 = "";
  }
    if(cost == null){
    str4 = "";
  }
    if(ranking == null){
    str5 = "";
  }

  // final query 
  var query = str1 + str2 + str3 + str4 + str5 + str6;
  
  connection.query(query, function(err, rows) {
    console.log("!!!!!Picked Results!!!!!! = " + rows);
    if (err) console.log(err);
    else {
      res.json(rows);
      }
  });

});


router.get('/showProfile/:uid', function(req, res){
  var school = req.params.uid;
  
  var query =  "SELECT * FROM (SELECT * FROM test.university WHERE unitid = "+school+") A1 NATURAL JOIN test.location NATURAL JOIN test.housing NATURAL JOIN test.award_tuition ;";
  connection.query(query, function(err, rows) {
    console.log("rows="+rows+"!!!");
    if (err) console.log(err);
    else {
      res.json(rows);
      }
  });
});

router.get('/showRecom1/:uid', function(req, res){
  var uid = req.params.uid;
  
  var query =  "SELECT * FROM(SELECT * FROM test.university u NATURAL JOIN test.award_tuition a WHERE a.tuition between 0.98*37362 AND 1.02*37362 AND u.unitid != "+uid+") tmp LIMIT 1;";
  connection.query(query, function(err, rows) {
    console.log("rows="+rows+"!!!");
    if (err) console.log(err);
    else {
      res.json(rows);
      }
  });
});


router.get('/showRecom2/:uid', function(req, res){
  var uid = req.params.uid;
  console.log(uid+"!!");
  
 
    var query1 = 'SELECT * FROM test.university natural join test.location where unitid="'+uid+'"';
    connection.query(query1, function(err, rows, city, state){
      console.log("Recom2 rows="+rows+"!!!");
      if (err) console.log(err);
      else {
        state  = rows[0].statename;
        city = rows[0].city;
        res.json(rows);
        }
    });
  
  
  
});

router.get('/showRecom22/:uid', function(req, res){


   console.log("state="+state);
    var query2 =  'SELECT * FROM (SELECT * FROM test.university u NATURAL JOIN test.location l WHERE l.city = "'+city+'" AND l.statename = "'+state+'" AND u.unitid != '+ uid +') tmp;';
    connection.query(query2, function(err, rows) {
      console.log("Recom22 rows="+rows+"!!!");
      if (err) console.log(err);
      else {
        res.json(rows);
        }
    });
});

/*router.get('/showRecom3/:uid', function(req, res){
  var uid = req.params.uid;
  var rank=0;

  var query1 = "SELECT * FROM test.university natural join test.rank where unitid="+uid+";";
  connection.query(query1, function(err, rows){
    if (err) console.log(err);
    else {
        console.log("Recom3 "+rows[0]);
        rank=Number(rows[0].Rank);
        console.log(rank+"!!!!!!!!!!!!!!!");
      }
  });

  var query2 =  "SELECT * FROM (SELECT * FROM test.university u NATURAL JOIN test.rank r WHERE r.Rank BETWEEN" + (rank-5) + "AND" + (rank+5) + "AND u.unitid !="+ uid + ")tmp;";
  connection.query(query2, function(err, rows) {
    console.log("rows="+rows+"!!!");
    if (err) console.log(err);
    else {
      res.json(rows);
      }
  });

});
*/


// To add a new page, use the templete below


// // template for GET requests
// /*
// router.get('/routeName/:customParameter', function(req, res) {

//   var myData = req.params.customParameter;    // if you have a custom parameter
//   var query = '';

//   // console.log(query);

//   connection.query(query, function(err, rows, fields) {
//     if (err) console.log(err);
//     else {
//       res.json(rows);
//     }
//   });
// });
// */


module.exports = router;
