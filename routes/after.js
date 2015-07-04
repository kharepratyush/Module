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
    console.log("www : "+err);
  else
    console.log("After page to Database");
});

/* GET users listing. */
router.get('/', function(req, res, next) 
{
//project id, user_id
/*uid and project_id from authentication*/
	uid=9;
	project_id=1;
/*end*/

	mysqlConnect.query("select project_faculty_rating_id from project_faculty_rating where user_id=? and project_id=?",[uid,project_id],function(err,rows,fields)
	{
  		if(err)
  		{
    	      console.log(err);
  		}
  		else
  		{
      
      		console.log(rows);
      		//console.log(fields);
      		if(!rows[0])
      			res.redirect('/form_faculty');
  		
  			else
  			{
  				mysqlConnect.query("select project_rating_id from project_rating where user_id=? and project_id=?",[uid,project_id],function(err,rows,fields)
				{
						if(err)
						{
			      		console.log(err);
						}
						else
						{
		  		
						  console.log(rows);
		  					//console.log(fields);
						    if(!rows[0])
					      		res.redirect('/form_project');
					      	else 
		  					{
		  						mysqlConnect.query("select project_rating_id from project_rating where user_id=? and project_id=?",[uid,project_id],function(err,rows,fields)
								{
									if(err)
									{
						      		console.log(err);
									}
									else
									{
					  		
									  console.log(rows);
					  					//console.log(fields);
									    if(!rows[4])
								      		res.redirect('/form_user');
								      	else 
					  					{
					  						res.send('respond with a resource');
					  					}
									}
								});
		  					}
						}
				});
			}
		}
	});
});
module.exports = router;