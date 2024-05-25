const http = require("http");
const fs = require("fs");
const path = require('path');
  
const server = http.createServer((req, res) => {

    console.log("got into the server");
    console.log(path.join(__dirname, 'index.html'));
    // res.setHeader('Access-Control-Allow-Origin', '*'); 
    // res.setHeader('Access-Control-Allow-Methods', 'POST');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 

    // if (req.method === 'OPTIONS') {
    //     // Handle preflight request
    //     res.writeHead(200, {'Content-Type': 'application/json'});
    //     res.end();
    //     return;
    // }
    
    if (req.method === 'GET' && req.url === '/') {
    // Serve the HTML file
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });

        return;
    }
    // if (req.headers['content-type'] !== 'application/json') {
    //     res.writeHead(400, {'Content-Type': 'application/json'});
    //     res.end(JSON.stringify({
    //         message: "Bad Request"
    //     }));
    //     return;
    // }

    const method = req.method;
    const url = req.url;

    if (method === 'POST' && url === '/submit') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
        
            const formData = JSON.parse(body);
            const jsonFormData = JSON.stringify(formData) + ',\n';
    
            fs.appendFile('database.json', jsonFormData, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message:'Internal Server Error'}));
                } else {
                    console.log('Form data saved successfully.');
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ message: 'Form data saved successfully.' }));
                }
            });
        });
    }
    else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            message: "Not Found"
        }));
        return;
    }
});

server.listen(3000, "127.0.0.1", () => {
  console.log(`Server is running on http://localhost:3000`);
});