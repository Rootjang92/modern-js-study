// 슈퍼타입 메서드 이용하기

function Ellipse(a, b) {
  this.a = a;
  this.b = b;
}
// 타원 넓이
Ellipse.prototype.getArea = function() {
  return Math.PI*this.a*this.b;
};

Ellipse.prototype.toString = function() {
  return "Ellipse " + this.a + " " + this.b;
};

function Circle(r) {
  Ellipse.call(this, r, r);
}

Circle.prototype = Object.create(Ellipse.prototype, {
  constructor: {
    configurable: true,
    enumerable: true,
    value: Circle,
    wirtable: true
  }
});

// 슈퍼타입 toString 메서드를 이용해서 Circle.prototype.toString을 정의.

Circle.prototype.toString = function() {
  var str = Ellipse.prototype.toString.call(this);
  return str.replace("Ellipse", "Circle");
}

var circle = new Circle(2);
console.log(circle.getArea());
console.log(circle.toString());

// 12.566370614359172
// Circle 2 2