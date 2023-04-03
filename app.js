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

// Задача 4. Напишіть функцію-обгортку, яка кешуватиме результат будь-якої іншої функції з довільною кількістю числових параметрів. Приклад (псевдокод):
// const calc = (a, b, c) => a+b+c;
// const wrapper = (args) => {
//         // код вашої функції
// };
// const cachedCalc = wrapper(add);
// cachedCalc(2,2,3); // 7 calculated
// cachedCalc(5,8,1); // 14 calculated
// cachedCalc(2,2,3); // 7 from cache

const calc = (...args) => args.reduce((a, b) => a + b, 0);

function hash(args) {
  return [].join.call(args);
}

function wrapper (func, hash) {
  let cache = new Map();

  return function(){
    let key = hash(arguments);

    if (cache.has(key)) {
      console.log(`Restored from cache with key ${key}`);
      return cache.get(key);
    }

    let result = func.call(this, ...arguments);

    cache.set(key, result);
    return result;
  };
};

const cachedCalc = wrapper(calc, hash);

console.log(cachedCalc(2, 2, 3));
console.log(cachedCalc(5, 8, 1));
console.log(cachedCalc(2, 2, 3));




