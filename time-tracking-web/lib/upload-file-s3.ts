import crypto from 'crypto';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { auth } from '@/auth';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function uploadFileToS3(file: Buffer, fileType: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const generateFileName = (bytes = 20) =>
      crypto.randomBytes(bytes).toString('hex');

    const userFolder = crypto
      .createHash('md5')
      .update(String(userId))
      .digest('hex');

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: `${userFolder}/${generateFileName()}`,
      Body: file,
      ContentType: fileType || 'application/octet-stream',
      ContentDisposition: 'inline',
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    return url;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
}
