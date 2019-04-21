require('./utils.js')()

describe('Test Bank Account API', function () {

    var payload = {}
    success = { "success": "Bank details saved" };

    function getSwiftCode(country_code) {
        return randomString(getRandomElement([6, 9])).insert(4, country_code)
    }

    beforeEach(function (done) {
        payload.payment_method = getRandomElement(["LOCAL", "SWIFT"]),
            payload.bank_country_code = getRandomElement(["US", "AU", "CN"]),
            payload.account_name = randomString(getRandomInt(2, 10)),
            payload.account_number = randomString(getRandomInt(8, 9)),
            payload.bsb = randomString(6),
            payload.aba = randomString(9)
        payload.swift_code = getSwiftCode(payload.bank_country_code)
        done()
    });

    describe('Test Valid Bank Account Inputs', function () {
        it('Verify Valid SWIFT Account', function (done) {
            payload.payment_method = "SWIFT";
            postAndVerify(this, payload, 200, success, done);
        });

        it('Verify Valid LOCAL Account', function (done) {
            payload.payment_method = "LOCAL";
            postAndVerify(this, payload, 200, success, done);
        });

        it('Verify Valid US Account', function (done) {
            payload.bank_country_code = "US";
            payload.account_number = randomString(getRandomInt(1, 17));
            payload.swift_code = getSwiftCode(payload.bank_country_code);
            postAndVerify(this, payload, 200, success, done);
        });

        it('Verify Valid AU Account', function (done) {
            payload.bank_country_code = "AU";
            payload.account_number = randomString(getRandomInt(6, 9));
            payload.swift_code = getSwiftCode(payload.bank_country_code);
            postAndVerify(this, payload, 200, success, done);
        });

        it('Verify Valid CN Account', function (done) {
            payload.bank_country_code = "CN";
            payload.account_number = randomString(getRandomInt(8, 20));
            payload.swift_code = getSwiftCode(payload.bank_country_code),
                postAndVerify(this, payload, 200, success, done);
        });
    });

    describe('Test Invalid Bank Account Inputs ', function () {
        describe('Test Invalid Country Code / Payment Method', function () {
            it('Verify Invalid Payment Method', function (done) {
                payload.payment_method = randomString(5).toUpperCase();
                postAndVerify(this, payload, 400, { "error": "'payment_method' field required, the value should be either 'LOCAL' or 'SWIFT'" }, done);
            });

            it('Verify Invalid Country Code', function (done) {
                payload.bank_country_code = randomString(2).toUpperCase();
                payload.swift_code = getSwiftCode(payload.bank_country_code)
                postAndVerify(this, payload, 400, { "error": "'bank_country_code' is required, and should be one of 'US', 'AU', or 'CN'" }, done);
            });
        });
        describe('Verify Mandatory Missing Field Scenarios', function () {
            it('Verify Missing payment_method', function (done) {
                delete payload.payment_method
                postAndVerify(this, payload, 400, { "error": "\'payment_method\' field required, the value should be either \'LOCAL\' or \'SWIFT\'" }, done);
            });

            it('Verify Missing account_name', function (done) {
                delete payload.account_name
                postAndVerify(this, payload, 400, { "error": "\'account_name\' is required" }, done);
            });

            it('Verify Missing account_name only contains spaces', function (done) {
                payload.account_name = "  "
                postAndVerify(this, payload, 400, { "error": "\'account_name\' is required" }, done);
            });

            it('Verify Missing account_number', function (done) {
                delete payload.account_number
                postAndVerify(this, payload, 400, { "error": "\'account_number\' is required" }, done);
            });

            it('Verify Missing account_number only contains spaces', function (done) {
                payload.account_number = "        "
                postAndVerify(this, payload, 400, { "error": "\'account_number\' is required" }, done);
            });

            it('Verify Missing bank_country_code', function (done) {
                delete payload.bank_country_code
                postAndVerify(this, payload, 400, { "error": "\'bank_country_code\' is required, and should be one of \'US\', \'AU\', or \'CN\'" }, done);
            });
        });

        describe('Verify Invalid Filed Length Logics', function () {
            it('Verify Long Account Name Length (11)', function (done) {
                payload.account_name = randomString(11);
                postAndVerify(this, payload, 400, { "error": "Length of account_name should be between 2 and 10" }, done);
            });

            it('Verify Short Account Name Length (1)', function (done) {
                payload.account_name = randomString(getRandomInt(1, 1));
                postAndVerify(this, payload, 400, { "error": "Length of account_name should be between 2 and 10" }, done);
            });

            it('Verify Long US Account Number Length(18)', function (done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "US";
                payload.account_number = randomString(18);
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                postAndVerify(this, payload, 400, { "error": "Length of account_number should be between 1 and 17 when bank_country_code is \'US\'" }, done);
            });

            it('Verify Short AU Account Number Length(5)', function (done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "AU";
                payload.account_number = randomString(5);
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                postAndVerify(this, payload, 400, { "error": "Length of account_number should be between 6 and 9 when bank_country_code is \'AU\'" }, done);
            });

            it('Verify Long AU Account Number Length(10)', function (done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "AU";
                payload.account_number = randomString(10);
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                postAndVerify(this, payload, 400, { "error": "Length of account_number should be between 6 and 9 when bank_country_code is \'AU\'" }, done);
            });

            it('Verify CN Account Number Length(7)', function (done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "CN";
                payload.account_number = randomString(7);
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                postAndVerify(this, payload, 400, { "error": "Length of account_number should be between 8 and 20 when bank_country_code is \'CN\'" }, done);
            });

            it('Verify CN Account Number Length(21)', function (done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "CN";
                payload.account_number = randomString(21);
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                postAndVerify(this, payload, 400, { "error": "Length of account_number should be between 8 and 20 when bank_country_code is \'CN\'" }, done);
            });

            it('Verify AU Account w/ invalid bsb field length 5', function (done) {
                payload.bank_country_code = "AU";
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                payload.bsb = randomString(5);
                postAndVerify(this, payload, 400, { "error": "Length of \'bsb\' should be 6" }, done);
            });

            it('Verify AU Account w/ invalid bsb field length 7', function (done) {
                payload.bank_country_code = "AU";
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                payload.bsb = randomString(7);
                postAndVerify(this, payload, 400, { "error": "Length of \'bsb\' should be 6" }, done);
            });

            it('Verify US Account w/ invalid aba field length 8', function (done) {
                payload.bank_country_code = "US";
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                payload.aba = randomString(8);
                postAndVerify(this, payload, 400, { "error": "Length of \'aba\' should be 9" }, done);
            });

            it('Verify US Account w/ invalid aba field length 10', function (done) {
                payload.bank_country_code = "US";
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                payload.aba = randomString(10);
                postAndVerify(this, payload, 400, { "error": "Length of \'aba\' should be 9" }, done);
            });
        });

        describe('Verify bsb/aba Fileds Missing Scenarios', function () {
            it('Verify AU Account w/o bsb field', function (done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "AU";
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                delete payload.bsb
                postAndVerify(this, payload, 400, { "error": "\'bsb\' is required when bank country code is \'AU\'" }, done);
            });

            it('Verify AU Account w/ bsb field only contains spaces', function (done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "AU";
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                payload.bsb = "      ";
                postAndVerify(this, payload, 400, { "error": "\'bsb\' is required when bank country code is \'AU\'" }, done);
            });

            it('Verify US Account w/o aba field', function (done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "US";
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                delete payload.aba
                postAndVerify(this, payload, 400, { "error": "\'aba\' is required when bank country code is \'US\'" }, done);
            });

            it('Verify US Account w/ aba field only contains spaces', function (done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "US";
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                payload.aba = "         "
                postAndVerify(this, payload, 400, { "error": "\'aba\' is required when bank country code is \'US\'" }, done);
            });
        });

        describe('Verify Invalid SWIFT Code Scenarios', function () {
            it('Verify SWIFT Code w/o Country Code', function (done) {
                payload.payment_method = "SWIFT";
                payload.swift_code = randomString(getRandomElement([8, 11]));
                postAndVerify(this, payload, 400, { "error": "The swift code is not valid for the given bank country code: " + payload.bank_country_code }, done);
            });

            it('Verify SWIFT Code w/o Invalid Length', function (done) {
                payload.payment_method = "SWIFT";
                payload.swift_code = randomString(0, 2) + payload.bank_country_code + randomString(0, 7);
                postAndVerify(this, payload, 400, { "error": "Length of \'swift_code\' should be either 8 or 11" }, done);
            });

            it('Verify SWIFT w/ Empty SWIFT Code', function (done) {
                payload.payment_method = "SWIFT";
                payload.swift_code = ""
                postAndVerify(this, payload, 400, { "error": "\'swift_code\' is required when payment method is \'SWIFT\'" }, done);
            });

            it('Verify w/o SWIFT Code', function (done) {
                payload.payment_method = "SWIFT";
                delete payload.swift_code;
                postAndVerify(this, payload, 400, { "error": "\'swift_code\' is required when payment method is \'SWIFT\'" }, done);
            });

            it('Verify SWIFT w/ Invalid Lower Case Country Code', function (done) {
                payload.payment_method = "SWIFT";
                payload.swift_code = randomString(getRandomElement([6, 9])).insert(4, payload.bank_country_code.toLowerCase())
                postAndVerify(this, payload, 400, { "error": "The swift code is not valid for the given bank country code: " + payload.bank_country_code }, done);
            });

            it('Verify SWIFT Code Only Contains Spaces', function (done) {
                payload.payment_method = "SWIFT";
                payload.swift_code = "    " + payload.bank_country_code + "  ";
                postAndVerify(this, payload, 400, { "error": "The swift code is not valid for the given bank country code: " + payload.bank_country_code }, done);
            });
        });
    });
});