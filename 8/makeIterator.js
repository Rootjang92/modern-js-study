function makeIterator(array) {
  var index = 0;
  return {
   next: function() {
    return index < array.length ? {value: array[index++], done: false} : {value: undefined, done: true};
   }
  };
 };

var iter = makeIterator(['a','b','c']);
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());