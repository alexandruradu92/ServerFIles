var express = require('express')
  , bodyParser = require('body-parser')
  , request = require('request').defaults({json: true});

var app = express();
app.use('/google_signin', bodyParser.json());
app.use('/google_signup', bodyParser.json());

app.post('/google_signin', function (req, res) {
   console.log("sign_in");
  /** URL of the Sync Gateway instance running locally */
  var stringURL = 'http://10.10.1.106:4985/simple-login';

  /** Given the name of a user that exists in Sync Gateway, create a new session */
  var sessionRequest = function (name, password, callback) {
    return request({
      method: 'POST',
      url: 'http://10.10.1.106:4984/simple-login' + '/_session',
      json: true,
      body: {
        name: name,
        password: password
      }
    }, callback);
  };

  var json = req.body;
  var name = json.name;
  var password = json.password;
  console.log(name+"/"+password);
  request
    /** Check if the user already exists */
    .get(stringURL + '/_user/' + name)
    .on('response', function (userExistsResponse) {
		console.log(userExistsResponse.statusCode);
      if (userExistsResponse.statusCode === 200) {
        console.log("user  exists");
       
	    var sessionRequestAuth = function (name, password, callback) {
			return request({
				method: 'POST',
				url: 'http://10.10.1.106:4985/simple-login' + '/_session',
				json: true,
				body: {
					name: name,
					password: password
				}
			}, callback);
		};
	   
        /** The user already exists, simply create a new session */
		sessionRequest(name, password, function (sessionErrorAuth, sessionResponseAuth, bodyAuth) {
           
		   var jsonResp = bodyAuth;
		   console.log(jsonResp.ok);
		   
		   if(jsonResp.ok == true){
			   sessionRequestAuth(name, password, function (sessionError, sessionResponse, body){
				   res.send(body)
			   });
		   }else
		   {
			   res.send(bodyAuth);
			}
		   
		});
		
		
      }
	  else if (userExistsResponse.statusCode === 404) {
	  		console.log("user doesn't exists");
			var bodyResponse = "{\"name\": \"" + name +"\", \"statusCode\": \""+userExistsResponse.statusCode+"\"}";
			res.send(bodyResponse);
		  
	  }
	  else{
		   console.log("Error:");
			res.send(userExistsResponse);
	  }
     
    });
});



app.post('/google_signup', function (req, res) {
   console.log("sign_up");
  /** URL of the Sync Gateway instance running locally */
  var stringURL = 'http://10.10.1.106:4985/simple-login';

  /** Given the name of a user that exists in Sync Gateway, create a new session */
  var sessionRequest = function (name, password, callback) {
    return request({
      method: 'POST',
      url: stringURL + '/_session',
      json: true,
      body: {
        name: name,
        password: password
      }
    }, callback);
  };

  var json = req.body;
  var name = json.name;
  var password = json.password;
  request
    /** Check if the user already exists */
    .get(stringURL + '/_user/' + name)
    .on('response', function (userExistsResponse) {
		console.log(userExistsResponse.statusCode);
      if (userExistsResponse.statusCode === 404) {
        console.log("user doesn't exist, create it");
        /** If the user doesn't exist, create one with the Google user ID as the name */
        return request
          .put({
            url: stringURL + '/_user/' + name,
            json: true,
            body: {
              name: name,
              password: password
            }
          })
          .on('response', function (createUserResponse) {
            if (createUserResponse.statusCode === 201) {
              /** If the user was created successfully, create the session */
                console.log("the user was created successfully, create the session");
              sessionRequest(name, password, function (sessionError, sessionResponse, body) {
                res.send(body);
              });
            }
          });
      }else if (userExistsResponse.statusCode === 200) {
		        /** The user already exists */

	  		console.log("The user already exists");
			var bodyResponse = "{\"name\": \"" + name +"\", \"statusCode\": \""+userExistsResponse.statusCode+"\", \"message\":\"Already exists\"}";
			res.send(bodyResponse);
		  
	  }
	  else{
		   console.log("Error:");
			var bodyResponse = "{\"name\": \"" + name +"\", \"statusCode\": \""+userExistsResponse.statusCode+"\"}";
			res.send(bodyResponse);
	  }
       
    });
});



app.all('*', function (req, res) {
alert(req.url);
  console.log(req.url);
  var url = 'http://10.10.1.106:4984' + req.url;
  req.pipe(request(url)).pipe(res);
});

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});