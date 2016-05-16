var express = require('express');

var app = express();

// set static file serve paths
app.use(express.static(__dirname + '/artifacts'));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('index');
});

var port = 3030;

app.listen(port, function () {
    console.log('Started PhotoGallery development server...');
    console.log('Listening at http://localhost:' + port);
});

app.on('error', function (err) {
    console.log('Error starting server: ' + err.message);
});
