`use strict`

// Задача 1. Напишіть функцію add(), яка приймає будь-яку кількість параметрів у такому вигляді: 
// console.log(add(2)(5)(7)(1)(6)(5)(11)()); // 37

function addFunction(item: number): Function {
  let sum = item;

  function adder(number?: number): Function | number {
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

console.log(addFunction(2)(5)(7)(1)(6)(5)(11)());

// Задача 2. Напишіть функцію, яка бере два рядки і повертає true, якщо вони є анаграмами одне одного.

function checkForxagram(line1: string, line2: string) {
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

type Sex = 'male' | 'female';

interface IPerson {
  name: string,
  age: number,
  sex?: Sex,
}

function deepClone<T extends object>(obj: T): T {
  const cloneObj = {} as T;

  for (const key in obj) {
    const value = obj[key as keyof T];

    if (value instanceof Object) {
      cloneObj[key as keyof T] = deepClone(value) as T[keyof T];
    } else {
      cloneObj[key as keyof T] = value;
    }
  }

  return cloneObj;
}

const pers1: IPerson = {
  'name': 'Sasha',
  'age': 13,
  'sex': 'male'
}

const copy = pers1;
const clone = deepClone(pers1);

console.log(pers1 === copy);
console.log(pers1 === clone);
console.log(clone);

// Задача 4. Напишіть функцію-обгортку, яка кешуватиме результат будь-якої іншої функції з довільною кількістю числових параметрів. Приклад (псевдокод):
// const calc = (a, b, c) => a+b+c;
// const wrapper = (args) => {
//         // код вашої функції
// };
// const cachedCalc = wrapper(add);
// cachedCalc(2,2,3); // 7 calculated
// cachedCalc(5,8,1); // 14 calculated
// cachedCalc(2,2,3); // 7 from cache

const calc = (...args: number[]) => args.reduce((a, b) => a + b, 0);

function hash(...args: number[]) {
  return Array.from(args).join(",");
}

function wrapper(func: (...args: number[]) => number, hashFunc: (...args: number[]) => string) {
  const cache = new Map<string, number>();

  return (...args: number[]) => {
    const key = hashFunc(...args);

    if (cache.has(key)) {
      console.log(`Restored from cache with key ${key}`);
      return cache.get(key);
    }

    const result = func(...args);

    cache.set(key, result);
    return result;
  };
}

const cachedCalculate = wrapper(calc, hash);

console.log(cachedCalculate(2, 2, 3));
console.log(cachedCalculate(5, 8, 1));
console.log(cachedCalculate(2, 2, 3));
