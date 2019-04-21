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

	Object.prototype.getFormattedString = function () {
		return JSON.stringify(this, Object.keys(this).sort(), 4)
	};
}