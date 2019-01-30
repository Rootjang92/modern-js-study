class Circle {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }
  area() {
    return Math.PI*this.radius*this.radius;
  }
  toString() {
    return "Circle " + "중심정 (" + this.center.x + "," + this.center.y + "), 반지름 = " + this.radius;
  }
}

class Ball extends Circle {
  move(dx, dy) {
    this.center.x += dx;
    this.center.y += dy;
  }
}

var ball = new Ball({x: 0, y: 0}, 2);
console.log(ball.toString());
console.log(ball.area());
ball.move(1, 2);
console.log(ball.toString());

// Circle 중심정 (0,0), 반지름 = 2
// 12.566370614359172
// Circle 중심정 (1,2), 반지름 = 2