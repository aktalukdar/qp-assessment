# 🛒 Grocery Booking API  

A **Node.js + TypeScript** backend for booking grocery items, built with **Express.js**, **Prisma ORM**, and **JWT authentication**.

---

## 🛠️ Tech Stack  
- **Node.js** + **Express.js**  
- **TypeScript**  
- **Prisma ORM**  
- **MySQL**  
- **JWT Authentication**  

---

## ⚙️ Setup & Installation  

### 1️⃣ Clone the Repository  
```sh
git clone <repo-link>
cd qp-assessment
```

### 2️⃣ Install Dependencies  
```sh
npm install
```

### 3️⃣ Configure Environment Variables  

1. Copy the `.env.sample` file and rename it to `.env` in the project's root directory.  
2. Update the environment variables with the appropriate values based on your setup.  


### 4️⃣ Installing MySQL 8 on macOS (using Homebrew)
```sh
brew install mysql@8.0
brew services start mysql
mysql_secure_installation
```

### 5️⃣ Prisma Configuration  
Generate Prisma Client:  
```sh
npx prisma generate
```

Apply database migrations:  
```sh
npx prisma migrate dev --name init
```

### 6️⃣ Run the Server  
```sh
npm run dev
```
Server will start at **http://localhost:3000** 🚀  

---
