// 접근자 프로퍼티 정의하기를 클래스로 구현하기

class Person {
  constructor(name) {
    this.name = name;
  }

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  sayName() {
    console.log(this.name);
  }
}

var person = new Person('Jang');
console.log(person.name); // Jang
person.name = 'Son';
console.log(person.name); // Son
person.sayName(); // Son