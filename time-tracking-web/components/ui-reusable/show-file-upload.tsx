import React from 'react';
import { Button } from '../ui/button';
interface PhotoUploadProps {
  selectPhoto: File[];
  setSelectPhoto: (val: File[]) => void;
}

const ShowFileUpload: React.FC<PhotoUploadProps> = ({
  selectPhoto,
  setSelectPhoto,
}) => {
  const handleRemovePhoto = (index: number) => {
    const updatedFiles = [...selectPhoto];
    updatedFiles.splice(index, 1);
    setSelectPhoto(updatedFiles);
  };

  return (
    <div>
      {selectPhoto?.length > 0 && (
        <div>
          <h4 className='text-slate-700 font-semibold mt-2'>Selected Files:</h4>
          <ul className='flex flex-row gap-5 flex-wrap'>
            {selectPhoto?.map((file, index) => (
              <li
                className='flex flex-col gap-2 border-[1px] w-[150px] my-3 p-1 rounded-sm'
                key={index}>
                {file.name}{' '}
                <Button
                  variant='destructive'
                  className=' text-white p-[2px] rounded-md'
                  onClick={() => handleRemovePhoto(index)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShowFileUpload;
