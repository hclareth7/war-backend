import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


// Configure AWS S3 compatibility
const s3 = new S3Client({
  region: process.env.S3_COUD_REGION,
  endpoint: process.env.S3_CLOUD_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Required for S3-compatible services
});

export const uploadS3 = async (file: Express.Multer.File) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log('File uploaded successfully:', data);

  } catch (err) {
    console.error('Error uploading file:', err);
    //return res.status(500).send('Error uploading file.');
  }
}


