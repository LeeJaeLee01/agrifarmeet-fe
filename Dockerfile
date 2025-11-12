FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN if [ -f yarn.lock ]; then \
        rm -f package-lock.json && \
        yarn install; \
    else \
        npm ci; \
    fi

# Copy source code
COPY . .

# Expose port 3000 (React default port)
EXPOSE 3000

# Start development server
CMD ["npm", "start"]

