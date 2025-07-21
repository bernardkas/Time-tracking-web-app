const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function uploadBase64ToS3(req, res) {
  try {
    const { image } = req.body; // Expecting base64 string in the request body

    if (!image) {
      return res.status(400).json({ error: 'Invalid image data' });
    }

    // Extract image type (e.g., png, jpg)
    const imageType = image.split(';')[0].split('/')[1];

    // Remove base64 prefix
    const base64Data = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    // Generate a unique filename
    const fileName = `uploads/${Date.now()}.${imageType}`;

    // Upload to S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${imageType}`,
    };

    const { Location } = await s3.upload(params).promise();

    return res.status(200).json({ url: Location });
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}

module.exports = {
  uploadBase64ToS3,
};
