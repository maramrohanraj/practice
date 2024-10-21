const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'files')); 
    },
    filename: function (req, file, cb) {
        let filename = req.body.name + path.extname(file.originalname); 
        let filePath = path.join(__dirname, 'public', 'files', filename);
        fs.readdir(path.join(__dirname, 'public', 'files'), (err, files) => {
            if (err) {
                return cb(err); 
            }


            if (files.includes(filename)) {
                cb(new Error("File already exists"),false); 
            } else {
                cb(null, filename); 
            }
        });
    }
});


let upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.post('/profile', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.send('File already exists or not uploaded.');
    } else {
        res.send('File uploaded successfully.');
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});





