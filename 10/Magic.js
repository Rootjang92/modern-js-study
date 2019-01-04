// 3x3 마방진

function permutation(a) {
  return a.reduce(function(list, element) {
    var newList = []; // 새로운 순열 목록 저장.
    list.forEach(seq => { // seq 배열 끝에서 두 번째 요소부터 앞에서 두번째 요소에 이르기까지 차례대로 element 삽입.
      for (var i = seq.length; i>=0; i--) {
        var newseq = [].concat(seq);
        newseq.splice(i, 0, element);
        newList.push(newseq);
      }
    });
    return newList;
  },[[]]);
}

var N = 3;

for (var i = 1, a=[]; i<=N*N; i++) {
  a = a.concat(i);
}

var m = new Array(N);
for(var i = 0; i<N; i++) m[i] = new Array(N);

permutation(a).forEach(p => {
  for (var i = 0, index = 0; i<N; i++) {
    for (var j = 0; j < N; j++) {
      m[i][j] = p[index++];
    }
  }
  if( isMagicSquare(m) ) {
    m.forEach(v => { console.log(v); });
    console.log("-----");
  }
});

function isMagicSquare(m) {
  var n = m.length;
  var s = n*(n*n+1)/2; // 행,열, 대각선의 합이 이 값일 경우에는 마방진.
  var sumDiagonalR = 0; // 오른쪽 대각선 합
  var sumDiagonalL = 0; // 왼쪽 대각선 합
  for (var i = 0; i<n; i++) {
    var sumRow = 0;
    var sumColumn = 0;
    for (var j = 0; j<n; j++) {
      sumRow += m[i][j];
      sumColumn += m[j][i];
    }
    if( sumRow != s || sumColumn != s) return false;
    sumDiagonalR += m[i][j];
    sumDiagonalL += m[i][n-i-1];
  }
  if( sumDiagonalR != s || sumDiagonalL != s) return false;
  return true;
}


// 실행안됨.