	
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'dezyre_user',
	password : 'omair123!',
	database : 'dezyre_db',
	table : 'project_question'
});

var app = express();

connection.connect(function(err){
if(!err) {
    console.log("Forum connected to database");  
} else {
    console.log(err);  
}
});

router.get('/', function(req,res){
	connection.query('SELECT question,project_question_id,vote_count,upvoteflag FROM project_question', function(err, fields){
		if(err)
                console.log("Error Selecting : %s ",err );
     
     		//console.log(fields[0]);
            res.render('forum',{title:"Questions",data:fields});

	});
});

router.post('/', function(req, res, next) 
{
	console.log(req.body);

	var input = JSON.parse(JSON.stringify(req.body));
	var data = {
				question : input.question,
				user_id: input.user_id,
				project_id : input.project_id
				};

	connection.query("INSERT INTO project_question SET ?", data, function(err,fields){
		  if (err)
              console.log("Error inserting : %s ",err );
     	});
	res.redirect('/forum');

});

router.get('/question/:id', function(req, res){

	var id = req.params.id;
	
	console.log(id);
	connection.query('SELECT question,vote_count FROM project_question WHERE project_question_id = ?', [id],function(err,fields){
		if(err)
			console.log("Error in getting question: %s ", err);

		//res.render('questions', {title:"Questions",data:fields})
		quest_data=fields;
		console.log(fields);


	});
	connection.query('SELECT COUNT(*) AS ansCount FROM project_answer WHERE project_question_id = ?',[id],function(err, fields){
		if(err)
			console.log("Error in counting answers: %s", err);
		count_data = fields;
	});
	connection.query('SELECT answer,vote_count,project_answer_id FROM project_answer WHERE project_question_id = ?',[id], function(err, fields){
		if(err)
			console.log("Error in getting answers: %s" ,err);
		ans_data = fields;
		console.log(fields);



		res.render('questions', {title:"Questions", quest_data:quest_data, ans_data:ans_data, count_data:count_data})

	});
});

router.post('/question/:id', function(req, res, next) 
{
	//console.log(req.body.question)
	var id = req.params.id;
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
	var data1 = {
				answer : input.answer,
				project_question_id:id,
				user_id : input.user_id
				};


	connection.query("INSERT INTO project_answer SET ?", data1, function(err,fields){
		  if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/forum/question/'+ id);

	});

});



module.exports = router;


