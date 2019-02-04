const assert = require('assert');

const PasswordListBuilder = require('../');

describe('Combine things', _ => {

  it('should combine a 3 item array in every way possible', done => {
    const d = new PasswordListBuilder();
    d.addBase(['1', '2', '3']);
    const results = d.generate();

    assert.equal(results.length, 3 + 6 + 6);
    done();
  });

  it('should prefix and suffix correctly', done => {
    const d = new PasswordListBuilder();
    d.addBase('hello');
    d.addPrefix('hi');
    d.addSuffix('bye');
    const results = d.generate();

    assert.equal(results.length, 4);
    done();
  });

  it('should build hella passwords without dupes', done => {
    const d = new PasswordListBuilder();
  });

});
