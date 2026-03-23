# Use official Node image
FROM node:20

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nmap \
    curl \
    unzip \
    wget \
    ruby \
    ruby-dev \
    perl \
    libssl-dev \
    python3 \
    python3-pip \
    git \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# Give nmap the capabilities it needs
RUN setcap cap_net_raw,cap_net_admin+eip /usr/bin/nmap || true

# Install Nikto manually from GitHub
RUN git clone https://github.com/sullo/nikto.git /opt/nikto \
    && ln -s /opt/nikto/program/nikto.pl /usr/local/bin/nikto \
    && chmod +x /opt/nikto/program/nikto.pl

# Install Nikto Perl dependencies
RUN apt-get update && apt-get install -y \
    libjson-perl \
    libxml-writer-perl \
    libnet-ssleay-perl \
    libio-socket-ssl-perl \
    && rm -rf /var/lib/apt/lists/*

# Update Nikto database
RUN nikto -update || true

# Install WhatWeb manually from GitHub
RUN git clone https://github.com/urbanadventurer/WhatWeb.git /opt/whatweb \
    && ln -s /opt/whatweb/whatweb /usr/local/bin/whatweb \
    && chmod +x /opt/whatweb/whatweb \
    && cd /opt/whatweb && gem install bundler && bundle install

# Install Nuclei
RUN curl -s https://api.github.com/repos/projectdiscovery/nuclei/releases/latest \
    | grep "browser_download_url.*linux_amd64.zip" \
    | cut -d '"' -f 4 \
    | wget -i - -O nuclei.zip \
    && unzip nuclei.zip \
    && mv nuclei /usr/local/bin/ \
    && rm nuclei.zip

# Install Subfinder
RUN curl -s https://api.github.com/repos/projectdiscovery/subfinder/releases/latest \
    | grep "browser_download_url.*linux_amd64.zip" \
    | cut -d '"' -f 4 \
    | wget -i - -O subfinder.zip \
    && unzip -o subfinder.zip subfinder \
    && mv subfinder /usr/local/bin/ \
    && rm subfinder.zip

# Install SSLyze
RUN pip3 install sslyze --break-system-packages

# Install Nuclei templates
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