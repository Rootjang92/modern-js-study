function sleepAndError(g, n) {
  setTimeout(function() {
    for(var i = 0; i < n; i++) {
      console.log(i);
    }
    g.throw(new Error("오류가 발생하였습니다."));
  }, 1000);
}
// 테스트용 함수로 제네레이터를 인수로 받는다.

function run(callback, ...argsList) {
  var g = (function* (cb, args) {
    try {
      yield cb(g, ...args);
    } catch(e) {
      console.log("에외를 잡음 -> " + e);
    }
  })(callback, argsList);
  g.next();
}
// 콜백 함수가 비동기 처리 중에 발생시킨 예외도 잡아서 처리하도록.
run(sleepAndError,10);
// 실행하기