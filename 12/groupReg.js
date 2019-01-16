var header = /<(h[1-6])>.*<\/\1>/;
console.log(header.test("<h1>JavaScript</h1>")); // true
console.log(header.test("<h2>JavaSCript</h2>")); // true