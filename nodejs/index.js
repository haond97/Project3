var fs = require('fs');
var express = require('express');
var app = express();

app.get('/video', (req, res) => {
    var path = 'C:/Users/Administrator/Videos/video.mp4';
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(path, {
            start,
            end
        });
        var head = {
            'Content-Range': "bytes " + start + "-" + end + "/" + fileSize,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        var head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
});

app.get('/image', (req, res) => {
    var path = 'C:/Users/Administrator/Pictures/image.png';

    var img = fs.readFileSync(path);
    res.writeHead(200, {
        'Content-Type': 'image/jpeg'
    });
    res.end(img, 'binary');

});

app.listen(8080, () => {
    console.log("express start");
});