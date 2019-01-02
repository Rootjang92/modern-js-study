const a = [5,4,3];
let iter = a[Symbol.iterator]();

console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

// { value: 5, done: false }
// { value: 4, done: false }
// { value: 3, done: false }
// { value: undefined, done: true }
// { value: undefined, done: true }