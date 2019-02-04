const jStr = JSON.stringify;

/**
 *
 * @param {Array} arr
 * @param {Number} len
 * @param {Array} prefix
 * @param {Boolean} repeat Whether to allow repeated values // TODO:  Why would I want to include this?
 */
function permutations(arr, len, prefix = [], repeat = false) {
  len = len || arr.length;
  const results = [];

  if (prefix.length === len) {
    return [ prefix ];
  } else {
    for (let elem of arr) {
      let newArr = null;

      if (!repeat) {
        newArr = [ ...arr ];
        newArr.splice(newArr.indexOf(elem), 1);
      }

      permutations(repeat ? arr : newArr, len, [ ...prefix, elem ], repeat)
      .forEach(result => {
        if (repeat ||
          (!repeat && !results.find(r => jStr(result) === jStr(r)))
        ) {
          results.push(result);
        }
      });
    }

    return results;
  }
}

module.exports = permutations;
