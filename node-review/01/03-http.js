const http = require('http')
const fs = require('fs')
const server = http.createServer((request, response) => {
    // response.end('hello ...')
    const { url, method, headers } = request
    if (url === '/' && method === 'GET') {
        // 静态页面服务
        fs.readFile('index.html', (err, data) => {
            if (err) {
                // 500
                response.writeHead(500)
                response.end('500 Page err')
                return
            }
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/html')
            response.end(data)
        })
    } else if (url === '/users' && method === 'GET') {
        // Ajax服务
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        response.end(JSON.stringify({
            name: 'laowang'
        }))
    } else if (method === 'GET' && headers.accept.indexOf('image/*') !== -1) {
        // 图片文件服务
        fs.createReadStream('./' + url).pipe(response)
    } else {
        // 404
        response.writeHead(404)
        response.end('404 Page Not Found')
    }
})
server.listen(3000)