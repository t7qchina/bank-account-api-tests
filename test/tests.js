require('./utils.js')()

success = {"success": "Bank details saved"};

describe('Test Submit Bank Account API', function() {
    payload = {};
    
    beforeEach(function(){
        payload.payment_method = getRandomElement(["LOCAL","SWIFT"]);
        payload.bank_country_code = getRandomElement(["US", "AU", "CN"]);
        payload.account_name = randomString(getRandomInt(2, 10));
        payload.account_number = randomString(getRandomInt(8, 9));
        payload.bsb = randomString(6);
        payload.aba = randomString(9);
        payload.swift_code = getSwiftCode(payload.bank_country_code)
    });

    describe('Test Valid Bank Account Inputs', function() {
        it('Submit Valid SWIFT Account', function(done) {
            payload.payment_method = "SWIFT";
            postAndVerify(payload, 200, success, done);
        });

        it('Submit Valid LOCAL Account', function(done) {
            payload.payment_method = "LOCAL";
            postAndVerify(payload, 200, success, done);
        });

        it('Submit Valid US Account', function(done) {
            payload.bank_country_code = "US";
            payload.account_number = randomString(getRandomInt(1, 17));
            payload.swift_code = getSwiftCode(payload.bank_country_code),
            postAndVerify(payload, 200, success, done);
        });

        it('Submit Valid AU Account', function(done) {
            payload.bank_country_code = "AU";
            payload.account_number = randomString(getRandomInt(6, 9));
            payload.swift_code = getSwiftCode(payload.bank_country_code);
            postAndVerify(payload, 200, success, done);
        });

        it('Submit Valid CN Account', function(done) {
            payload.bank_country_code = "CN";
            payload.account_number = randomString(getRandomInt(8, 20));
            payload.swift_code = getSwiftCode(payload.bank_country_code),
            postAndVerify(payload, 200, success, done);
        });
    });

    describe('Test Invalid Inputs ', function() {
        describe('Test Invalid Country Code / Payment Method', function() {
            it('Submit Invalid Payment Method', function(done) {
                payload.payment_method = randomString(5).toUpperCase();
                postAndVerify(payload, 400, {"error":"'payment_method' field required, the value should be either 'LOCAL' or 'SWIFT'"}, done);
            });

            it('Submit Invalid Country Code', function(done) {
                payload.bank_country_code = randomString(2).toUpperCase();
                payload.swift_code = getSwiftCode(payload.bank_country_code)
                postAndVerify(payload, 400, {"error":"'bank_country_code' is required, and should be one of 'US', 'AU', or 'CN'"}, done);
            });
        });
        describe('Verify Mandatory Missing Field Scenarios', function() {
            it('Verify Missing payment_method', function(done) {
                delete payload.payment_method
                postAndVerify(payload, 400, {"error": "\'payment_method\' field required, the value should be either \'LOCAL\' or \'SWIFT\'"}, done);
            });

            it('Verify Missing account_name', function(done) {
                delete payload.account_name
                postAndVerify(payload, 400, {"error":"\'account_name\' is required"}, done);
            });

            it('Verify Missing account_number', function(done) {
                delete payload.account_number
                postAndVerify(payload, 400, {"error":"\'account_number\' is required"}, done);
            });

            it('Verify Missing bank_country_code', function(done) {
                delete payload.bank_country_code
                postAndVerify(payload, 400, {"error":"\'bank_country_code\' is required, and should be one of \'US\', \'AU\', or \'CN\'"}, done);
            });
        });

        describe('Verify Invalid Filed Length Logics', function() {
            it('Verify Long Account Name Length (11 - 20)', function(done) {
                payload.account_name = randomString(getRandomInt(11, 20));
                postAndVerify(payload, 400, {"error":"Length of account_name should be between 2 and 10"}, done);
            });

            it('Verify Short Account Name Length (1)', function(done) {
                payload.account_name = randomString(getRandomInt(1, 1));
                postAndVerify(payload, 400, {"error":"Length of account_name should be between 2 and 10"}, done);
            });

            it('Verify Long US Account Number Length(18 - 20)', function(done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "US";
                payload.account_number = randomString(getRandomInt(18, 20));
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                postAndVerify(payload, 400, {"error":"Length of account_number should be between 1 and 17 when bank_country_code is \'US\'"}, done);
            });

            it('Verify Short AU Account Number Length(1 - 5)', function(done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "AU";
                payload.account_number = randomString(getRandomInt(1, 5));
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                postAndVerify(payload, 400, {"error":"Length of account_number should be between 6 and 9 when bank_country_code is \'AU\'"}, done);
            });

            it('Verify Long AU Account Number Length(10 - 20)', function(done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "AU";
                payload.account_number = randomString(getRandomInt(10, 20));
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                postAndVerify(payload, 400, {"error":"Length of account_number should be between 6 and 9 when bank_country_code is \'AU\'"}, done);
            });

            it('Verify CN Account Number Length(1 - 7)', function(done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "CN";
                payload.account_number = randomString(getRandomInt(1, 7));
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                postAndVerify(payload, 400, {"error":"Length of account_number should be between 8 and 20 when bank_country_code is \'CN\'"}, done);
            });

            it('Verify CN Account Number Length(21 - 30)', function(done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "CN";
                payload.account_number = randomString(getRandomInt(21, 30));
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                postAndVerify(payload, 400, {"error":"Length of account_number should be between 8 and 20 when bank_country_code is \'CN\'"}, done);
            });

            it('Verify AU Account w/ invalid bsb field length', function(done) {
                payload.bank_country_code = "AU";
                payload.bsb = randomString(getRandomElement([1,2,3,4,5,7,8,9,10]));
                postAndVerify(payload, 400,{"error":"Length of \'bsb\' should be 6"},  done);
            });

            it('Verify AU Account w/ invalid aba field length', function(done) {
                payload.bank_country_code = "US";
                payload.aba = randomString(getRandomElement([1,2,3,4,5,6,7,8,10,11,12]));
                postAndVerify(payload, 400, {"error":"Length of \'aba\' should be 9"}, done);
            });
        });

        describe('Verify bsb/aba Fileds Missing Scenarios', function() {
            it('Verify AU Account w/o bsb field', function(done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "AU";
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                delete payload.bsb
                postAndVerify(payload, 400, {"error":"\'bsb\' is required when bank country code is \'AU\'"}, done);
            });

            it('Verify US Account w/o aba field', function(done) {
                payload.payment_method = "LOCAL";
                payload.bank_country_code = "US";
                payload.swift_code = getSwiftCode(payload.bank_country_code);
                delete payload.aba
                postAndVerify(payload, 400, {"error":"\'aba\' is required when bank country code is \'US\'"}, done);
            });
        });

        describe('Verify Invalid SWIFT Code Scenarios', function() {
            it('Verify SWIFT Code w/o Country Code', function(done) {
                payload.payment_method = "SWIFT";
                payload.swift_code = randomString(getRandomElement([8, 11]));
                postAndVerify(payload, 400, {"error":"The swift code is not valid for the given bank country code: " + payload.bank_country_code}, done);
            });

            it('Verify SWIFT Code w/o Invalid Length', function(done) {
                payload.payment_method = "SWIFT";
                payload.swift_code = randomString(0, 2) + payload.bank_country_code + randomString(0, 7);
                postAndVerify(payload, 400, {"error":"Length of \'swift_code\' should be either 8 or 11"}, done);
            });

            it('Verify SWIFT w/ Empty SWIFT Code', function(done) {
                payload.payment_method = "SWIFT";
                payload.swift_code = ""
                postAndVerify(payload, 400, {"error":"\'swift_code\' is required when payment method is \'SWIFT\'"}, done);
            });

            it('Verify w/o SWIFT Code', function(done) {
                payload.payment_method = "SWIFT";
                delete payload.swift_code;
                postAndVerify(payload, 400, {"error":"\'swift_code\' is required when payment method is \'SWIFT\'"}, done);
            });
            
            it('Verify SWIFT w/ Invalid Lower Case Country Code', function(done) {
                payload.payment_method = "SWIFT";
                payload.swift_code = randomString(getRandomElement([6, 9])).insert(4, payload.bank_country_code.toLowerCase())
                postAndVerify(payload, 400, {"error":"The swift code is not valid for the given bank country code: " + payload.bank_country_code}, done);
            });
        });
    });
});