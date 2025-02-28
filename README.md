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

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Set up environment variables:

```bash
cp .env.example .env
```

5. Start the backend server:

```bash
npm run dev
```

6. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

7. Start the frontend application:

```bash
ng serve
```

The application will be available at:

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

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
