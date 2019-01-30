// 생성자 빌려오기

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
Circle.prototype.toString = function() {
  return "Circle " + this.a + " " + this.b;
};

var circle = new Circle(2);
console.log(circle.getArea());
console.log(circle.toString());

// 12.566370614359172
// Circle 2 2