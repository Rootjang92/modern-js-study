// 에라토스테네스의 체

function Primes(n) {
  // 2 ~ n 사이의 소수 구하기
  var p = [];
  for ( var i = 2; i <= n; i++) p[i] = true;
  var max = Math.floor(Math.sqrt(n));
  var x = 2;
  while(x<=max) {
    for(var i = 2*x; i<=n; i+=x) p[i] = false;
    while(!p[++x]) ;
  }
  // 소수만 꺼내서 배열에 저장하기
  var primes = [], nprimes = 0;
  for (var i = 2; i<=n; i++) if(p[i]) primes[nprimes++] = i;
  p = null; // 필요 없어진 거 해제
  // 소수 m개를 무작위로 선택하여 곱한 값을 반환.
  return function(m) {
    for(var i = 0, product=1; i<m; i++) {
      product *= primes[Math.floor(Math.random() * nprimes)];
    }
    return product;
  };
}

var primeProduct = Primes(100000);
console.log(primeProduct(2));
console.log(primeProduct(2));