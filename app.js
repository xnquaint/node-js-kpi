`use strict`

// Задача 1. Напишіть функцію add(), яка приймає будь-яку кількість параметрів у такому вигляді: 
// console.log(add(2)(5)(7)(1)(6)(5)(11)()); // 37

function createAdd() {
  let sum = 0;

  function addRecursive(number) {
    if (typeof number === 'undefined') {
      const result = sum;
  
      sum = 0;
  
      return result;
    }

    sum += number;

    return addRecursive;
  };

  return addRecursive;
}

const add = createAdd();
console.log(add(2)(5)(7)(1)(6)(5)(11)());


