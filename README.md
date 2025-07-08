# fastify-backend

A Fastify-based backend server powering the **Smart Cart** application with:

* PostgreSQL database management via Sequelize ORM
* Admin panel powered by AdminJS with authentication
* JWT-based user authentication
* Cart, order, and payment management endpoints
* PDF invoice generation and email sending on order approval
* CORS enabled and TypeScript support

---

## Features

* **Admin Panel**: Manage products, users, orders, and payments via AdminJS, with protected login
* **Authentication**: JWT authentication for secure API access
* **Order Handling**: Place orders, approve orders (admin only), and send invoices by email
* **Cart Operations**: Add to cart, delete cart items
* **Payments**: Create and view payments, with duplicate payment prevention
* **PDF Generation**: Generates invoices in PDF format on order approval
* **Email Notifications**: Sends invoices to users when orders are approved
* **Environment Config**: Uses `.env` for secrets and DB connection

---

## Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd fastify-backend
npm install
```

Create a `.env` file and define:

```env
DATABASE_URL=your_postgres_connection_string
SUPABASE_JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
ADMIN_COOKIE_SECRET=your_cookie_secret
```

---

## Development

Start the development server with hot reload:

```bash
npm run dev
```

Server will run on port `8900` by default.

Admin Panel URL: `http://localhost:8900/admin`

---

## API Endpoints Overview

### Public

* `GET /`
  Server health check — returns status message.

### Authentication

* `POST /login`
  Upsert user info with `uid`, `email`, `name`.

* `GET /profile`
  Retrieve authenticated user info from JWT token.

### Cart

* `POST /add_cart`
  Add an item to the user's cart.

* `DELETE /cart_items`
  Delete all cart items for authenticated user.

### Orders

* `POST /orders`
  Place an order with an array of items and total price. Requires authentication.

* **Admin Only**:
  Approve orders and send invoice emails via AdminJS interface.

### Payments

* `GET /payments`
  List all payments (no sensitive card data).

* `GET /payments/user`
  List payments for authenticated user.

* `POST /create-payment-intent`
  Create a payment with card details and amount. Prevents duplicates in 2-minute window.

---

## Technologies Used

* [Fastify](https://www.fastify.io/) — Web framework
* [Sequelize](https://sequelize.org/) — ORM for PostgreSQL
* [AdminJS](https://adminjs.co/) — Admin panel UI
* [jsonwebtoken](https://github.com/fastify/fastify-jwt) — JWT auth plugin
* [Nodemailer](https://nodemailer.com/about/) — Email sending
* [PDFKit](https://pdfkit.org/) — PDF invoice generation

---

## Project Structure

* `models.js` — Sequelize models for User, Product, Order, Payment, etc.
* `utils/pdfGenerator.js` — Utility to generate invoice PDFs
* `utils/emailSender.js` — Utility to send invoice emails
* `server.js` (or equivalent) — Main Fastify server with routes and AdminJS integration

---

# slim-backend

A PHP backend API built with Slim Framework 4, connecting to PostgreSQL, featuring product, category, review, cart, and sales endpoints with JSONB field parsing and CORS support.

---

## Features

* Slim Framework 4 for routing and middleware
* PostgreSQL database connection with native `pg_*` functions
* JSONB field parsing for complex product fields (`tags`, `dimensions`, `meta`, `images`)
* CORS enabled for cross-origin requests
* RESTful API endpoints for products, categories, reviews, cart items, image carousel, trending products, and today's sales
* Supports filtering, sorting, pagination for product listings
* Handles preflight OPTIONS requests and serves favicon

---

## Requirements

* PHP 7.4 or higher
* PostgreSQL database
* Composer

---

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd slim-backend
```

2. Install dependencies:

```bash
composer install
```

3. Create a `.env` file at the root with your database config:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASS=your_password
DB_SSLMODE=prefer
```

Adjust these as per your PostgreSQL setup.

---

## Running the Server

Start the server using PHP’s built-in web server (or configure your preferred server):

```bash
php -S localhost:8000 -t public
```

Adjust the document root if your public folder is different.

---

## API Endpoints

### Products

* `GET /products` — List products with optional filters, sorting, pagination
* `GET /product/{id}` — Get single product by ID
* `GET /trending` — Top 10 trending products
* `GET /similar/{id}` — Similar products by category
* `GET /todays-sales` — Products currently on sale

### Categories

* `GET /categories` — List all categories
* `GET /category/{id}` — Get category details by ID

### Reviews

* `GET /reviews` — List reviews, optional filter by `product_id` query param
* `GET /reviews/{id}` — Get review by ID
* `GET /reviews/product/{product_id}` — List reviews for a product

### Cart Items

* `GET /cart_items` — List cart items, optional filter by `user_uid`
* `GET /cart_items/{id}` — Get cart item by ID
* `PUT /cart_items/{id}/update` — Update cart item (quantity, price)
* `DELETE /cart_items/{id}/delete` — Delete cart item by ID

### Other

* `GET /imagecarousel` — Get carousel images

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS) with permissive headers to allow requests from any origin.

---


# Fiber Backend - Ecommerce API

A simple ecommerce backend API built with [Fiber](https://gofiber.io/), [GORM](https://gorm.io/) ORM, and PostgreSQL.

## Features

* Product model with JSONB fields (`tags`, `dimensions`, `meta`, `images`)
* REST endpoint for latest product notifications (latest 5 products)
* CORS enabled for all origins
* Environment variables support via `.env`
* PostgreSQL database connection using GORM

## Requirements

* Go 1.23.4+
* PostgreSQL database
* `.env` file with environment variables:

  * `DATABASE_URL` — PostgreSQL DSN connection string
  * `PORT` — server port (default: 3000)

## Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-directory>
   ```

2. Create a `.env` file with your database connection details:

   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/dbname?sslmode=disable
   PORT=3000
   ```

3. Build and run the server:

   ```bash
   go mod tidy
   go run main.go
   ```

4. The server will be running at: `http://localhost:3000`

## API Endpoints

### GET /

Health check endpoint

**Response:**

```
✅ Product notification server running
```

### GET /notifications

Returns the 5 most recent product notifications with the following JSON structure:

```json
[
  {
    "type": "product",
    "title": "New Product: Product Title",
    "message": "Product Description (Category)",
    "timestamp": "2025-07-08T12:34:56Z"
  }
]
```

## Model Structure

| Field                | Type    | Description                  |
| -------------------- | ------- | ---------------------------- |
| ID                   | uint    | Primary key                  |
| Title                | string  | Product title                |
| Description          | string  | Product description          |
| Category             | string  | Product category             |
| Price                | float64 | Price                        |
| DiscountPercentage   | float64 | Discount percentage          |
| Rating               | float64 | Product rating               |
| Stock                | int     | Available stock              |
| Tags                 | JSONB   | JSON array of tags           |
| Brand                | string  | Brand name                   |
| SKU                  | string  | Stock keeping unit           |
| Weight               | float64 | Product weight               |
| Dimensions           | JSONB   | JSON with product dimensions |
| AvailabilityStatus   | string  | Availability info            |
| MinimumOrderQuantity | int     | Minimum quantity to order    |
| Meta                 | JSONB   | Additional metadata          |
| Images               | JSONB   | Product images               |
| Thumbnail            | string  | URL to product thumbnail     |

---

# asp-backend

A simple ASP.NET Core minimal API to fetch orders data from a PostgreSQL database.

Uses:

* [Npgsql](https://www.npgsql.org/) for PostgreSQL connectivity
* [DotNetEnv](https://github.com/tonerdo/dotnet-env) to load environment variables from a `.env` file
* CORS enabled for all origins

## Requirements

* .NET 9 SDK
* PostgreSQL database
* `.env` file with database credentials

## Environment Variables

Create a `.env` file in the project root with the following:

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
DB_SSLMODE=disable
DB_TRUST_CERT=true
```

## Running the API

1. Restore dependencies and build:

   ```bash
   dotnet restore
   dotnet build
   ```

2. Run the API:

   ```bash
   dotnet run
   ```

3. The API will be available at:

   ```
   http://localhost:5267
   ```

## Endpoints

### GET /

Returns a simple status message.

```http
GET /
```

Response:

```
Your server is running
```

### GET /orders

Returns a list of all orders.

```http
GET /orders
```

Response: JSON array of orders.

### GET /orders/{userUid}

Returns orders filtered by user UID.

```http
GET /orders/{userUid}
```

Example:

```
GET /orders/123e4567-e89b-12d3-a456-426614174000
```

Response: JSON array of orders for the specified user.

---

# flask-backend

This is an AI-powered product search and recommendation API built with **Flask**, **scikit-learn**, and **TF-IDF + KNN** models. It acts as an intelligent shopping assistant that can understand natural queries about products, prices, availability, and similar items.

## 🔧 Features

* 💬 **Natural language query understanding** (`/ask`)
* 🔍 **Product search by category, stock status, or price filter**
* 🧠 **AI-powered product recommendation** using TF-IDF + KNN (`/similar`)
* 📈 **Tracks trending searches** (`/trending`)
* 🌐 **CORS-enabled** Flask app
* 🔗 **Integration with external product API** (`https://slimcommerce.onrender.com/products`)

---

## 📦 Requirements

* Python 3.8+
* `Flask`, `Flask-CORS`, `scikit-learn`, `requests`

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 🚀 Run the App

```bash
python app.py
```

Server will start at:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### `GET /`

Returns a welcome message and available routes.

**Response:**

```json
{
  "message": "👋 Welcome to SmartCart AI Assistant!",
  "endpoints": ["/ask", "/similar", "/trending"]
}
```

---

### `POST /ask`

Smart Q\&A assistant for product-related questions.

**Request Body:**

```json
{
  "query": "show me womens bags under $50"
}
```

**Use cases it supports:**

* Category-based queries (e.g. "show me laptops")
* Price filters (e.g. "below \$100", "over \$50")
* Stock status (e.g. "is the iPhone 13 in stock?")
* Greetings (e.g. "hello", "hi")

**Response:**

```json
{
  "answer": "Products in category 'womens-bags' below $50:",
  "products": [ ... ],
  "yes": true
}
```

---

### `POST /similar`

Returns 5 similar products to the queried item using TF-IDF vectorization + KNN similarity.

**Request Body:**

```json
{
  "query": "iPhone 13"
}
```

**Response:**

```json
{
  "answer": "Products similar to 'iPhone 13' in category 'smartphones':",
  "target_product": { ... },
  "similar_products": [ ... ],
  "yes": true
}
```

---

### `GET /trending`

Returns the top 10 most frequently searched queries.

**Response:**

```json
{
  "trending_searches": [
    { "query": "womens bags", "count": 5 },
    { "query": "iphone", "count": 3 }
  ]
}
```

## 🤖 Tech Stack

* **Flask**: Web framework
* **Flask-CORS**: CORS middleware
* **scikit-learn**: TF-IDF vectorizer + KNN
* **Requests**: For fetching product data
* **Counter**: Trending query tracking

---

