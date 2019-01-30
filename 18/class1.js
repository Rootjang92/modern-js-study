// function Circle(center, radius) {
//   this.center = center;
//   this.radius = radius;
// }

// Circle.prototype.area = function() {
//   return Math.PI*this.radius*this.radius;
// }

// 위를 클래스로 변경하면

class Circle {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }

  area() {
    return Math.PI*this.radius*this.radius;
  }
}

var c = new Circle({x: 0, y: 0}, 2);
console.log(c.area()); // 12.566370614359172