const permutations = require('./permutations');

/**
 * PasswordListBuilder class
 *
 */
class PasswordListBuilder {

  constructor(opts) {
    this.bases = [];
    this.prefixes = [];
    this.suffixes = [];
    this.separators = [];
    this.baseLimit = false;
    this.repeatBases = opts.repeatBases || false;
    this.repeatSeparators = opts.repeatSeparators || false;
    this.passwordList = [];

    this.addBase(opts.bases || opts.base || []);
    this.addSeparator(opts.separators || opts.separator || opts.seps || opts.sep || []);
    this.addPrefix(opts.prefixes || opts.prefix || opts.pre || []);
    this.addSuffix(opts.suffixes || opts.suffix || opts.suf || opts.post || []);

    this.generate();

    return this;
  }

  add(value, prop) {
    return value.constructor === Array
    ? value.forEach(_this => prop.push(_this))
    : prop.push(value);
  }

  addBase(base) {
    return this.add(base, this.getBases());
  }

  addPrefix(prefix) {
    return this.add(prefix, this.getPrefixes());
  }

  addSeparator(separator) {
    return this.add(separator, this.getSeparators());
  }

  addSuffix(suffix) {
    return this.add(suffix, this.getSuffixes());
  }

  getBaseLimit() {
    return this.baseLimit;
  }

  getBases() {
    return this.bases;
  }

  getDuplicates(arr = false) {
    if (arr === false) {
      arr = this.getPasswordList();
    }

    const uniq = arr.reduce((a, b) => Object.assign(a, {[b]: (a[b] || 0) + 1}), {});

    return Object.keys(uniq).filter(a => uniq[a] > 1);
  }

  getPasswordList() {
    return this.passwordList === false
    ? this.generate()
    : this.passwordList;
  }

  getPrefixes() {
    return this.prefixes;
  }

  getRepeatBases() {
    return this.repeatBases;
  }

  getRepeatSeparators() {
    return this.repeatSeparators;
  }

  getSeparators() {
    return this.separators;
  }

  getSuffixes() {
    return this.suffixes;
  }

  getUnique(arr = false) {
    if (arr === false) {
      arr = this.getPasswordList();
    }

    return arr.constructor !== Array
    ? arr
    : [...new Set(arr) ];
  }

  setBaseLimit(limit) {
    return this.baseLimit = (limit.constructor === Array
    ? limit
    : parseInt(limit, 10));
  }

  setBases(base) {
    return this.getBases() = base;
  }

  setPasswordList(passwordList) {
    return this.passwordList = passwordList;
  }

  setPrefixes(prefix) {
    return this.getPrefixes() = prefix;
  }

  setSeparators(separators) {
    return this.getSeparators() = separators;
  }

  setSuffixes(suffix) {
    return this.getSuffixes() = suffix;
  }

  generate() {
    // Create base permutations
    const basePermutations = [];

    if (this.getBaseLimit()) {
      if (this.getBaseLimit().constructor === Array) {
        this.getBaseLimit()
        .forEach(baseLimit => permutations(this.getBases(), baseLimit, this.getRepeatBases())
        .forEach(permutation => basePermutations.push(permutation)));
      } else {
        permutations(this.getBases(), this.getBaseLimit(), this.getRepeatBases())
        .forEach(permutation => basePermutations.push(permutation));
      }
    } else {
      for (let baseLimit = 1; baseLimit <= this.getBases().length; baseLimit++) {
        permutations(this.getBases(), baseLimit, this.getRepeatBases())
        .forEach(permutation => basePermutations.push(permutation));
      }
    }

    // Create permuration seperators
    const separatedPermutations = [];
    const separatorsMatrix = [];

    basePermutations.forEach(permutation => {
      const seperators = this.separators;

      if (permutation.length === 1) {
        separatedPermutations.push(permutation.join(''));
      } else {
        if (!this.getRepeatSeparators()) {
          while (seperators.length < permutation.length - 1) {
            seperators.push('');
          }
        }

        if (typeof separatorsMatrix[permutation.length] === 'undefined') {
          separatorsMatrix[permutation.length] = permutations(
            seperators, permutation.length - 1, this.getRepeatSeparators());
        }

        separatorsMatrix[permutation.length]
        .forEach(seperator => {
          let merged = '';

          for (let i = 0; i < seperator.length; i++) {
            merged += permutation[i] + seperator[i];
          }

          merged += permutation[permutation.length - 1];

          separatedPermutations.push(merged);
        });
      }
    });

    // Create prefixes
    const prefixedPermutations = [];

    this.getPrefixes().forEach(prefix => {
      separatedPermutations.forEach(permutation => {
        prefixedPermutations.push(prefix + permutation);
      })
    });

    // Create suffixes
    const suffixedPermutations = [];

    this.getSuffixes().forEach(suffix => {
      separatedPermutations.forEach(permutation => {
        prefixedPermutations.push(permutation + suffix);
      })
    });

    // Create prefix and suffixes
    const preAndSuffixedPermutations = [];
    
    if (this.getPrefixes().length && this.getSuffixes().length) {
      this.getPrefixes().forEach(prefix => {
        this.getSuffixes().forEach(suffix => {
          separatedPermutations.forEach(permutation => {
            preAndSuffixedPermutations.push(prefix + permutation + suffix);
          })
        });
      });
    }

    this.setPasswordList([
      ...separatedPermutations,
      ...prefixedPermutations,
      ...suffixedPermutations,
      ...preAndSuffixedPermutations
    ]);

    return this.getPasswordList();
  }

}

module.exports = PasswordListBuilder;
