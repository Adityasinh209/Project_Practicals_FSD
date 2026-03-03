# 🛒 MongoDB + Mongoose College Project
### E-Commerce CRUD Application

---

## 📁 Project Structure
```
mongodb-project/
├── server.js                   ← Entry point
├── .env                        ← MongoDB URI (configure this!)
├── package.json
├── config/
│   └── db.js                   ← MongoDB connection
├── models/
│   ├── User.js                 ← User schema
│   ├── Product.js              ← Product schema
│   ├── Cart.js                 ← Cart schema
│   └── Order.js                ← Order schema
├── controllers/
│   ├── userController.js       ← User CRUD logic
│   ├── productController.js    ← Product CRUD logic
│   ├── cartController.js       ← Cart CRUD logic
│   └── orderController.js      ← Order CRUD logic
└── routes/
    ├── userRoutes.js
    ├── productRoutes.js
    ├── cartRoutes.js
    └── orderRoutes.js
```

---

## ⚙️ Setup & Run

### Step 1: Install dependencies
```bash
npm install
```

### Step 2: Configure MongoDB
Edit `.env` file:
```
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/ecommerce_db

# For MongoDB Atlas (cloud):
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_db
```

### Step 3: Start the server
```bash
node server.js
# or with auto-restart:
npm run dev
```

---

## 🔌 API Endpoints

### 👤 Users
| Method | URL                  | Description        |
|--------|----------------------|--------------------|
| POST   | /api/users           | Create user        |
| GET    | /api/users           | Get all users      |
| GET    | /api/users/:id       | Get user by ID     |
| PUT    | /api/users/:id       | Update user        |
| DELETE | /api/users/:id       | Delete user        |

### 📦 Products
| Method | URL                  | Description        |
|--------|----------------------|--------------------|
| POST   | /api/products        | Add product        |
| GET    | /api/products        | Get all products   |
| GET    | /api/products/:id    | Get product by ID  |
| PUT    | /api/products/:id    | Update product     |
| DELETE | /api/products/:id    | Delete product     |

### 🛒 Cart
| Method | URL                  | Description        |
|--------|----------------------|--------------------|
| POST   | /api/cart            | Add item to cart   |
| GET    | /api/cart/:userId    | View cart          |
| PUT    | /api/cart            | Update quantity    |
| DELETE | /api/cart/:userId    | Clear cart         |

### 📋 Orders
| Method | URL                       | Description         |
|--------|---------------------------|---------------------|
| POST   | /api/orders               | Place order         |
| GET    | /api/orders               | All orders (admin)  |
| GET    | /api/orders/user/:userId  | User's orders       |
| GET    | /api/orders/:id           | Single order        |
| PUT    | /api/orders/:id           | Update status       |
| DELETE | /api/orders/:id           | Cancel order        |

---

## 📝 Sample API Requests (use Postman or Thunder Client)

### Create a User
```json
POST /api/users
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "pass123",
  "phone": "9876543210"
}
```

### Add a Product
```json
POST /api/products
{
  "name": "Wireless Headphones",
  "description": "Noise cancelling headphones",
  "price": 2999,
  "category": "Electronics",
  "stock": 50
}
```

### Add to Cart
```json
POST /api/cart
{
  "userId": "<user_id_from_db>",
  "productId": "<product_id_from_db>",
  "quantity": 2
}
```

### Place Order
```json
POST /api/orders
{
  "userId": "<user_id>",
  "shippingAddress": {
    "street": "123 MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "UPI"
}
```

---

## 🧠 Key Mongoose Concepts Used

| Concept | Where Used |
|--------|-----------|
| `Schema` | All 4 models |
| `Model` | All 4 models |
| `ObjectId / ref` | Cart → Product, Order → User |
| `.populate()` | Joins across collections |
| `.save()` | Create & Update |
| `.find()` | Read all |
| `.findById()` | Read one |
| `.findByIdAndUpdate()` | Update |
| `.findByIdAndDelete()` | Delete |
| `pre("save")` hook | Cart auto-calculates total |
| `$inc` operator | Decrement stock on order |
| Validators | Required, minlength, enum, match |
| `timestamps: true` | Auto createdAt/updatedAt |
