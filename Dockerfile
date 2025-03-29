# Use Node.js 20 (Alpine for a lightweight image)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies (including Prisma)
RUN npm install

# Copy the entire project (excluding files listed in .dockerignore)
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript files
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to start the application
CMD ["npm", "run", "start"]
