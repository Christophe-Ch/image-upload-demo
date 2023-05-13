const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const Busboy = require('busboy');

const storage = new Storage();

functions.http('uploadPicture', async (req, res) => {
    const busboy = new Busboy({ headers: req.headers});

    busboy.on('file', (_, uploadedFile, fileInfo) => {
        const file = storage.bucket('cf-demo-storage').file(fileInfo.filename);
        uploadedFile.pipe(file.createWriteStream());
    });

    busboy.on('finish', () => res.send({ success: true }));

    busboy.end(req.rawBody);
});