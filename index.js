const permutations = require('./permutations');

class PasswordListBuilder {

  constructor(
    bases = [],
    separators = [],
    prefixes = [],
    suffixes = [],
    baseLimit = false
  ){
    this.bases = [];
    this.prefixes = [];
    this.suffixes = [];
    this.separators = [];
    this.baseLimit = baseLimit;

    if (bases) {
      this.addBase(bases);
    }
    if (separators) {
      this.addSeparator(separators);
    }
    if (prefixes) {
      this.addPrefix(prefixes);
    }
    if (suffixes) {
      this.addSuffix(suffixes);
    }
  }

  // Getters

  getBases() {
    return this.bases;
  }

  getPrefixes() {
    return this.prefixes;
  }

  getSuffixes() {
    return this.suffixes;
  }

  getSeparators() {
    return this.separators;
  }

  getBaseLimit() {
    return this.baseLimit;
  }

  // Setters

  setBases(base) {
    return this.getBases() = base;
  }

  setPrefixes(prefix) {
    return this.getPrefixes() = prefix;
  }

  setSuffixes(suffix) {
    return this.getSuffixes() = suffix;
  }

  setSeparators(separators) {
    return this.getSeparators() = separators;
  }

  setBaseLimit(limit) {
    return this.baseLimit = parseInt(limit, 10);
  }

  // Adders

  addBase(base) {
    if (base.constructor === Array) {
      return base.forEach(_base => this.getBases().push(_base));
    } else {
      return this.getBases().push(base);
    }
  }

  addPrefix(prefix) {
    if (prefix.constructor === Array) {
      return prefix.forEach(_prefix => this.getPrefixes().push(_prefix));
    } else {
      return this.getPrefixes().push(prefix);
    }
  }

  addSuffix(suffix) {
    if (suffix.constructor === Array) {
      return suffix.forEach(_suffix => this.getSuffixes().push(_suffix));
    } else {
      return this.getSuffixes().push(suffix);
    }
  }

  addSeparator(separator) {
    if (separator.constructor === Array) {
      return separator.forEach(_sep => this.getSeparators().push(_sep));
    } else {
      return this.getSeparators().push(separator);
    }
  }

  // Doers

  generate() {
    // Create base permutations
    const basePermutations = [];

    if (this.getBaseLimit()) {
      permutations(this.getBases(), this.getBaseLimit())
      .forEach(permutation => basePermutations.push(permutation));
    } else {
      for (let i = 1; i <= this.getBases().length; i++) {
        permutations(this.getBases(), i)
        .forEach(permutation => basePermutations.push(permutation));
      }
    }

    // Create permuration seperators
    const permutationsWithSeperators = [];

    basePermutations.forEach(permutation => {
      const seperators = this.separators;

      if (permutation.length === 1) {
        permutationsWithSeperators.push(permutation[0]);
      } else {
        while (seperators.length < permutation.length - 1) {
          seperators.push('');
        }

        permutations(seperators, permutation.length - 1)
        .forEach(seperator => {
          let merged = '';
  
          for (let i = 0; i < seperator.length; i++) {
            merged += permutation[i] + seperator[i];
          }
  
          merged += permutation[permutation.length - 1];

          permutationsWithSeperators.push(merged);
        });
      }
    });

    // Create prefixes
    const permutationsWithPrefixes = [];

    this.getPrefixes().forEach(prefix => {
      permutationsWithSeperators.forEach(permutation => {
        permutationsWithPrefixes.push(prefix + permutation);
      })
    });

    // Create suffixes
    const permutationsWithSuffixes = [];

    this.getSuffixes().forEach(suffix => {
      permutationsWithSeperators.forEach(permutation => {
        permutationsWithPrefixes.push(permutation + suffix);
      })
    });

    // Create prefix and suffixes
    const permutationsWithPrefixesAndSuffixes = [];
    if (this.getPrefixes().length && this.getSuffixes().length) {
      this.getPrefixes().forEach(prefix => {
        this.getSuffixes().forEach(suffix => {
          permutationsWithSeperators.forEach(permutation => {
            permutationsWithPrefixesAndSuffixes.push(prefix + permutation + suffix);
          })
        });
      });
    }

    return [
      ...permutationsWithSeperators,
      ...permutationsWithPrefixes,
      ...permutationsWithSuffixes,
      ...permutationsWithPrefixesAndSuffixes
    ];
  }

}

module.exports = PasswordListBuilder;
