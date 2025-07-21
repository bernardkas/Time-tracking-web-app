'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFormattedDate } from '@/lib/use-formatted-date';
import { EmployeeWithDetails } from '@/types/EmployeeType';
import { ActivityLog } from '@prisma/client';
import Image from 'next/image';
import React, { useState } from 'react';

interface ModalDetailsProps {
  log: ActivityLog | null;
}

const ModalDetails = ({ log }: ModalDetailsProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  // Toggle full screen
  const handleFullScreen = (imageSrc: string) => {
    setFullScreenImage(imageSrc);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setFullScreenImage(null);
  };

  return (
    <div>
      {/* If in full screen mode, show the image in full screen */}
      {isFullScreen && fullScreenImage && (
        <div
          className='fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center'
          onClick={closeFullScreen}>
          <Image
            className='rounded-lg object-cover'
            quality={100}
            layout='intrinsic'
            width={800}
            height={800}
            alt='Full-Screen Photo'
            src={fullScreenImage}
          />
        </div>
      )}

      <div>
        <div className='flex flex-row justify-between'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Mouse Clicks</TableHead>
                <TableHead>Keyboard Clicks</TableHead>
                <TableHead>Screen Time</TableHead>
                <TableHead>Screenshot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {log && (
                <TableRow key={log.id} className=''>
                  <TableCell>{useFormattedDate(log.timestamp)}</TableCell>
                  <TableCell>{log.mouseClicks}</TableCell>
                  <TableCell>{log.keyboardClicks}</TableCell>
                  <TableCell>{log.screenTime} mins</TableCell>
                  <TableCell>
                    {log.screenshots ? (
                      <div>{log.screenshots.length}</div>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='mx-7'>
          <Carousel>
            <CarouselContent>
              {log?.screenshots.map(
                (item, index) =>
                  index % 3 === 0 && (
                    <CarouselItem
                      key={index}
                      className='flex justify-center items-center'>
                      <div className='grid grid-cols-3 gap-4'>
                        {log?.screenshots.slice(index, index + 3).map(photo => (
                          <div
                            key={photo}
                            className='flex h-[300px] justify-center items-center'>
                            <Image
                              className='rounded-lg object-cover cursor-pointer'
                              quality={100}
                              layout='intrinsic'
                              width={300}
                              height={300}
                              alt='Photo'
                              src={photo || ''}
                              onClick={() => handleFullScreen(photo)} // Open in full screen on click
                            />
                          </div>
                        ))}
                      </div>
                    </CarouselItem>
                  )
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ModalDetails;
