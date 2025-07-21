import { uploadFileToS3 } from '@/lib/upload-file-s3';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
      }

      const bufferPhoto = Buffer.from(await file.arrayBuffer());
      const contentType = file.type ?? '';

      // Upload the file to S3
      const uploadedFileName = await uploadFileToS3(bufferPhoto, contentType);
      uploadedFiles.push({ fileName: uploadedFileName });
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
