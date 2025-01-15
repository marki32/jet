# YouTube Video Downloader App Workflow

## Overview
This app allows users to download YouTube videos directly from their browser using yt-dlp. The app streams videos directly to users without storing them on the server, making it efficient and scalable.

## Technical Stack
- Next.js (Frontend & Backend)
- TypeScript
- yt-dlp (Video downloading)
- Tailwind CSS (Styling)

## Components Structure

### 1. Frontend (`app/page.tsx`)
- Main page layout
- Contains the search form component
- Displays title and description

### 2. Search Form Component (`app/components/SearchForm.tsx`)
- Handles user input for YouTube URL
- Manages loading and error states
- Triggers download process
- Features:
  - URL validation
  - Loading state indication
  - Error handling and display
  - Download progress feedback

### 3. API Route (`app/api/download/route.ts`)
- Handles video download requests
- Streams video data directly to users
- Features:
  - URL validation
  - Video info extraction
  - Direct streaming
  - Error handling

## Workflow Process

1. **User Input**
   - User pastes YouTube URL into input field
   - Frontend validates URL format
   - Submit button triggers download process

2. **API Request**
   - Frontend sends POST request to `/api/download`
   - Includes YouTube URL in request body
   - Waits for server response

3. **Server Processing**
   ```mermaid
   graph TD
     A[Receive URL] --> B[Validate URL]
     B --> C[Get Video Title]
     C --> D[Create Stream]
     D --> E[Download Video]
     E --> F[Stream to User]
   ```

4. **Video Download Process**
   - Server uses yt-dlp to:
     1. Get video title for filename
     2. Stream video content
     3. Send data directly to user
   - No temporary storage on server
   - Efficient memory usage

5. **File Delivery**
   - Video streams directly to user's browser
   - Filename based on video title (sanitized)
   - Browser triggers download automatically
   - Progress shown to user

## Error Handling
- Invalid URLs
- Download failures
- Network issues
- Server errors

## Security Features
- URL validation
- Filename sanitization
- No server-side storage
- Proper error messages

## Performance Considerations
- Direct streaming (no storage)
- Efficient memory usage
- Clean filename generation
- Proper header handling

## Usage Example
```javascript
// Example URL format
https://www.youtube.com/watch?v=VIDEO_ID
// or
https://youtu.be/VIDEO_ID
```

## Dependencies Required
- yt-dlp (must be installed on server)
- Node.js environment
- Next.js framework
