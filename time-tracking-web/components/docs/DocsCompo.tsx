'use client';

import React, { useState } from 'react';
import ImageUploader from '../ui-reusable/image-uploader';
import Title from '../ui-reusable/title';
import TiptapEditor from '../ui-reusable/tip-tap-editor/tip-tap-editor';
import ConfirmDialog from '../ui-reusable/confirm-dialog';
import ColorInput from '../ui-reusable/color-input';

const DocsLeftside = () => {
  // Example state and handlers for the ImageUploader
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePhoto = (photo: File | File[]) => {
    if (Array.isArray(photo)) {
      setPhotos(prev => [...prev, ...photo]);
    } else {
      setPhotos(prev => [...prev, photo]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedImages = photos.filter((_, i) => i !== index);
    setPhotos([...updatedImages]);
  };

  const [content, setContent] = useState('Start writing...');

  const handleContentChange = (reason: any) => {
    setContent(reason);
  };

  const [color, setColor] = useState('');

  const handleColorChange = (color: string) => {
    setColor(color);
  };

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-5'>
      {/* Title */}
      <Title>Documentation</Title>
      <p className='text-zinc-500'>
        In this Documentation you can see the components that we use in the
        project and real example.
      </p>

      <p className='text-gray-500'>
        <span className='text-red-600'>Note:</span> Delete this after you finish
        the project{' '}
      </p>

      {/* Image */}
      <div>
        <h1 className='text-lg font-bold mb-4'>Image Uploader</h1>

        {/* Description */}
        <p className='mb-6 text-gray-600'>
          The <code>ImageUploader</code> component is a reusable component for
          managing image uploads. It supports multiple images, removal, and
          upload handlers. Here's how you can use it in your project:
        </p>
        <p className='mb-6 text-gray-600'>
          For the single image just make the multi="false" and useState File
          only
        </p>

        {/* Code Example */}
        <div className='bg-gray-100 rounded-md p-4 mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Code example:</h2>
          <pre className='bg-gray-800 text-white p-4 rounded-md text-sm overflow-auto'>
            {`
  // Multiple images

  const [photos, setPhotos] = React.useState<File[]>([]);

  // Uplaod to S3
  let uploadedFiles: string[] = [];
    if (photos && (Array.isArray(photos) ? photos.length > 0 : photos)) {
      const formData = new FormData();

      if (Array.isArray(photos)) {
        photos.forEach(file => formData.append('file', file));
      } else {
        formData.append('file', photos as File);
      }

      const upload = await axios.post('/api/s3-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Disposition': 'inline',
        },
      });

      uploadedFiles = upload.data.files.map(
        (file: { fileName: string }) => file.fileName
      );
    }
    

  const handlePhoto = (photo: File | File[]) => {
    if (Array.isArray(photo)) {
      setPhotos(prev => [...prev, ...photo]);
      } else {
        setPhotos(prev => [...prev, photo]);
    }
    };
    
    const handleRemovePhoto = (index: number) => {
      const updatedImages = photos.filter((_, i) => i !== index);
      setPhotos([...updatedImages]);
      };
      
      <ImageUploader
      images={photos}
      handleRemoveImage={handleRemovePhoto}
      handleImageUpload={handlePhoto}
      multi={true}
      />`}
          </pre>
        </div>

        {/* Real Example */}
        <div className='bg-gray-100 rounded-md p-4'>
          <h2 className='text-xl font-semibold mb-4'>Live Example:</h2>
          <ImageUploader
            images={photos}
            handleRemoveImage={handleRemovePhoto}
            handleImageUpload={handlePhoto}
            multi={true}
          />
        </div>
      </div>

      {/* Tip Tap Editor */}
      <div>
        <h1 className='text-lg font-bold mb-4'>Tip Tap editor</h1>

        {/* Description */}
        <p className='mb-6 text-gray-600'>
          The <code>Tip tap editor</code> component is a reusable component for
          managing content, and different formats.
        </p>

        {/* Code Example */}
        <div className='bg-gray-100 rounded-md p-4 mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Code example:</h2>
          <pre className='bg-gray-800 text-white p-4 rounded-md text-sm overflow-auto'>
            {`
            const [content, setContent] = useState('Start writing...');

            const handleContentChange = (reason: any) => {
              setContent(reason);
            };

             <TiptapEditor
                    placeholder='Write here...'
                    isToolbar={true}
                    content={content}
                    onChange={(newContent: string) =>
                      handleContentChange(newContent)
                    }
                  />


                  // This is how you call
                    <div dangerouslySetInnerHTML={{ __html: content }} />
  
  `}
          </pre>
        </div>

        {/* Real Example */}
        <div className='bg-gray-100 rounded-md p-4'>
          <h2 className='text-xl font-semibold mb-4'>Live Example:</h2>
          <TiptapEditor
            placeholder='Write here...'
            isToolbar={true}
            content={content}
            onChange={(newContent: string) => handleContentChange(newContent)}
          />
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>

      <div>
        <h1 className='text-lg font-bold mb-4'>Confirm Alert</h1>

        {/* Description */}
        <p className='mb-6 text-gray-600'>
          The <code>Confirm Alert</code> component is a reusable component for
          managing alert, and different formats.
        </p>

        {/* Code Example */}
        <div className='bg-gray-100 rounded-md p-4 mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Code example:</h2>
          <pre className='bg-gray-800 text-white p-4 rounded-md text-sm overflow-auto'>
            {`

            const handleDelete = () => {
              // Delete function
            };


             <ConfirmDialog
              buttonText='Delete'
              dialogTitle='Are you absolutely sure?'
              dialogDescription='This action cannot be undone. This will permanently delete
                      your post and remove your data from our servers.'
              onConfirm={handleDelete}
               buttonClassName?: ""; // Optional className for the trigger button
               actionClassName?: ""; // Optional className for the action button
            />
  
  `}
          </pre>
        </div>

        {/* Real Example */}
        <div className='bg-gray-100 rounded-md p-4'>
          <h2 className='text-xl font-semibold mb-4'>Live Example:</h2>
          <ConfirmDialog
            buttonText='Delete'
            dialogTitle='Are you absolutely sure?'
            dialogDescription='This action cannot be undone. This will permanently delete
                      your post and remove your data from our servers.'
          />
        </div>
      </div>

      <div>
        <h1 className='text-lg font-bold mb-4'>Color Picker</h1>

        {/* Description */}
        <p className='mb-6 text-gray-600'>
          The <code>Color Picker</code> component is a reusable component for
          managing color.
        </p>

        {/* Code Example */}
        <div className='bg-gray-100 rounded-md p-4 mb-6'>
          <h2 className='text-xl font-semibold mb-2'>Code example:</h2>
          <pre className='bg-gray-800 text-white p-4 rounded-md text-sm overflow-auto'>
            {`

            const [color, setColor] = useState('');

            const handleColorChange = (color: string) => {
              setColor(color);
            };
                      <ColorInput
                        modelValue={color}
                        defaultColor='#000000'
                        onChange={handleColorChange}
                      />
  
  `}
          </pre>
        </div>

        {/* Real Example */}
        <div className='bg-gray-100 rounded-md p-4 w-[300px]'>
          <h2 className='text-xl font-semibold mb-4'>Live Example:</h2>
          <ColorInput
            modelValue={color}
            defaultColor='#000000'
            onChange={handleColorChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DocsLeftside;
