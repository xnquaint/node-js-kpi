`use strict`

// Задача 1. Напишіть функцію add(), яка приймає будь-яку кількість параметрів у такому вигляді: 
// console.log(add(2)(5)(7)(1)(6)(5)(11)()); // 37

function createAdd() {
  let sum = 0;

  function adder(number) {
    if (typeof number === 'undefined') {
      const result = sum;
  
      sum = 0;
  
      return result;
    }

    sum += number;

    return adder;
  };

  return adder;
}

const add = createAdd();
console.log(add(2)(5)(7)(1)(6)(5)(11)());

// Задача 2. Напишіть функцію, яка бере два рядки і повертає true, якщо вони є анаграмами одне одного.

function checkForAnagram(line1, line2) {
  if (!line1 || !line2) {
    throw new Error('Strings length must be greater than 0');
  }
  
  const filteredLine1 = line1.toLowerCase().split('').filter(item => item !== ' ').sort().join('');
  const filteredLine2 = line2.toLowerCase().split('').filter(item => item !== ' ').sort().join('');

  if (filteredLine1.length !== filteredLine2.length) {
    throw new Error('Strings must be the same length');
  }

  return filteredLine1 === filteredLine2;
}

console.log(checkForAnagram('che ater  s     ', 'hecta res '));

// Задача 3. Напишіть функцію, яка глибоко клонує об'єкт, переданий їй параметром. 

function deepClone(obj) {
  const cloneObj = {};

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      cloneObj[key] = deepClone(obj[key]);
    } else {
      cloneObj[key] = obj[key];
    }
  }

  return cloneObj;
}
