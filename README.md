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

---

## 🚀 Setting Up NVM (Node Version Manager)

To manage Node.js versions efficiently, follow these steps to set up **nvm** permanently.

### 2️⃣ Install or Configure NVM  
#### Install NVM (if not installed)
```sh
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
```

#### Add `nvm` to Your Shell Configuration  
Since macOS uses **zsh** by default, add the following lines to your `~/.zshrc` file:

```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

#### Apply the Changes  
```sh
source ~/.zshrc
```

#### Verify `nvm` Installation  
```sh
nvm --version
```

#### Install and Use Node.js via `nvm`  
```sh
nvm install 20
nvm use 20
nvm alias default 20
```

Now, **nvm** is permanently available, and your preferred Node.js version will be set automatically! 🚀

---

### 3️⃣ Install Dependencies  
```sh
npm install
```

---

## 📌 Installing Dependencies

### 4️⃣ Installing MySQL 8 on macOS (using Homebrew)
```sh
brew install mysql@8.0
brew services start mysql
mysql_secure_installation
```

---

## 🛠️ Prisma Configuration  

### 5️⃣ Generate Prisma Client  
```sh
npx prisma generate
```

### 6️⃣ Apply database migrations  
```sh
npx prisma migrate dev --name init
```

---

## 🚀 Run the Server  
```sh
npm run dev
```
Server will start at **http://localhost:3000** 🚀  

---
