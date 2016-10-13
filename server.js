var express = require('express');
var bodyParser = require('body-parser');

var config = require('./config.json');

var MongoClient = require('mongodb').MongoClient
var app = express();

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var mongoConnection = 'mongodb://' + config.mongoip + ":" + config.mongoport + '/app3DB'
MongoClient.connect(mongoConnection, (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(app.get('port'), function() {
    console.log(`running on 0.0.0.0:${app.get('port')}`);
  });
});



app.get('/', function(req, res){
  res.render("login.ejs");
});



var collectionCount = [];
var collectionsArray;
app.get('/trolleys', function(req, res){
    db.listCollections().toArray(function(err, collections){
        collectionsArray = collections;
      function getNumber(i,bay) {
        var x;
        db.collection("master", function(err, collection) {
            collection.find({"bayid": bay, "outtime": "x"}).toArray(function(err, result) {
              if (err) {
                throw err;
              } else {
                x=result.length;
              }
              collectionCount[i] = x;
            });
          });
        return x;
      }
      getNumber(0, "pear");
      getNumber(1, "apple");
      getNumber(2, "banana");
      res.render('index.ejs', {
        bay: collectionCount
      });
    });
  });
  
app.get('/update', function(req, res){
	db.listCollections().toArray(function(err, collections){
		db.collection("master", function(err, collection) {
			collection.find({"outtime": "x"}).toArray(function(err, result) {
				if (err) {
					res.status(500).send({ error: 'something blew up' });
					return;
				}

				res.json(generateResponseJSON(result));
			});
		});
    });
});



//returns a json object to respond with
//result is JSON object.

//This generates a JSON object that holds a bay name as a key
//and an object containing the bay's capcity and count as a value.
//The JSON object can also have multiple keys, each for a different bay.
function generateResponseJSON(result)
{
	//bayCount = {
	//	bayname:{
	//		capacity: 0;
	//		count:0;
	//	},
	//};
	
	
	//This use
	bay = {};
	console.log("result: ");
	console.log(result);
	for (i = 0;i < result.length;i++)
	{
		var record = result[i];
		console.log(record);
		if (bay.hasOwnProperty(record.bayid))
		{
			//bay already registered add one omre to count
			console.log("already exists");
			bay[record.bayid].count++;
		}
		else
		{
			console.log("make new");
			bay[record.bayid] = {
						count:1,
						capacity:10,
						};	
		}
	}
	console.log("bay");
	console.log(bay);
	return bay;
}
