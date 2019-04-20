var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiJsonEqual = require('chai-json-equal');
var addContext = require('mochawesome/addContext');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiJsonEqual);
chai.use(chaiHttp);

module.exports = function() { 
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
		return randomString.trim();
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

	this.postAndVerify = function (test, obj, expectedStatus, expectedBody, done) {
		chai.request('http://preview.airwallex.com:30001')
			.post('/bank')
			.send(obj)
			.end(function (err, res) {
                addContext(test, "Payload:\n" + JSON.stringify(obj, Object.keys(obj).sort(), 4));
				try {
					res.body.should.jsonEqual(expectedBody);
					expect(res).to.have.status(expectedStatus);
					done();
				}
				catch (e) {
					done(e)
				}
		});
    }
}