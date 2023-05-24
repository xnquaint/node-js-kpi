// 1. Напишіть функцію, яка приймає будь-який тип масиву та асинхронний колбек, який викликається для кожного елемента масиву послідовно. Результатом виклику має бути масив результатів колбеку. Усі типи мають застосовуватися автоматично (функція шаблону). Приклад виклику:

// const array: Array<string> = ["one", "two", "three"];
// const results = await runSequent(array, (item, index) =>
//     Promise.resolve({
//         item,
//         index,
//     })
// );

// IDE має розглядати змінні з прикладу так:
// item type = string
// index type = number
// results type = Array<{item: string, index: number}>

async function runSequent<T, RES>(arr: Array<T>, callback: (item: T, index: number) => Promise<RES>) {
    let result: Awaited<RES>[] = [];
    for (let i = 0; i < arr.length; i++) {
        let item = await callback(arr[i], i);
        result.push(item);
    }
    return result;
};

async function foo() {
  const array: Array<string> = ["one", "two", "three"];
  const results = await runSequent(array, (item, index) =>
      Promise.resolve({
          item,
          index,
      })
  );

  console.log(results);
}

foo();

// 2. Напишіть функцію, яка приймає будь-який тип масиву та правило для видалення елементів масиву. Функція змінює переданий масив, а усі видалені елементи функція повертає окремим масивом такого ж типу. Усі типи мають застосовуватися автоматично (функція шаблону). Приклад виклику:
// const array = [1, 2, 3, 6, 7, 9];
// const deletedElements = arrayChangeDelete(array, (item) => item % 2 === 0);

// IDE має розглядати змінні з прикладу так:
// item: number
// deletedElements: Array
// результат виклику:
// array = [1, 3, 7, 9]
// deletedElements = [2, 6]

function arrayChangeDelete<T>(array: Array<T>, rule: (item: T) => boolean): Array<T> {
  const deletedElements = array.filter(rule);

  array.splice(0, array.length, ...array.filter(item => !rule(item)));

  return deletedElements;
}

const array = [1, 2, 3, 6, 7, 9];
const deletedElements = arrayChangeDelete(array, (item) => item % 2 === 0);

console.log(array);
console.log(deletedElements);

// 3. Напишіть скрипт, який отримує з командного рядка рядковий параметр - шлях до JSON-файла із масивом рядків - посилань, читає та аналізує його вміст. Скрипт має створити папку «<JSON_filename>_pages» і для кожного посилання із <JSON-файла отримати його HTML-вміст і зберегти цей вміст у окремому файлі в новоствореній папці. Приклад JSON-файла (list.json) прикріплений до цього практичного завдання нижче.

import {AxiosResponse} from "axios";
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const filename: string = process.argv.slice(2)[0];
const pagesDirname: string = path.basename(filename, '.json') + '_pages';
fs.mkdirSync(pagesDirname, {recursive: true});

const urls: string[] = require(`./${filename}`);
Promise.all(urls.map((url: string) => axios.get(url)))
    .then((responses: Array<AxiosResponse<string>>) => {
        responses.forEach((response: AxiosResponse<string>, index: number) => {
            const url: string = response.config.url!;
            const html: string = response.data;
            const pageFilename: string = path.join(pagesDirname, `page_${index + 1}.html`);
            fs.writeFileSync(pageFilename, html);
            console.log(`Saved ${url} to ${pageFilename}`);
        });
    })
    .catch((error: Error) => console.error(error));

// 4. Напишіть скрипт, який отримує з командного рядка числовий параметр – частоту в секундах. Скрипт має виводити на кожному тику (визначеному частотою) наступну системну інформацію:

// - operating system;
// - architecture;
// - current user name;
// - cpu cores models;
// - cpu temperature;
// - graphic controllers vendors and models;
// - total memory, used memory, free memory в GB;
// - дані про батарею (charging, percent, remaining time). 

// Знайдіть і використайте функціональність підходящих модулів.

import * as os from 'os';
import * as si from 'systeminformation';


function printSystemInfo() {
    console.log(`Operating system: ${os.type()} ${os.release()} (${os.arch()})`);
    console.log(`Current user name: ${os.userInfo().username}`);
    console.log('CPU cores models:');
    os.cpus().forEach((cpu, i) => {
        console.log(`CPU ${i + 1} core model: ${cpu.model}`);
    });
    si.cpuTemperature().then(data => {
        console.log(`CPU temperature: ${data.main}`);
    });
    si.graphics().then(data => {
        console.log('Graphic controllers vendors and models:');
        data.controllers.forEach(controller => {
            console.log(`- ${controller.vendor}: ${controller.model}`);
        });
    });
    si.mem().then(data => {
        const totalMemory = (data.total / (1024 * 1024 * 1024)).toFixed(2);
        const usedMemory = ((data.total - data.available) / (1024 * 1024 * 1024)).toFixed(2);
        const freeMemory = (data.available / (1024 * 1024 * 1024)).toFixed(2);
        console.log(`Total memory: ${totalMemory} GB`);
        console.log(`Used memory: ${usedMemory} GB`);
        console.log(`Free memory: ${freeMemory} GB`);
    });
    si.battery().then(data => {
        console.log(`Battery charging: ${data.isCharging ? 'yes' : 'no'}`);
        console.log(`Battery percent: ${data.percent}%`);
        console.log(`Battery remaining time: ${data.timeRemaining}`);
    });
}

const frequency = parseInt(process.argv[2], 10);

if (isNaN(frequency)) {
    console.error('Invalid frequency parameter.');
    process.exit(1);
}

console.log(`System information will be printed every ${frequency} seconds:`);

setInterval(printSystemInfo, frequency * 1000);


// 5. Напишіть власну реалізацію класу EventEmitter (Publisher/Subscriber), який поводитиметься так:

// const emitter = new MyEventEmitter();
// emitter.registerHandler('userUpdated', () => console.log('Обліковий запис користувача оновлено'));
// emitter.emitEvent('userUpdated'); // Обліковий запис користувача оновлено

class MyEventEmitter {
  private events: {[name: string]:Function[]} = {};

  public registerHandler(name: string, callback: Function): void {
      this.events[name] = this.events[name] || [];
      this.events[name].push(callback);
  }
  public emitEvent(name: string) {
      this.events[name].forEach(func => func());
  }   
}

const emitter = new MyEventEmitter();

emitter.registerHandler('userUpdated', () => console.log('Обліковий запис користувача оновлено'));
emitter.emitEvent('userUpdated'); // Обліковий запис користувача оновлено