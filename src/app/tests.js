// tests

var C = require('../const.js');
var assert = require(C.ASSERT);

module.exports = {

run : function () {
	testWebAPI(api_all_data, '/all');
	testWebAPI(api_near, '/near');
	testWebAPI(api_near_place, '/near?lat=35.78&lng=-78.64');
	testWebAPI(api_near_filter, '/near?lat=35.78&lng=-78.64&dst=2&lmt=4');
	testDB(people_nearby_limits);
}

}

// WebAPI TEST SUITE
function api_all_data (json) {
    assert.equal(20, json.results.length, "api_all_data");
}
function api_near(json) {
	assert.equal(C.DEFAULT.LIMIT, json.results.length, "api_near");
}
function api_near_place (json) {
	assert.equal(C.DEFAULT.LIMIT, json.results.length, "api_near_place");
}
function api_near_filter (json) {
	assert.equal(4, json.results.length, "api_near_filter");
}

// DB TEST SUITE
function people_nearby_limits(db) {
	var limit = 3;
	var people = require(C.PEOPLE);
	people.nearby(db, C.RALEIGH, C.DEFAULT.DISTANCE, limit, function (response, json) {
		assert.equal(limit, json.results.length, "db_people_nearby_limits");
	}, null);
}

// TEST HARNESSES
function testWebAPI(testMethod, path) {
	var http = require('http');
	var options = {
	  hostname: 'localhost',
	  path: path,
	  port: 8081,
	  method: 'GET'
	};
	var req = http.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
		  var json = JSON.parse(data);
		  if (json.ok) {
			  testMethod(json);
		  } else {
			  C.LOG.ERR(data);
		  }
	  });
	});
	req.on('error', function(e) {
		C.LOG.ERR(JSON.stringify(options));
	});
	req.end();
}

function testDB(testMethod) {
	var DAL = require(C.DAL);
	DAL.execute(testMethod);
}