	
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer  = require('multer');
var fs = require('fs');
var AWS = require('aws-sdk');
var path = require("path")



var done=false;
router.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  //console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  //console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));


AWS.config.update({ accessKeyId: 'XXXXXXXXXXXXXX', secretAccessKey: 'XXXXXXXXXXXXXX' });

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
	connection.query('SELECT question,project_question_id,vote_count,user_id,aws_path FROM project_question', function(err, fields){
		if(err)
                console.log("Error Selecting : %s ",err );
     		//console.log(fields[0].user_id);
     		//console.log(fields[0]);
            res.render('forum',{title:"Questions",data:fields});

	});
});


router.post('/uploadfile/', function(req, res, next) 
{
	//done=true;
	if(done)
		{
			var location;
	console.log(req.files);
	if(req.files.file_upload)
		{

			console.log(req.files.file_upload);

			fs.readFile(path.join(__dirname ,"../",req.files.file_upload.path), function (err, data) {
		 
				if (err) { throw err; }

			  	var s3 = new AWS.S3();
			  	s3.upload({
				    Bucket: 'question.project.dezyre',
				    Key: req.files.file_upload.name,
				    Body: data
			  	}).on('httpUploadProgress', function(evt) { /*console.log(evt);*/ }).send(function(err, data1) 


			  	{ 
			  		if(err) console.log(err); 


				  	else 
				  	{

				  	 	console.log(data1.Location); 		
				  	 	var input = JSON.parse(JSON.stringify(req.body));
						var data = {
							question : input.question,
							user_id: input.user_id,
							project_id : input.project_id,
							aws_path:data1.Location
						};

						connection.query("INSERT INTO project_question SET ?", data, function(err,fields){
						  if (err)
				              console.log("Error inserting : %s ",err );
				     	});
					}
			     	
				});
			});

			fs.unlink(path.join(__dirname ,"../",req.files.file_upload.path),function(err){if(err)console.log(err)});
		}
	}
	res.redirect("/forum/")
	
});

router.post('/uploadData/', function(req, res, next) 
{
	var input = JSON.parse(JSON.stringify(req.body));
	var data = {
		question : input.question,
		user_id: input.user_id,
		project_id : input.project_id,
		aws_path:""
	};
	connection.query("INSERT INTO project_question SET ?", data, function(err,fields){
	if (err)
	    console.log("Error inserting : %s ",err );
	res.redirect('/forum');
	});

});

router.get('/question/:id', function(req, res){

	var id = req.params.id;
	
	console.log(id);
	connection.query('SELECT question,vote_count,project_question_id FROM project_question WHERE project_question_id = ?', [id],function(err,fields){
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
	connection.query('SELECT answer,vote_count,project_answer_id,user_id,aws_path FROM project_answer WHERE project_question_id = ?',[id], function(err, fields){
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

router.post('/question/:id/answer/uploadfile/', function(req, res, next) 
{
	//console.log(req.body.question)
	if(done)
	{
		var location;
		var id = req.params.id;
		console.log(req.files);
		if(req.files.file_upload)
		{

			console.log(req.files.file_upload);

			fs.readFile(path.join(__dirname ,"../",req.files.file_upload.path), function (err, data) {
		 
				if (err) { throw err; }

			  	var s3 = new AWS.S3();
			  	s3.upload({
				    Bucket: 'question.project.dezyre',
				    Key: req.files.file_upload.name,
				    Body: data
			  	}).on('httpUploadProgress', function(evt) { /*console.log(evt);*/ }).send(function(err, data1) 
				{ 
			  		if(err) console.log(err); 


				  	else 
				  	{	
				  		

				  	 	console.log(data1.Location); 		
				  	 	var input = JSON.parse(JSON.stringify(req.body));
						console.log(input);
						var data = {
									answer : input.answer,
									project_question_id:id,
									user_id : input.user_id,
									aws_path : data1.Location
									};

						connection.query("INSERT INTO project_answer SET ?", data, function(err,fields){
						  if (err)
				              console.log("Error inserting : %s ",err );
				     	});
					}
			     	
				});
			});

			fs.unlink(path.join(__dirname ,"../",req.files.file_upload.path),function(err){if(err)console.log(err)});
			res.redirect('/forum/question/'+ id);
		} }
});
	


module.exports = router;


