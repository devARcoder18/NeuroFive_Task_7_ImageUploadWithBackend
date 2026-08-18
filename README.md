# File / Image Upload Feature

A real, backend-connected file upload system: drag-and-drop → validate → preview → upload with live progress → Multer → Cloudinary → real URL → display.

## Architecture

```
Frontend (Next.js)
   ↓
Upload Component (drag/drop + picker)
   ↓
Client-side validation (type + size)
   ↓
FormData → axios (onUploadProgress)
   ↓
Express API  POST /api/upload
   ↓
Multer (memory storage, server-side validation)
   ↓
Cloudinary (streamed upload)
   ↓
Cloudinary secure URL + public ID
   ↓
JSON response → Frontend renders the uploaded image
```

## Supported files

- JPG / JPEG / PNG / WEBP
- Max size: 5 MB
- Validated on both the client (immediate feedback) and the server (never trusted from the client alone)

## Environment variables

**backend/.env**
```
PORT=5000
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

`CLOUDINARY_API_SECRET` is only ever read on the backend — never expose it in a `NEXT_PUBLIC_*` variable.

## API

`POST /api/upload` — `multipart/form-data`, field name `file`.

Success:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "url": "https://res.cloudinary.com/.../fullstack-app/uploads/xyz.png",
    "publicId": "fullstack-app/uploads/xyz",
    "name": "profile.png",
    "type": "image/png",
    "size": 1800000
  }
}
```

Failure:
```json
{ "success": false, "message": "Invalid file type" }
```

## How to run

**Backend**
```bash
cd backend
npm install express cors mongoose multer dotenv cloudinary streamifier
node server.js
```

**Frontend**
```bash
cd frontend
npm install axios zustand
npm run dev
```

Then visit `/upload`.

## Project structure

```
fullstack-app/
├── frontend/
│   ├── app/upload/page.tsx
│   ├── components/upload/
│   │   ├── FileUpload.tsx
│   │   ├── UploadPreview.tsx
│   │   ├── UploadProgress.tsx
│   │   └── UploadedFile.tsx
│   ├── stores/uploadStore.ts
│   └── services/uploadApi.ts
├── backend/
│   ├── config/cloudinary.js
│   ├── controllers/uploadController.js
│   ├── middleware/uploadMiddleware.js
│   ├── routes/uploadRoutes.js
│   ├── models/Upload.js
│   └── server.js
└── README.md
```

## Integrating into an existing project (e.g. TaskFlow)

- Merge `uploadRoutes` into your existing `server.js` instead of using the standalone one here.
- Swap the local toast in `app/upload/page.tsx` for your existing toast component.
- Uncomment the `requireAuth` line in `uploadRoutes.js` if uploads should be restricted to logged-in users, and make sure your auth middleware attaches `req.user`.
- The Tailwind classes (`indigo-600`, `slate-*`, `rounded-xl/2xl`, `shadow-sm`) match the existing indigo design system — no new colors were introduced.

## Notes on the "no fake upload" requirement

- Progress comes from axios's real `onUploadProgress` event, not a timer.
- The temporary preview uses `URL.createObjectURL`; after a successful upload the UI switches to the actual Cloudinary `secure_url` returned by the backend.
- Files are streamed straight to Cloudinary from memory (`multer.memoryStorage()`) — nothing is written to disk or committed to the repo.
