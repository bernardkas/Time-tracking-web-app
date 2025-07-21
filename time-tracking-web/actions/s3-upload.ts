'use server';

import { uploadFileToS3 } from '@/lib/upload-file-s3';

export const uploadFiles = async (formData: FormData) => {
  const files = formData.getAll('file[]');

  const fileNames = await Promise.all(
    files.map(async file => {
      // @ts-ignore
      const bufferPhoto = Buffer.from(await file.arrayBuffer());
      // @ts-ignore
      return uploadFileToS3(bufferPhoto, file.name);
    })
  );

  return fileNames;
};
