function Person(name) {
  Object.defineProperty(this, 'name', { // 객체에 직접 새로운 속성을 정의하거나 이미 존재하는 속성을 수정한 후 그 객체를 반환
    get: function() {
      return name;
    },
    set: function(newName) {
      name = newName;
    },
    enumerable: true, // 이 속성이 대상 객체의 속성 열거 시 노출된다면 true
    configurable: true // 이 속성의 값을 변경할 수 있고, 대상 객체에서 삭제할 수도 있다면 true.
  });
}

Person.prototype.sayName = function() {
  console.log(this.name);
}

var person = new Person('Jang');
console.log(person.name); // Jang
person.name = 'Kim';
console.log(person.name); // Kim
person.sayName(); // Kim