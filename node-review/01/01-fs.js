/**
 * fs模块
 */
const fs = require('fs');

// fs的同步
const data = fs.readFileSync('./file.txt', 'utf-8')
console.log(data, '同步')

// fs的异步方式
fs.readFile('./file.txt', 'utf-8', (err, data) => {
    if (err) throw err
    console.log(data, '异步')
})

// fs的Promise的链式调用
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
readFile('./file.txt', 'utf-8').then(function (data) {
    console.log(data, 'Promise');
}).catch(function (err) {
    console.error('读取文件失败');
});

// fs的Promise的链式调用
const fsp = fs.promises;
fsp.readFile('./file.txt', 'utf-8').then(data => {
    console.log(data, 'fs.promises异步')
});