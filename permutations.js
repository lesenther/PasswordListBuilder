const jStr = JSON.stringify;

/**
 *
 * @param {Array} arr Elements to create permutations with
 * @param {Number} len Number of elements in each set
 * @param {Boolean} repeat Whether use each value only once or from one to len times
 * @param {Array} prefix
 */
function permutations(arr, len, repeat = false, prefix = []) {
  len = len || arr.length;
  const results = [];

  if (prefix.length === len) {
    return [ prefix ];
  } else {
    arr.forEach(elem => {
      let newArr = null;

      if (!repeat) {
        newArr = [ ...arr ];
        newArr.splice(newArr.indexOf(elem), 1);
      }

      permutations(repeat ? arr : newArr, len, repeat, [ ...prefix, elem ])
      .forEach(result => {
        if (!results.find(r => jStr(result) === jStr(r))) {
          results.push(result);
        }
      });
    });

    return results;
  }
}

module.exports = permutations;
