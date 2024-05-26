const http = require("http");
const fs = require("fs");
const path = require('path');
  
const server = http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    });

    if (req.method === "OPTIONS") {
        res.end();
        return;
    }
   
    const method = req.method;
    const url = req.url;

    if (req.method === 'GET') {

        let filePath = path.join(
            __dirname,
            "public",
            req.url == "/" ? "index.html" : req.url
        );

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': getExtensionName(filePath) });
                res.end(data);
            }
        });

        return;
    }

    if (method === 'POST' && url === '/submit') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
        
            const formData = JSON.parse(body);
            let jsonData = [];

            let filePath = path.join(__dirname, 'database.json');

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message:'Internal Server Error'}));
                    return;
                }

                if (data.length > 0) {
                    jsonData = JSON.parse(data);
                }
                
                jsonData.push(formData);

                jsonData = JSON.stringify(jsonData, null, 2);
    
                fs.writeFile('database.json', jsonData, (err) => {
                    if (err) {
                        console.error('Error writing to file:', err);
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message:'Internal Server Error'}));
                        return;
                    } else {
                        console.log('Form data saved successfully.');
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({ message: 'Form data saved successfully.' }));
                    }
                });
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


const getExtensionName = (file_path) => {
    let extensionName = path.extname(file_path);

    if (extensionName === ".html") {
        return "text/html";
    } else if (extensionName === ".css") {
        return "text/css";
    } else {
        return "application/json";
    }
};

server.listen(3000, () => {
  console.log(`Server is running`);
});