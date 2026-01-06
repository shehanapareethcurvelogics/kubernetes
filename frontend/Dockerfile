# Step 1: Use Node.js 18 as base image for building
FROM node:18-alpine AS builder

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci

# Step 5: Copy source code
COPY . .

# Step 6: Build the React app
RUN npm run build

# Step 7: Use nginx to serve the built app
FROM nginx:alpine

# Step 8: Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Step 9: Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Step 10: Expose port 80
EXPOSE 80

# Step 11: Start nginx
CMD ["nginx", "-g", "daemon off;"]

