var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongodb = require("mongodb");

app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: "true" }));

var client = mongodb.MongoClient;
var url = "mongodb://localhost:27017"


app.get('/', (req, res) => {
    res.send("Hello World");
    res.end();
});

app.post('/save', (req, res) => {
    var body = req.body;
    client.connect(url, (err, db) => {
        if (err) {
            res.end(JSON.stringify({ status: "Failed" }))
        }
        var dbo = db.db("mydb");
        dbo.collection("users").insertOne(body, (err, result) => {
            if (err) {
                res.end(JSON.stringify({ status: "Failed" }))
            }
            db.close()
            res.end(JSON.stringify({ status: "Success", data:result }))
        });
    });
});

app.post('/update', (req, res) => {
    var body = req.body;
    client.connect(url, (err, db) => {
        if (err) {
            res.end(JSON.stringify({ status: "Failed" }))
        }
        var dbo = db.db("mydb");
        dbo.collection("users").updateOne({_id:mongodb.ObjectId(body.id)},{$set:{name:body.name, email:body.email}},(err,result)=>{
            if (err){
                res.end(JSON.stringify({status:"Failed"}));
            }
            res.end(JSON.stringify({status:"Success", data:result}))
        })
    });
});

app.delete('/delete', (req, res) => {
    var body = req.body;
    client.connect(url, (err, db) => {
        if (err) {
            res.end(JSON.stringify({ status: "Failed" }))
        }
        var dbo = db.db("mydb");
        dbo.collection("users").deleteOne({_id:mongodb.ObjectId(body.id)},(err,result)=>{
            if (err){
                res.end(JSON.stringify({status:"Failed"}));
            }
            res.end(JSON.stringify({status:"Success", data:result}))
        })
    });
});

app.get('/get', (req, res) => {
    var body = req.body;
    client.connect(url, (err, db) => {
        if (err) {
            res.end(JSON.stringify({ status: "Failed" }))
        }
        var dbo = db.db("mydb");
        dbo.collection("users").find({}).toArray((err,result)=>{
            if (err){
                res.end(JSON.stringify({status:"Failed"}));
            }
            res.end(JSON.stringify({status:"Success", data:result}))
        })
    });
});




app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
});