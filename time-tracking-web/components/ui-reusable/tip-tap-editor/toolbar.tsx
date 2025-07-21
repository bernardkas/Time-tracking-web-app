'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
  Heading,
  Image,
  ImageIcon,
  Heading1,
  Heading3,
} from 'lucide-react';

type Props = {
  editor: Editor | null;
  content: string;
  handleImageUpload: (file: File) => void;
};

const Toolbar = ({ editor, content, handleImageUpload }: Props) => {
  if (!editor) {
    return null;
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div
      className='px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-start
    gap-5 w-full flex-wrap border border-gray-700'>
      <div className='flex justify-start items-center gap-5 w-full lg:w-10/12 flex-wrap '>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={
            editor.isActive('bold')
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black'
          }>
          <Bold className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={
            editor.isActive('italic')
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <Italic className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={
            editor.isActive('underline')
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <Underline className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={
            editor.isActive('strike')
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <Strikethrough className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={
            editor.isActive('heading', { level: 1 })
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <Heading1 className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive('heading', { level: 2 })
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <Heading2 className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={
            editor.isActive('heading', { level: 3 })
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <Heading3 className='w-5 h-5' />
        </button>

        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={
            editor.isActive('bulletList')
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <List className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={
            editor.isActive('orderedList')
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <ListOrdered className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={
            editor.isActive('blockquote')
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <Quote className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().setCode().run();
          }}
          className={
            editor.isActive('code')
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <Code className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          className={
            editor.isActive('undo')
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black    hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <Undo className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          className={
            editor.isActive('redo')
              ? 'bg-sky-700 text-white p-2 rounded-lg'
              : 'text-black   hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'
          }>
          <Redo className='w-5 h-5' />
        </button>
        <button
          onClick={e => {
            e.preventDefault();
            // Trigger file input click
            document.getElementById('image-upload-input')?.click();
          }}
          className='text-black hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg'>
          <ImageIcon className='w-5 h-5' />
        </button>

        <input
          type='file'
          id='image-upload-input'
          accept='image/*'
          onChange={handleFileInputChange}
          className='hidden'
        />
      </div>
    </div>
  );
};

export default Toolbar;
