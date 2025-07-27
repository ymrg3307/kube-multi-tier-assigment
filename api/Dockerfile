# Use official Node.js LTS slim image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies (package.json + package-lock.json if available)
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --progress=false

# Bundle app source
COPY . .

# Expose service port
ENV PORT=3000
EXPOSE 3000

# Start the service
CMD ["npm", "start"]
