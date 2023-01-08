const http = require('http'),
  fs = require('fs'),
  url = require('url');

//server creation

http.createServer((request, response) => { //function within createServer function that has two arguments
    let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';

// File Sytem module - append File, adds information to log.txt

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });

    // if input 'request' includes documentation, user sent to documentation.html. otherwise redirected to homepage (index)
    if (q.pathname.includes('documentation')) { 
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
        
    });

}).listen(8080);
console.log('My first Node test server is running on Port 8080');