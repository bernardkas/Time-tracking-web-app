import React, { useEffect, useState } from 'react';
import { PlusCircleIcon, UploadIcon, XCircleIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

interface ImageUploaderProps {
  images: File[];
  handleImageUpload: (image: File | File[]) => void;
  handleRemoveImage: (index: number) => void;
  multi?: boolean;
}

const ImageUploader = ({
  images,
  handleImageUpload,
  handleRemoveImage,
  multi = false,
}: ImageUploaderProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>(images);

  useEffect(() => {
    if (images) {
      const imageUrls = images.map(image =>
        typeof image === 'string' ? image : URL.createObjectURL(image)
      ) as any;
      setSelectedImages(imageUrls);

      // Cleanup blob URLs to prevent memory leaks
      return () => {
        images.forEach(image => {
          if (typeof image !== 'string') {
            URL.revokeObjectURL(URL.createObjectURL(image));
          }
        });
      };
    }
  }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (multi) {
      const newImages = files.map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newImages] as any);
      handleImageUpload(files);
    } else {
      const newImage = URL.createObjectURL(files[0]);
      setSelectedImages([newImage] as any);
      handleImageUpload(files[0]);
    }
  };

  return (
    <div className='flex flex-wrap gap-4 w-full'>
      {/* Render Uploaded Images */}
      {selectedImages?.length > 0 &&
        selectedImages.map((image, index) => (
          <div
            key={index}
            className='relative flex-shrink-0 flex-grow-0 basis-[250px]'>
            <Image
              src={image as any}
              width={250}
              height={250}
              alt={`uploaded-${index}`}
              className='object-cover w-[250px] h-[250px] rounded-md'
            />
            <Button
              type='button'
              onClick={() => handleRemoveImage(index)}
              className='absolute top-2 right-2 bg-white rounded-full p-1'>
              <XCircleIcon className='w-5 h-5 text-red-500' />
            </Button>
          </div>
        ))}

      {/* Add Image Button */}
      {multi && (
        <div className='flex-shrink-0 flex-grow-0 basis-[250px]'>
          <label className='cursor-pointer'>
            <input
              type='file'
              onChange={handleFileChange}
              className='hidden'
              accept='image/*'
              multiple={multi}
            />
            <div className='flex flex-col items-center justify-center w-[250px] h-[250px] border-2 border-dashed border-gray-300 rounded-md'>
              <PlusCircleIcon className='w-10 h-10 text-gray-500' />
              <span className='text-sm text-gray-500'>Add Image</span>
            </div>
          </label>
        </div>
      )}

      {/* Upload Box for Single Mode */}
      {!multi && selectedImages?.length === 0 && (
        <label className='w-full h-[200px] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer rounded-md'>
          <input
            type='file'
            onChange={handleFileChange}
            className='hidden'
            accept='image/*'
          />
          <div className='flex flex-col items-center text-gray-500'>
            <UploadIcon className='w-10 h-10 mb-2' />
            <span className='text-sm'>Upload Image</span>
          </div>
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
