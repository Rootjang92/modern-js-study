var s = "1 little,2 little indian";

console.log(s.search(/little/)); // 2
console.log(s.search(/\d/)); // 0
console.log(s.search(/\bindian/)); // 18, 일치한 i의 위치.
console.log(s.search(/3\s/)); // -1, 일치하지 않음.


// replace
console.log(s.replace(/indian/, "boy")); // 1 little,2 little boy
console.log(s.replace(/little/,"big")); // 1 big,2 little indian
console.log(s.replace(/little/g, "big")); // 1 big,2 big indian


// 치환 패턴

// 전화번호 예제
var person = "Tom, tom@example.com, 010-1234-5678";
var result = person.replace(/0(\d{1,4}-\d{1,4}-\d{4})/g, "+82-$1");
console.log(result); // Tom, tom@example.com, +82-10-1234-5678

// 날짜 서식
var date = '오늘은 2019년1월16일 입니다.';
var result = date.replace(/(\d+)년(\d+)월(\d+)일/, "$1/$2/$3");
console.log(result); // 오늘은 2019/1/16 입니다.

// 성과 이름 바꾸기
var name = "Geunho Jang";
var result = name.replace(/(\w+)\s(\w+)/, "$2 $1");
console.log(result); // Jang Geunho