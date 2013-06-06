var groan = require('./../groan.js');

module.exports.groan = {
    setUp: function (done) {
        done();
    },

    "string": function (test) {
        var session, expected, result;
        test.expect(2);

        session = 's:0:"";';
        expected = "";
        result = groan(session);
        test.equal(result, expected);

        session = 's:11:"test string";';
        expected = 'test string';
        result = groan(session);
        test.equal(result, expected);

        test.done();
    },

    "integer": function (test) {
        var session, expected, result;
        test.expect(2);

        session = 'i:1;';
        expected = 1;
        result = groan(session);
        test.equal(result, expected);

        session = 'i:123456789;';
        expected = 123456789;
        result = groan(session);
        test.equal(result, expected);

        test.done();
    },

    "double": function (test) {
        var session, expected, result;
        test.expect(2);

        session = 'd:1;';
        expected = 1;
        result = groan(session);
        test.equal(result, expected);

        session = 'd:1234.56789;';
        expected = 1234.56789;
        result = groan(session);
        test.equal(result, expected);

        test.done();
    },

    "boolean": function (test) {
        var session, expected, result;
        test.expect(2);

        session = 'b:1;';
        expected = true;
        result = groan(session);
        test.equal(result, expected);

        session = 'b:0;';
        expected = false;
        result = groan(session);
        test.equal(result, expected);

        test.done();
    },

    "null": function (test) {
        var session, expected, result;
        test.expect(1);

        session = 'N;';
        expected = null;
        result = groan(session);
        test.equal(result, expected);

        test.done();
    },

    "custom class": function (test) {
        var session, expected, result;
        test.expect(1);

        // groan only returns value of object class
        session = 'C:7:\"MongoId\":5:{abcde}';
        expected = 'abcde';
        result = groan(session);
        test.equal(result, expected);

        test.done();
    },

    "string with non-ascii characters": function (test) {
        var session, expected, result;
        test.expect(1);

        session = 's:10:"åäöæø";';
        expected = "åäöæø";
        result = groan(session);
        test.equal(result, expected);

        test.done();
    },

    "string with special characters": function (test) {
        var session, expected, result;
        test.expect(1);

        session = 's:17:""\':;,.#€%$&/()=";';
        expected = "\"':;,.#€%$&/()=";
        result = groan(session);
        test.equal(result, expected);

        test.done();
    },

    "object containing MongoDate": function (test) {
        var session, expected, result;
        test.expect(1);

        session = 'O:9:"MongoDate":2:{s:3:"sec";i:1356098759;s:4:"usec";i:279000;}';
        expected = { sec: 1356098759, usec: 279000 }; // groan discards object name
        result = groan(session);
        test.deepEqual(result, expected);

        test.done();
    },

    "nested variables": function (test) {
        var session, expected, result;
        test.expect(3);

        session = 'a:1:{i:0;a:2:{i:0;s:29:"nested test åäöæø :/\\=?&";i:1;s:1:"2";}}';
        expected = [
            ['nested test åäöæø :/\\=?&', '2']
        ];
        result = groan(session);
        test.deepEqual(result, expected, "Failed nested arrays");

        session = 'a:1:{s:1:"x";a:2:{s:1:"a";s:29:"nested test åäöæø :/\\=?&";s:1:"b";s:1:"2";}}';
        expected = { x: { a: 'nested test åäöæø :/\\=?&', b: '2' }};
        result = groan(session);
        test.deepEqual(result, expected, "Failed nested objects");

        session = 'a:1:{i:0;a:2:{s:1:"a";s:29:"nested test åäöæø :/\\=?&";s:1:"b";s:1:"2";}}';
        expected = [
            { a: 'nested test åäöæø :/\\=?&', b: '2' }
        ];
        result = groan(session);
        test.deepEqual(result, expected, "Failed arrays with nested objects");

        test.done();
    },

    "session variables": function (test) {
        var session, expected, result;
        test.expect(1);

        session = 'var1|a:2:{s:1:"a";s:1:"1";s:1:"b";s:1:"2";}var2|a:1:{s:1:"c";s:1:"3";}';
        expected = {
            var1: { a: '1', b: '2' },
            var2: { c: '3' }
        };
        result = groan(session);
        test.deepEqual(result, expected);

        test.done();
    }
};