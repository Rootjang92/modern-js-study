function compareFunc(key) {
  return function(a ,b) {
    return a[key] - b[key];
  };
}

var persons = [{name: "Tom", age: 17}, {name:"Huck", age: 18}, {name: 'Becky', age: 16}];
console.log(persons.sort(compareFunc("age")));


// [ { name: 'Becky', age: 16 },
//   { name: 'Tom', age: 17 },
//   { name: 'Huck', age: 18 } ]
// 특정 프로퍼티의 값으로 정렬하기