//import UserRegister from '../app/components/user/register';

///<reference path="/src/test/converted.js"/>


module("Checking if tests work");
test("testing static function",
    function() {
        var actual = '1';
        var expected = 1;
        ok(actual == expected, "Truth");
        equal(actual, expected, 'Are Equal');
    });

module("Checking if tests work");
test("testing matlib",
    function () {
        var temp = mathLib(5);
        var answer = 10;
        strictEqual(temp, answer);
    });