var express=require('express'), 
	bodyParser = require('body-parser'),
    request = require('request').defaults({json: true});
var nodemailer = require("nodemailer");
var app=express();
app.use('/send', bodyParser.json());
/*
Here we are configuring our SMTP Server details.
STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport("SMTP",{
	service: "Gmail",
	auth: {
		user: "radu.alexandru9221@gmail.com",
		pass: "Februarie21"
	}
});
 /*------------------SMTP Over-----------------------------*/

app.get('/',function(req,res){
	 res.send('I\'m here');
});

app.post('/send',function(req,res){
  //code to send e-mail.
  var json = req.body;
  
  var mailOptions={
   to : json.to,
   subject : json.subject,
   text : json.text
  }
  
  console.log(mailOptions);
  
  smtpTransport.sendMail(mailOptions, function(error, response){
	if(error){
		console.log(error);
		res.send("error");
	}else{
		//console.log("Message sent: " + response.message);
		res.send(response.message);
	}
  });
 });



app.listen(3000,function(){

console.log("Express Started on Port 3000");
});