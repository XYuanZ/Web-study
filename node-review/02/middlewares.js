const add = (x, y) => x + y
const square = z => z * z

// 方法一 简单实现
//  const fn = (x, y) => square(add(x, y))

// 方法二 简单组合封装
// const compose = (fn1, fn2) => (...args) => fn2(fn1(...args))
// const fn = compose(add, square)

// 方法三 实现多个方法组合
// const compose = (...[first,...other]) => (...args) => {
//     let ret = first(...args)
//     other.forEach(fn => {
//         ret = fn(ret)
//     })
//     return ret
// }
// const fn = compose(add, square)

// 方法四 考虑中间件执行顺序，实现多个方法组合，同时考虑异步
function compose(middlewares) {
    return function () {
        return dispatch(0)
        function dispatch(i) {
            const fn = middlewares[i]
            if (!fn) return Promise.resolve()
            return Promise.resolve(fn(function next() {
                return dispatch(i + 1)
            }))
        }
    }
}
// 方法四实现例子
async function fn1(next) {
    console.log('fn1')
    await next()
    console.log('end fn1')
}

async function fn2(next) {
    console.log('fn2')
    await delay()
    await next()
    console.log('end fn2')
}

function fn3(next) {
    console.log('fn3')
}

function delay() {
    return Promise.resolve(res => {
        setTimeout(() => reslove(), 2000)
    })
}
const middlewares = [fn1, fn2, fn3]
const finalFn = compose(middlewares)
finalFn()