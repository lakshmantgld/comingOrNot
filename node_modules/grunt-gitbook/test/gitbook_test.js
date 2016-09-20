var assert = require('assert'),
        fs = require('fs'),
        helpers = module.exports;

helpers.assertFile = function (file, reg) {
    var here = fs.existsSync(file);
    assert.ok(here, file + ', no such file or directory');

    if (!reg) {
        return assert.ok(here);
    }

    assert.ok(reg.test(fs.readFileSync(file, 'utf8')), file + ' exists but doesn\'t contain expected values');
};

describe('grunt-gitbook', function() {

    it('should create dest/index.html', function(){
        helpers.assertFile('test/dest/index.html');
    });

    it('should create dest/test.html', function(){
        helpers.assertFile('test/dest/test.html');
    });
});