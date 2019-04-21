var environments = require('./environments.js')
var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiJsonEqual = require('chai-json-equal');
var addContext = require('mochawesome/addContext');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiJsonEqual);
chai.use(chaiHttp);

module.exports = function () {
	this.getRandomElement = function (array) {
		return array[getRandomInt(0, array.length)];
	}

	this.getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	this.randomString = function (len, charSet) {
		charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var randomString = '';
		for (var i = 0; i < len; i++) {
			var randomPoz = getRandomInt(0, charSet.length)
			randomString += charSet.substring(randomPoz, randomPoz + 1);
		}
		return randomString;
	}

	this.getRandomElement = function (array) {
		return array[getRandomInt(0, array.length)];
	}

	String.prototype.insert = function (index, string) {
		if (index > 0) {
			return this.substring(0, index) + string + this.substring(index, this.length);
		}
		return string + this;
	};

	function getFormattedString(obj) {
		return JSON.stringify(obj, Object.keys(obj).sort(), 4)
	};

	this.postAndVerify = function (test, obj, expectedStatus, expectedBody, done) {
		chai.request(environments.ENDPOINT)
			.post(environments.API)
			.send(obj)
			.end(function (err, res) {
				try {
					res.body.should.jsonEqual(expectedBody);
					expect(res).to.have.status(expectedStatus);
					addContext(test, "Payload:\n" + getFormattedString(obj));
					done();
				}
				catch (e) {
					addContext(test,
						"URL:\n" + environments.ENDPOINT + environments.API + "\n\n" +
						"Payload:\n" + getFormattedString(obj) + "\n\n" +
						"Expected Response:\n" +
						"HTTP Code: " + expectedStatus + "\n" +
						"Body:\n" + getFormattedString(expectedBody) + "\n\n" +
						"Actual Response:\n" +
						"HTTP Code: " + res.status + "\n" +
						"Body:\n" + getFormattedString(res.body));
					done(e)
				}
			});
	}
}