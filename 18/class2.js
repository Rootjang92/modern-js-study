var Circle = class {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }

  area() {
    return Math.PI*this.radius*this.radius
  }
}

// 클래스 선언문 방식.