# Image Upload Application

A modern, full-stack web application for uploading and managing images using Node.js (Express), MongoDB, and Angular.

## Features

- Modern, responsive UI with Material Design
- Drag and drop image upload with progress indicator
- Image preview with lightbox modal
- Image gallery with hover actions
- Download images with original filenames
- Secure image deletion with confirmation
- File type validation (JPG, PNG, GIF)
- File size validation (max 5MB)
- Elegant empty state handling
- Responsive grid layout
- Toast notifications for user feedback

## Tech Stack

### Frontend

- Angular (Standalone Components)
- Angular Material UI components
- Modern CSS with CSS Variables
- Responsive design with CSS Grid
- TypeScript
- RxJS for reactive programming

### Backend

- Node.js with Express
- TypeScript
- MongoDB with GridFS
- Multer for file upload handling
- Winston for logging

## UI Components

- Custom image upload component with drag & drop
- Image preview modal with navigation
- Confirmation modal for deletions
- Material Design icons
- Toast notifications
- Responsive grid gallery
- Empty state illustrations

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker and Docker Compose
- Angular CLI

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd image-upload-project
```

2. Start MongoDB using Docker:

```bash
docker compose up -d mongodb
```

The MongoDB instance will be available at `mongodb://localhost:27017` with the following credentials:

- Username: admin
- Password: password

3. Install all dependencies (backend and frontend):

```bash
yarn install:all
```

4. Set up environment variables:

```bash
cd backend
cp .env.example .env
cd ..
```

5. Start both backend and frontend development servers:

```bash
yarn start
```

The application will be available at:

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

Note: If you prefer to run the servers separately, you can use:

```bash
yarn start:backend    # For backend only
yarn start:frontend   # For frontend only
```

## API Endpoints

### Images API

| Method | Endpoint           | Description          | Response               |
| ------ | ------------------ | -------------------- | ---------------------- |
| POST   | /api/images/upload | Upload a new image   | Image object           |
| GET    | /api/images        | Get all images       | Array of image objects |
| GET    | /api/images/:id    | Get a specific image | Image file             |
| DELETE | /api/images/:id    | Delete an image      | Success message        |

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── index.ts       # App entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Standalone components
│   │   │   │   ├── image-list/
│   │   │   │   ├── image-upload/
│   │   │   │   ├── image-preview-modal/
│   │   │   │   └── confirmation-modal/
│   │   │   └── services/     # API services
│   │   ├── assets/
│   │   └── environments/
│   ├── package.json
│   └── angular.json
├── docker-compose.yml
└── README.md
```

## Development

### Backend Development

```bash
cd backend
npm run dev
```

### Frontend Development

```bash
cd frontend
ng serve
```

## Building for Production

### Backend

```bash
cd backend
npm run build
```

### Frontend

```bash
cd frontend
ng build --configuration production
```

## Error Handling

The application includes comprehensive error handling:

- File type validation
- File size limits
- Network error handling
- User-friendly error messages
- Loading states
- Empty states

## UI/UX Features

- Smooth animations and transitions
- Hover effects for interactive elements
- Responsive design for all screen sizes
- Clear feedback for user actions
- Intuitive drag and drop interface
- Modern empty state design
- Consistent design language

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

## Deployment

This application can be deployed to Render.com using the following steps:

### 1. Database Setup

1. Create a MongoDB instance:
   - Sign up for a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster (free tier is sufficient)
   - Configure network access to allow connections from anywhere
   - Create a database user
   - Get your MongoDB connection string

### 2. Backend Deployment

1. Create a new Web Service on Render:
   - Connect your GitHub repository
   - Select the `backend` directory as the root directory
   - Choose "Node" as the runtime
   - Set the build command: `npm install && npm run build`
   - Set the start command: `npm start`
   - Add environment variables:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_connection_string
     PORT=3000
     ```

### 3. Frontend Deployment

1. Create a new Static Site on Render:
   - Connect your GitHub repository
   - Select the `frontend` directory as the root directory
   - Set the build command: `npm install && npm run build`
   - Set the publish directory: `dist/frontend/browser`
   - Add environment variable:
     ```
     API_URL=your_backend_service_url
     ```

### 4. Final Configuration

1. Update CORS settings in backend:
   - Add your frontend URL to allowed origins
2. Update frontend environment:
   - Ensure `environment.prod.ts` points to your backend URL
3. Test the deployment:
   - Verify file uploads work
   - Check image loading and deletion
   - Confirm all API endpoints are accessible

### Production Build

To build both applications for production:

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

The backend build will be in `backend/dist` and the frontend build will be in `frontend/dist/frontend/browser`.

## Environment Variables

### Backend Variables

- `NODE_ENV`: Set to 'production' in production
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 3000)

### Frontend Variables

- `API_URL`: Backend API URL
