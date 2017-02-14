module('Checking if tests work');
test('testing static function',
    function() {
        const actual = '1';
        const expected = 1;
        ok(actual == expected, 'Truth"');
        equal(actual, expected, 'Are Equal');
    });

module('Checking if tests work');
test('testing matlib',
    function () {
        let temp = mathLib(5);
        const answer = 10;
        strictEqual(temp, answer);
    });
