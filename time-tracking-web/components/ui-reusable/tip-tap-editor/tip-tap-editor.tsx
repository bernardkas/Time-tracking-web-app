'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './toolbar';
import Underline from '@tiptap/extension-underline';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { cn } from '@/lib/utils';
import axios from 'axios';

const TiptapEditor = ({
  onChange,
  content = '',
  isToolbar = true,
  className,
  placeholder = 'Start typing...',
}: any) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Replace with your actual S3 API endpoint
      const response = await axios.post('/api/s3-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response?.data?.files;

      if (imageUrl) {
        if (Array.isArray(imageUrl)) {
          imageUrl.forEach((url: any) => {
            editor?.chain().focus().setImage({ src: url?.fileName }).run();
          });
        } else {
          editor?.chain().focus().setImage({ src: imageUrl }).run();
        }
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const editor = useEditor({
    extensions: [
      Paragraph,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Bold,
      Italic,
      Strike,
      Link,
      Underline,
      BulletList,
      OrderedList,
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
      }),
      Image.configure({
        inline: false,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          `flex min-h-[200px] max-h-auto overflow-auto  flex-col h-auto w-auto  justify-start border-b border-r border-t border-l border-gray-700 text-black items-start gap-3 font-medium text-[16px]  p-2 rounded-bl-md rounded-br-md outline-none`,
          className
        ),
      },
      handleDrop: (view, event) => {
        const { files } = event.dataTransfer || {};

        if (files && files[0]) {
          const file = files[0];
          handleImageUpload(file);
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  return (
    <div className='w-full tiptap-editor-container'>
      {isToolbar && (
        <Toolbar
          editor={editor}
          content={content}
          handleImageUpload={handleImageUpload}
        />
      )}
      <EditorContent style={{ whiteSpace: 'pre-line' }} editor={editor} />
    </div>
  );
};

export default TiptapEditor;
