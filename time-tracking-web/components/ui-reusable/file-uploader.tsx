import React, { useState } from 'react';
import { UploadIcon, XCircleIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';

interface FileUploaderProps {
  acceptedFileTypes?: string[]; // Array of accepted file types (default: PDF and JPG)
  maxFileSize?: number; // Maximum file size in MB (default: 5MB)
  onFileUpload: (file: File | null) => void; // Callback when a file is uploaded
  onFileRemove?: () => void; // Optional callback when the file is removed
}

const FileUploader = ({
  acceptedFileTypes = ['application/pdf', 'image/jpg', 'image/jpeg'],
  maxFileSize = 5, // Default max size is 5MB
  onFileUpload,
  onFileRemove,
}: FileUploaderProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const fileType = file.type;
    const fileSizeMB = file.size / (1024 * 1024);

    // Validate file type
    if (!acceptedFileTypes.includes(fileType)) {
      toast(
        `Only the following file types are allowed: ${acceptedFileTypes.join(
          ', '
        )}`,
        { type: 'error' }
      );
      return;
    }

    // Validate file size
    if (fileSizeMB > maxFileSize) {
      toast(`File size exceeds the maximum limit of ${maxFileSize}MB.`, {
        type: 'error',
      });
      return;
    }

    // Set file and generate preview if it's an image
    setUploadedFile(file);
    onFileUpload(file); // Notify parent component with the file
    if (fileType.includes('image')) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null); // No preview for PDFs
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    onFileUpload(null); // Notify parent component that the file was removed
    if (onFileRemove) {
      onFileRemove();
    }
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      {/* Conditionally show the upload input if no file is uploaded */}
      {!uploadedFile ? (
        <label className='w-full h-[200px] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer rounded-md'>
          <input
            type='file'
            onChange={handleFileChange}
            accept={acceptedFileTypes
              .map(type => `.${type.split('/').pop()}`)
              .join(',')}
            className='hidden'
          />
          <div className='flex flex-col items-center text-gray-500'>
            <UploadIcon className='w-10 h-10 mb-2' />
            <span className='text-sm'>Upload File</span>
          </div>
        </label>
      ) : (
        <div className='flex flex-row items-center gap-2'>
          {filePreview ? (
            <img
              src={filePreview}
              alt='uploaded-file'
              className='object-cover w-[250px] h-[250px] rounded-md'
            />
          ) : (
            <span className='text-sm font-medium'>{uploadedFile.name}</span>
          )}

          <Button onClick={handleRemoveFile} variant='link' className=''>
            <XCircleIcon className='w-5 h-5 mr-1' />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
