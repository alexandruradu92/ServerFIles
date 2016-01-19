var express = require('express')
  ,
 bodyParser = require('body-parser')
  ,
 request = require('request').defaults({json: true})
  ;
// httpProxy = require('http-proxy');


// 1

var app = express();
app.use('/signup', bodyParser.json());


app.use('/signin', bodyParser.json());

// 2


app.post('/signup*', function (req, res) 
{
  
  console.log('its signup time');


  /** URL of the Sync Gateway instance running locally */
  var stringURL = 'http://192.168.2.28:4985/simple-login';

 
  var json = req.body;
  var name = json.name;

console.log(json.name);
  request
    /** Check if the user already exists */
    .get(stringURL + '/_user/' + name)
    .on('response', function (userExistsResponse) {
      if (userExistsResponse.statusCode === 404) {
        /** If the user doesn't exist, create one with the email as the name */
        return request
          .put({
            url: stringURL + '/_user/' + name,
            json: true,
            body: {
              name: name,
              password: json.password
            }
          })
          .on('response', function (createUserResponse) {
            if (createUserResponse.statusCode === 201) {
              /** If the user was created successfully, create the session */
              sessionRequest(name, function (sessionError, sessionResponse, body) {
                res.send(body);
              });
            }
          });
      }
      /** The user already exists, simply create a new session */
      //sessionRequest(name, function (sessionError, sessionResponse, body) {
     //   res.send(body);
     // });
     console.log("Already exists!");
    });

  
});

// 2



app.post('/signin*', function (req, res) 
{
  
  console.log('its signin time');


  /** URL of the Sync Gateway instance running locally */
  var stringURL = 'http://192.168.2.28:4985/simple-login';

 
  var json = req.body;
  var name = json.name;

console.log(json.name);
  request
    /** Check if the user already exists */
    .get(stringURL + '/_user/' + name)
    .on('response', function (userExistsResponse) {
      if (userExistsResponse.statusCode === 404) {
        /** If the user doesn't exist, create one with the email as the name */
        return request
          .put({
            url: stringURL + '/_user/' + name,
            json: true,
            body: {
              name: name,
              password: json.password
            }
          })
          .on('response', function (createUserResponse) {
            if (createUserResponse.statusCode === 201) {
              /** If the user was created successfully, create the session */
              sessionRequest(name, function (sessionError, sessionResponse, body) {
                res.send(body);
              });
            }
          });
      }
      /** The user already exists, simply create a new session */
      //sessionRequest(name, function (sessionError, sessionResponse, body) {
     //   res.send(body);
     // });
     console.log("Already exists!");
    });

 
});




// 3



// 3

  app.all('*', function(req, res) {

   console.log(req.url);
   var url = 'http://192.168.2.28:4984' + req.url;

   req.pipe(request(url)).pipe(res);
  
});


// 4

   var server = app.listen(8000, function () {
   
  var host = server.address().address;

     var port = server.address().port;
   

  console.log('App listening at http://%s:%s', host, port);

   });