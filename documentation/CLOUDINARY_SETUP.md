# Cloudinary Image Upload Setup Guide

## ✅ What's Been Implemented

### 1. **Upload API Route** (`/app/api/upload/route.ts`)

- POST: Uploads images to Cloudinary with automatic optimization
- DELETE: Removes images from Cloudinary by public ID
- Requires Clerk authentication
- Organized uploads in `apigs-projects` folder
- Auto-optimizations:
  - Max dimensions: 1200x675px
  - Quality: auto:good
  - Format: auto (WebP for supported browsers)

### 2. **ImageUploader Component Updated**

- Now uploads files to Cloudinary via `/api/upload`
- Returns real Cloudinary URLs instead of mock URLs
- Shows error alerts if upload fails
- Maintains all existing features (drag & drop, URL input, multiple files)

## 🔧 Setup Instructions

### Step 1: Get Cloudinary Credentials

1. Go to https://cloudinary.com and create a free account
2. Go to Dashboard
3. Copy these values:
   - Cloud Name
   - API Key
   - API Secret

### Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Step 3: Restart Development Server

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
pnpm dev
```

## 🎨 Features

### Upload Features:

- ✅ Drag and drop upload
- ✅ Click to browse files
- ✅ Paste image URLs
- ✅ Multiple file support
- ✅ Image preview
- ✅ Remove uploaded images
- ✅ Authentication required
- ✅ Automatic optimization

### Cloudinary Optimizations:

- ✅ Resized to max 1200x675 (maintains aspect ratio)
- ✅ Auto quality optimization
- ✅ Auto format (WebP when possible)
- ✅ Organized in `apigs-projects` folder

## 📁 Folder Structure

All project images will be stored in Cloudinary under:

```
apigs-projects/
  ├── image1.jpg
  ├── image2.png
  └── ...
```

## 🔒 Security

- Only authenticated users (via Clerk) can upload
- Files are validated on the server
- Cloudinary credentials are stored securely in environment variables
- Never exposed to the client

## 💡 Usage in Admin Panel

1. Go to Admin > Portfolio Management
2. Click "New Project" or edit existing project
3. Use the Image Uploader:
   - Drag & drop an image file, OR
   - Click to browse and select, OR
   - Paste a direct image URL
4. Image uploads to Cloudinary automatically
5. Cloudinary URL is saved to database

## 🎉 Benefits

- ✅ Fast CDN delivery worldwide
- ✅ Automatic image optimization
- ✅ WebP format for modern browsers
- ✅ Responsive images
- ✅ Free tier: 25 GB storage, 25 GB bandwidth/month
- ✅ No file size limits (reasonable uploads)

## 🐛 Troubleshooting

**Upload fails?**

- Check that Cloudinary credentials are correct in `.env.local`
- Make sure you restarted the dev server after adding env vars
- Check browser console for error messages

**Images not showing?**

- Verify the Cloudinary URL is valid
- Check network tab to see if images are loading
- Ensure CORS is not blocking (Cloudinary should allow by default)

## 📝 Next Steps (Optional Enhancements)

- [ ] Add image upload progress bar
- [ ] Support video uploads
- [ ] Add image cropping before upload
- [ ] Generate multiple sizes/thumbnails
- [ ] Add watermarks
- [ ] Organize by categories in Cloudinary folders
