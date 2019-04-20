module.exports = function() { 
	var chai = require('chai');
	var chaiHttp = require('chai-http');
	var assert = require('assert');
	var chaiJsonEqual = require('chai-json-equal');
	var should = chai.should();
	var expect = chai.expect;

	chai.use(chaiJsonEqual);
	chai.use(chaiHttp);

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

	this.getSwiftCode = function(country_code)
	{
		return randomString(getRandomElement([6, 9])).insert(4, country_code)
	}
	
	this.getPayload = function() {
		var payload = {
			"payment_method": getRandomElement(["LOCAL","SWIFT"]),
			"bank_country_code": getRandomElement(["US", "AU", "CN"]),
			"account_name": randomString(getRandomInt(2, 10)),
			"account_number": randomString(getRandomInt(8, 9)),
			"bsb": randomString(6),
			"aba": randomString(9)
		}
		payload.swift_code = getSwiftCode(payload.bank_country_code)
		return payload;
	};

	this.postAndVerify = function (obj, expectedStatus, expectedBody, done) {
		chai.request('http://preview.airwallex.com:30001')
			.post('/bank')
			.send(obj)
			.end(function (err, res) {
				try {
					res.body.should.jsonEqual(expectedBody);
					expect(res).to.have.status(expectedStatus);
					done();
				}
				catch (e) {
					var payload = "\nPayload: " + JSON.stringify(obj) + "\n";
					e.message = payload + e.message;
					done(e)
				}
		});
	}
}