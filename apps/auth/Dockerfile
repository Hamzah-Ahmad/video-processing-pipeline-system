# ---- Builder Stage ----
    FROM node:20 AS builder
    WORKDIR /usr/src/app
    
    # Install all dependencies (dev + prod)
    COPY package*.json ./
    COPY tsconfig*.json ./
    RUN npm install
    
    # Copy everything for build
    COPY . .
    RUN npm run build
    
    # ---- Production Stage ----
    FROM node:20 AS production
    WORKDIR /usr/src/app
    
    # Only production dependencies
    COPY package*.json ./
    RUN npm install --only=production
    
    # Copy compiled JS
    COPY --from=builder /usr/src/app/dist ./dist
    
    # Copy any runtime assets (optional, like configs)
    COPY --from=builder /usr/src/app/apps ./apps
    COPY --from=builder /usr/src/app/libs ./libs
    
    EXPOSE 3000
    CMD ["node", "dist/apps/auth/main.js"]
    
    FROM node:20 AS dev
    WORKDIR /usr/src/app
    
    # Install all dependencies including dev
    COPY package*.json ./
    RUN npm install
    
    # Mount project files at runtime for hot reload
    EXPOSE 3000
    CMD ["npm", "run", "start:dev"]
    