var s = "1 little,2 little indian";

console.log(s.search(/little/)); // 2
console.log(s.search(/\d/)); // 0
console.log(s.search(/\bindian/)); // 18, 일치한 i의 위치.
console.log(s.search(/3\s/)); // -1, 일치하지 않음.