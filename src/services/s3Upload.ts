import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Configure AWS S3 compatibility
const awsConfig = {
  region: process.env.S3_COUD_REGION,
  endpoint: process.env.S3_CLOUD_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Required for S3-compatible services
};
const s3 = new S3Client(awsConfig);

export const uploadS3 = async (file, identifier) => {

  try {

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${identifier}`,
      Body: file.buffer,
    };
    const getParams = {

      Bucket: process.env.BUCKET_NAME,
      Key: `${identifier}`,
      Expires: 3600,

    }

    const command = new PutObjectCommand(params);

    await s3.send(command)

    const commandGet = new GetObjectCommand(getParams);
    //const response = await s3.send(commandGet);
    const url = await getSignedUrl(s3, commandGet);

    console.log('File uploaded successfully');
    return url;
  } catch (err) {
    console.error('Error uploading file:', err);
    //return res.status(500).send('Error uploading file.');
  }
}




