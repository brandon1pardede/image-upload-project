# Image Upload Application

A full-stack web application for uploading and managing images using Node.js (Express), MongoDB, and Angular.

## Features

- Upload images with size validation
- View uploaded images
- Download images
- Delete images
- Modern and responsive UI
- GridFS for efficient image storage

## Tech Stack

### Backend

- Node.js with Express
- TypeScript
- MongoDB with GridFS
- Multer for file upload handling
- Winston for logging

### Frontend

- Angular
- SCSS for styling
- Angular Material UI components
- RxJS for reactive programming

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker and Docker Compose
- Yarn package manager

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd image-upload-project
```

2. Start MongoDB using Docker:

```bash
docker-compose up -d
```

3. Install backend dependencies:

```bash
cd backend
yarn install
```

4. Set up environment variables:

```bash
cp .env.example .env
```

5. Start the backend server:

```bash
yarn dev
```

6. Install frontend dependencies:

```bash
cd ../frontend
yarn install
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

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | /api/images/upload | Upload a new image   |
| GET    | /api/images        | Get all images       |
| GET    | /api/images/:id    | Get a specific image |
| DELETE | /api/images/:id    | Delete an image      |

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
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
yarn dev
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
yarn build
```

### Frontend

```bash
cd frontend
ng build --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
