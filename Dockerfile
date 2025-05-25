# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set executable permissions
RUN chmod +x dist/index.js

# Create non-root user
RUN useradd -m -u 1001 mcpuser
USER mcpuser

# Set the entrypoint
ENTRYPOINT ["node", "dist/index.js"]