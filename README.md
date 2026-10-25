# Portfolio

A personal portfolio built with Express and EJS. It includes a project showcase and an admin area for adding projects, with MongoDB for storage and Cloudinary for project images.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root with:
   ```env
   ATLASDB_URL=your_mongodb_connection_string
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   username=your_admin_username
   password=your_admin_password
   ```
3. Start the app:
   ```bash
   npm start
   ```

The app runs on `http://localhost:3000` by default.

## Deploy on Render

Create a Render Web Service connected to this repository. Use `npm install` as the build command and `npm start` as the start command. Add the environment variables listed above in the Render dashboard; Render provides the `PORT` variable automatically.
