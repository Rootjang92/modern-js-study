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

var ellipse = new Ellipse(5, 3);

console.log(ellipse.getArea()); // 47.12388980384689
console.log(ellipse.toString()); // Ellipse 5 3