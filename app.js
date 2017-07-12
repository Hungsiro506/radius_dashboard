var port = 8088;

var express = require('express');
var app = express();
var http = require('http').Server(app);

/*
    //allow cross-origin
    var cors = require('cors')
    app.use(cors());
    //OTHER CASE
*/
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(express.static(__dirname + '/public'));

/**
 * MONGODB
 */

//Detech any user connect to server via web browser
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/sparkline');
mongoose.connection.on('connected',function(){
  console.log('mongoose connected success');
});

var outlier = require('./outlier-model');

/**
 * SOCKET IO
 */

// var io = require('socket.io')(http);
// setTimeout(function(){
//     var data = {bras_id: "GLI-MP01-4", signin_total_count: "66, 55, 77, 26", time: "2017-06-20 13:58:44.045"}
//     console.log("=============================");
//     console.log(data);
//     console.log("-----------------------------");
//     //If insert action is occured, emit data to client via socket.io
//     io.emit("aggregator-insert", data)
// }, 5000);

//Detech any user connect to server via web browser
// io = io.on('connection', function(socket){
//     console.log('a user connected');
//     socket.on('disconnect', function(){
//         console.log('a user disconnected');
//     });
// });

app.get('/', function(req, res){
    //res.sendFile(path.join(__dirname, 'web', 'index.html'));
    //res.sendFile('index.html', { root: path.join(__dirname, 'web') });
    res.sendFile('hightchart.html', {root: __dirname});

});

app.get('/getall', function(req, res){
    var time = req.query.time;
    var temp = parseInt(time) - (1000*60*15); // 15m
    var begin = new Date(temp).toISOString();
    var end = new Date(time).toISOString();
    outlier.find({
        time: {
            $gte: ISODate(begin),
            $lt: ISODate(end)
        }
    })
    .exec(function(err, doc){
        console.log(doc)
        if(err){
            return res.json({success: false});
        }

        res.json({success: true, data: doc});
    })
})

http.listen(port, function(){
    console.log("Running on port " + port)
});
