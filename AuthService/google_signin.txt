/** URL of the Sync Gateway instance running locally */
var stringURL = 'http://10.10.1.106:4985/simple-login';

/** Given the name of a user that exists in Sync Gateway, create a new session */
var sessionRequest = function (name, callback) {
return request({
  method: 'POST',
  url: stringURL + '/_session',
  json: true,
  body: {
    name: name
  }
}, callback);
};

var json = req.body;
var name = json.auth_provider + '-' + json.user_id.toString();
request
/** Check if the user already exists */
.get(stringURL + '/_user/' + name)
.on('response', function (userExistsResponse) {
  if (userExistsResponse.statusCode === 404) {
    /** If the user doesn't exist, create one with the Google user ID as the name */
    return request
      .put({
        url: stringURL + '/_user/' + name,
        json: true,
        body: {
          name: name,
          password: Math.random.toString(36).substr(2)
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
  sessionRequest(name, function (sessionError, sessionResponse, body) {
    res.send(body);
  });
});