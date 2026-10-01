# E-Commerce Backend API

REST API built with **Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt, Joi, Multer, Cloudinary and Nodemailer**.

Request flow: `Request → Route → JWT Middleware → (Multer) → Joi → Controller → Service → Database`

## Run locally

1. Install dependencies
   ```bash
   npm install
   ```
2. Create your `.env` from the template and fill in the values (**never commit `.env`**)
   ```bash
   cp .env.example .env
   ```
3. Start the server
   ```bash
   npm run dev     # with nodemon
   npm start       # plain node
   ```
   Server runs on `http://localhost:5000`.

### Getting the credentials
- **MongoDB**: local (`mongodb://127.0.0.1:27017/ecommerce`) or an Atlas connection string.
- **Google App Password**: Google Account → Security → turn on 2-Step Verification → App passwords → create one → paste the 16 characters in `EMAIL_APP_PASSWORD`.
- **Cloudinary**: Dashboard shows Cloud Name, API Key and API Secret.

## Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Register (sends welcome email) |
| POST | `/api/auth/login` | – | Returns access + refresh token |
| GET | `/api/auth/profile` | JWT | Current user profile |
| POST | `/api/auth/refresh` | – | New tokens from a refresh token |
| POST | `/api/auth/logout` | JWT | Revoke refresh token |
| GET | `/api/products` | – | List with search, filters, pagination |
| GET | `/api/products/:id` | – | Single product |
| POST | `/api/products` | JWT | Create (multipart/form-data, optional `image`) |
| PUT | `/api/products/:id` | JWT | Update (owner or admin) |
| DELETE | `/api/products/:id` | JWT | Delete (owner or admin) |

**Query params for `GET /api/products`:** `page`, `limit`, `search`, `category`, `minPrice`, `maxPrice`, `sort` (`newest | oldest | price_asc | price_desc`).

Protected routes need the header `Authorization: Bearer <accessToken>`.

## Image upload flow
Postman (`form-data`, key `image`) → Multer saves to `/uploads` → uploaded to Cloudinary → temp file deleted with `fs` → Cloudinary URL saved in MongoDB and returned.

## Testing with Postman
Import `postman/E-Commerce-API.postman_collection.json`. Run **Login** first — it saves the tokens into collection variables automatically. For **Create Product** pick an image file in the `image` form-data field.

## Structure
```
src/
  config/       env, db, cloudinary, mailer
  controllers/  request/response handling
  services/     business logic + DB access
  models/       Mongoose schemas
  middlewares/  verifyToken, upload (Multer), validate (Joi), errorHandler
  validators/   Joi schemas
  routes/       route definitions
  utils/        ApiError, asyncHandler, token helpers
```
