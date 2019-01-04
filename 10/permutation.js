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

var a = [1,2,3];
permutation(a).forEach(v => { console.log(v); });

// [ 1, 2, 3 ]
// [ 1, 3, 2 ]
// [ 3, 1, 2 ]
// [ 2, 1, 3 ]
// [ 2, 3, 1 ]
// [ 3, 2, 1 ]