var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('mongodb_uri', process.env.MONGODB_URI);
app.use(express.static(__dirname + '/public'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Bookmark = mongoose.model('bookmark', {name: String, url: String});

// Connect to MongoDB
mongoose.connect(app.get('mongodb_uri'));

app.get('/bookmarks', function(req, res) {
  mongoose.model('bookmark').find(function(err, bookmark) {
    res.send(bookmark);
  });
});


app.post('/bookmark/add', function(req, res) {
  var newBookmark = new Bookmark( req.body );

  newBookmark.save(function (err, newBookmark) {
    if (err) return console.log(err)

    console.log('saved to database:' + JSON.stringify(req.body))
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "status": "added" }));
  });
});


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

