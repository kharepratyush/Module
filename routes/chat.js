var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var mysqlConnect = mysql.createConnection({
  host     : 'localhost',
  user     : 'dezyre_user',
  password : 'omair123!',
  port : '3306',
  database : 'dezyre_db'
}); 

mysqlConnect.connect(function(err){
  if(err)
    console.log(err);
  else
    console.log("Chat Connected to Database");
});

//gid from authentication
var gid=0;

var msgs_data;

router.get('/', function(req, res, next) {

  mysqlConnect.query("select user_id,message from project_chat where group_number=? order by project_chat_id desc limit 50",[gid],function(err,rows,fields)
{
  if(err)
  {
          console.log(err);
  }
  else
  {
      
      //console.log(rows);
      //console.log(fields);

      
          res.render('chats',{ uid: 9,gid:gid,rows :rows});
    //send data of questions to forum page and make a link of all questions
      

  }
});
});
//console.log(msgs_data);



module.exports = router;
