var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var app = express();

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect('mongodb://localhost/store', (err, database) => {
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
        db.collection("ultimo", function(err, collection) {
            collection.find({"bay": bay, "out": "x"}).toArray(function(err, result) {
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
				db.collection("ultimo", function(err, collection) {
					collection.find({"outtime": "x"}).toArray(function(err, result) {
					  if (err) {
						throw err;
					  } else {
						x=result.length;
					  }
					  res.json(generateResponseJSON(result));
					});
			  	});
    });
});



//returns a json object to respond with
//result is JSON object.
function generateResponseJSON(result)
{
	//bayCount = {
	//	bay:{
	//		name: "";
	//		count:0;
	//	},
	//};
	
	bay = {};
	console.log("result: ");
	console.log(result);
	for (i = 0;i < result.length;i++)
	{
		var record = result[i];
		if (bay.hasOwnProperty(record.bay))
		{
			//bay already registered add one omre to count
			console.log("already exists");
			bay[record.bay].count++;
		}
		else
		{
			console.log("make new");
			bay[record.bay] = {
						count:1,
						capacity:5,
						};	
		}
	}
	console.log("bay");
	console.log(bay);
	return bay;
}
