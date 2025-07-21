This is a starter tamplate the stack we use is:

- Nextjs (Server-Side Actions)
- Prisma,
- Cockroachdb,
- Authjs (Auth provider && Credentials),
- Tailwind,
- Shadcn,
- react-icons and Lucide-react,
- Stripe,
- CDN AWS S3 Bucket,

How to use:

- Just git clone and run:
  npm install or yarn install

- Then go to .env and just add the database and run the following command:
  npx prisma migrate dev --name init.

- And add other requierd informations and that's all you are ready to test:

- yarn next dev
- npm next dev
- bun next dev

-- Features --

- Tiptap Editor
- Datatable
- Confirm Dialog (Alert Dialog)
- Image Uploader (Using AWS S3)
- File Uploader (Using AWS S3)
- Autocomplete
- Multi select (costumized)
- Color Picker

- For documentation check the /pages/docs/page.tsx
