const http = require("http");
const fs = require("fs");
const path = require('path');

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    const method = req.method;
    const url = req.url;

    if (method === 'GET') {
        let filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(500);
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': getExtensionName(filePath) });
            res.end(data);
        });
    } else if (method === 'POST' && url === '/submit') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const formData = JSON.parse(body);
            let jsonData = [];

            let filePath = path.join(__dirname, "database.json");

            fs.readFile(filePath, "utf-8", (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    res.writeHead(500);
                    res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    return;
                }

                if (data.length > 0) {
                    jsonData = JSON.parse(data);
                }

                jsonData.push(formData);

                jsonData = JSON.stringify(jsonData, null, 2);

                fs.writeFile("./database.json", jsonData, (err) => {
                    if (err) {
                        console.error('Error writing to file:', err);
                        res.writeHead(500);
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                        return;
                    }

                });
            });

            console.log('Form data saved.');
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Form data saved successfully.' }));
        });

        return;
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Not Found" }));
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
