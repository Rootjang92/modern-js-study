Array.prototype[Symbol.for("shuffle")] = function() {
  var a = this;
  var m = a.length, t, i;
  while(m) {
    i = Math.floor(Math.random()*m--); // m미만의 인덱스 하나씩 삭제
    t = a[m]; a[m] = a[i]; a[i] = t;
  }
  return this;
};

var array = [0,1,2,3,4,5,6,7,8,9];
console.log(array[Symbol.for("shuffle")]()); // [ 9, 6, 3, 1, 4, 8, 2, 5, 7, 0 ]