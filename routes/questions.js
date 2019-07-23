var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var sha1 = require('sha1');

var url = 'mongodb://localhost:27017/FluAppDB';

/* GET users listing. */
router.get('/', function(req, res, next) {

	MongoClient.connect(url, function(err, client) {

		var that = res;

		if (err) throw err;

		var db = client.db('FluAppDB');

		populateDB(db, res);

	});
});

router.put('/',function(req, res){

	var answers = req.body;

	console.log(answers);

	if(answers.answersSub[0].ans==="Yes" && answers.answersSub[1].ans>38 && answers.answersSub[2].ans==="Yes"){
		res.send("You Have Flu!");
	}else{
		res.send("You Don't Have Flu!");
	}
	
});


var populateDB = function(db, res){

	console.log('Inside populateDB');

	db.collection('Flu').count(function (err, count) {
			//populate the collection with the questions if the documents don't already exist
		    if (!err && count === 0) {
		        
			    db.collection('Flu').insert([
			    {
			        question_id: sha1("Have you had fever over the last 5 days?"),
			        question: "Have you had fever over the last 5 days?",
			        type: "select",
			        answers: [{
			        	id: sha1("yes"),
			        	text: "Yes"
			        },
			        {
			        	id: sha1("no"),
			        	text: "No"
			        }]
			    },
			    {
			        question_id: sha1("Temperature measurement"),
			        question: "Temperature measurement",
			        type:"input",
			        answers: []
			    },
			    {
			        question_id: sha1("Have you had cough?"),
			        question: "Have you had cough?",
			        type:"select",
			        answers: [{
			        	id: sha1("yes"),
			        	text: "Yes"
			        },
			        {
			        	id: sha1("no"),
			        	text: "No"
			        }]
			    }
			    ], function(err, records){
			    	sendResponse(db, res);
			    });
		    
		}else{
			sendResponse(db, res);
		}
		});
}

var sendResponse = function(db, res){
	db.collection('Flu').find().toArray(function(err, items){
		console.log(items);
		res.json(items);
	});
}


module.exports = router;
