const assert = require('assert');

const PasswordListBuilder = require('../');
const permutations = require('../permutations');

describe('Test permutations', _ => {

  it('should create correct number of permutations without repeated values', done => {
    const results = permutations([1,2,3], 3, false);
    assert.equal(results.length, 2 * 3);
    done();
  });

  it('should create correct number of permutations with repeated values', done => {
    const results = permutations([1,2,3], 3, true);
    assert.equal(results.length, 3 * 3 * 3);
    done();
  });

  it('should include correct combo of many', done => {
    const comboLength = 2;
    const results = permutations('0123456789'.split(''), comboLength, true)
    .map(result => result.join(''));
    const randomKey = Math.floor(Math.random() * Math.pow(10, comboLength)).toString();
    assert.equal(results.indexOf(randomKey) > 0, true);
    done();
  });

});

describe('Create some smart password lists', _ => {

  it('should combine 3 items in every way possible', done => {
    const pwBuilder = new PasswordListBuilder({
      bases: '123'.split('')
    });

    assert.equal(pwBuilder.getPasswordList().length, 3 + 6 + 6);
    done();
  });

  it('should use separators properly', done => {
    const pwBuilder = new PasswordListBuilder({
      bases: '123'.split(''),
      separators: ['-', '-']
    });

    assert.equal(pwBuilder.getPasswordList().indexOf('1-2-3') > 0, true);
    done();
  });

  it('should prefix and suffix correctly', done => {
    const pwBuilder = new PasswordListBuilder({
      base: 'hello',
      pre: 'hi',
      post: 'bye'
    });

    assert.equal(pwBuilder.getPasswordList().length, 4);
    done();
  });

  it('should build hella passwords without dupes', done => {
    const pwBuilder = new PasswordListBuilder({
      bases: ['alpha', 'bravo', 'delta', 'echo', 'kek' ],
      separators: [ '1', '2', '3', '4', '5' ],
      prefixes: [ 'la', 'el' ],
      suffixes: [ 'x', 'z' ]
    });

    assert.equal(pwBuilder.getPasswordList().length > 200000, true);
    assert.equal(pwBuilder.getDuplicates().length, 0);
    done();
  });

});
