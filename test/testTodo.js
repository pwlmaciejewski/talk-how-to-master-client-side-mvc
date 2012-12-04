module('Item model');

test('Item instance', function () {
	equal(typeof new TODO.Item(), 'object');
});