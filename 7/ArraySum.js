function sumArr(a) {
  var sum = 0;
  for (var i = 0; i < a.length; i++) {
    sum += a[i];
  }
  return sum;
}

var a = [3,5,7,9];
console.log(sumArr(a)); // 24