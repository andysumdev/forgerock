/* Lightweight Express.js Server */

const express = require('express');
const server = express();
const path = require('path');
const fs = require('fs');
const busboy = require('connect-busboy');
const mysql = require('mysql');
const moment = require('moment');

server.use(express.static('resources'));
server.use(busboy());

var connection = mysql.createConnection({
	host: 'localhost',
   	user: 'root',
    password: 'welcome'
});
connection.connect();

/* Check Database exists, make if not */
var createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS `forgerock`;";
connection.query(createDatabaseQuery,function(err,result){
	if(err){
		return res.status(500).send("Database Error");				
	}		
});

/* Check table exists, make if not */
var createQuery = "CREATE TABLE IF NOT EXISTS `forgerock`.`images`(`imgID` int(10) NOT NULL auto_increment, `fileName` varchar(45) NOT NULL, `mimeType` varchar(45) NOT NULL, `fileSize` int(10) NOT NULL, `uploadDate` DATE NOT NULL, PRIMARY KEY (`imgID`));";
connection.query(createQuery,function(err,result){
	if(err){
		return res.status(500).send("Database Error");				
	}		
});

/* Check image directory exists */
if(!fs.existsSync(__dirname + "/resources/images/")){
	fs.mkdirSync(__dirname + "/resources/images/");
}

server.get('/', function (req,res){
	res.sendFile(path.join(__dirname, 'resources/gallery.html'));
});

server.post('/gallery.html', function(req, res){
	req.pipe(req.busboy);
	req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype){

			/* Write file to temporary directory */
			var fileWriteStream = fs.createWriteStream(__dirname + "/resources/images/" + filename);		
			file.pipe(fileWriteStream);

			fileWriteStream.on("close", function(){
				/* Read file and create information object */
				var stats = fs.statSync("resources/images/" + filename);
				var fileSize = stats.size;
				var fileData = fs.readFileSync(__dirname + "/resources/images/" + filename);
				var date = new Date();
				var dateFormat = moment(date).format('YYYY-MM-DD');
				var writeObject = {
					"fileName": filename,
					"mimeType": mimetype,
					"fileSize": fileSize,
					"uploadDate": dateFormat
				};
			
				/* Write meta-data object to database */
				var writeQuery = "INSERT INTO `forgerock`.`images` SET ?";
				connection.query(writeQuery, writeObject, function(err,result){
					if(err){
						return res.status(500).send("Database Error");	
					}else{
						return res.status(200).sendFile(path.join(__dirname, 'resources/gallery.html'));			
					}
				});
			});
	});
});

server.get('/getUploads', function(req, res){
		/* Build JSON string for client */
		var readQuery = "SELECT * FROM `forgerock`.`images` ORDER BY `imgID` DESC;";
			connection.query(readQuery, function(err,result){
				if(err){
					console.log(err);
					return res.status(500).send("Database Error");	
				}else{
					var imageJSON = "[";
					for(var i = 0; i < result.length; i++) {
						imageJSON += "{"
						imageJSON += "\"imgID\":" + result[i].imgID + ",";
						imageJSON += "\"fileName\":\"" + result[i].fileName + "\",";
						imageJSON += "\"mimeType\":\"" + result[i].mimeType + "\",";
						imageJSON += "\"uploadDate\":\"" + moment(result[i].uploadDate).format("YYYY-MM-DD") + "\",";
						imageJSON += "\"fileSize\":" + result[i].fileSize + "}";
						if(i != result.length - 1){
							imageJSON += ",";
						}
					}
					imageJSON += "]";
					return res.status(200).send(imageJSON);			
				}
			});
});

server.listen(8000, function(){
	console.log('Image server listening on port 8000');
});

