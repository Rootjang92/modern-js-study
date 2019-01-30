class Person {
  constructor(name) {
    this.name = name;
    Person.personCount++;
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

  static count() {
    return Person.personCount;
  }
}

Person.personCount = 0;

var person1 = new Person('Jang');
console.log(Person.count()); // 1
var person2 = new Person('Lee');
console.log(Person.count()); // 2