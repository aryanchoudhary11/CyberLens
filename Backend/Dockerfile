# Use official Node image
FROM node:20

# Install nmap inside container
RUN apt-get update && apt-get install -y nmap

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of project files
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
