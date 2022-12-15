import fs from "fs";
import AWS from "aws-sdk";
import formidable from "formidable"

const s3Client = new AWS.S3({
    // endpoint: process.env.DO_ENDPOINT,
    region: "us-west-1",
    credentials: {
        accessKeyId: process.env.DO_ACCESS_KEY_ID,
        secretAccessKey: process.env.DO_SECRET_ACCESS_KEY
    }
});

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(req, res) {
  const form = formidable();
  form.parse(req, async(err, fields, files) => {
    if (!files.demo) {
        res.status(400).send("No files Uploaded");
        return;
    }
    // console.log(files.demo.originalFilename);
    try {
       return s3Client.putObject({
        Bucket: process.env.DO_BUCKET,
        Key:  files.demo.originalFilename,
        Body: fs.createReadStream(files.demo.filepath),
        ACL: "public-read"
       }, async() => res.status(201).send("File Uploaded"));
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Error uploading file");
    }
  });
}
