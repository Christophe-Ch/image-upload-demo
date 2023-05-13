const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');

const storage = new Storage();

functions.cloudEvent('transformPicture', async (cloudEvent) => {
    const file = cloudEvent.data;
    if (file.name.startsWith('thumb_')) {
        return;
    }

    const bucket = storage.bucket(file.bucket)

    const uploadStream = bucket
        .file(`thumb_${file.name}`)
        .createWriteStream();

    const transformPipeline = sharp()
        .resize(100, 100);

    transformPipeline.pipe(uploadStream);

    bucket
        .file(file.name)
        .createReadStream()
        .pipe(transformPipeline);

    return new Promise((res) => uploadStream.on('finish', res));
});