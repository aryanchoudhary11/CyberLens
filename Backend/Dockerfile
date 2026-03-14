# Use official Node image
FROM node:20

# Install required tools
RUN apt-get update && apt-get install -y \
    nmap \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Nuclei using official install script
RUN curl -s https://api.github.com/repos/projectdiscovery/nuclei/releases/latest \
    | grep "browser_download_url.*linux_amd64.zip" \
    | cut -d '"' -f 4 \
    | wget -i - -O nuclei.zip \
    && unzip nuclei.zip \
    && mv nuclei /usr/local/bin/ \
    && rm nuclei.zip

# Install templates
RUN nuclei -update-templates

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["node", "server.js"]