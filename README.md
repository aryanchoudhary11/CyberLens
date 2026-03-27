# 🛡️ CyberLens — AI-Powered Vulnerability Assessment Platform

<div align="center">

![CyberLens Banner](https://img.shields.io/badge/CyberLens-Vulnerability%20Assessment-2563EB?style=for-the-badge&logo=shield&logoColor=white)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**A unified web-based platform integrating 6 professional security tools with AI-assisted vulnerability analysis, automated CVE correlation, and professional PDF reporting.**

[Live Demo](https://cyberlens-nine.vercel.app)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Security Tools](#security-tools)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Known Limitations](#known-limitations)
- [Contributing](#contributing)

---

## 🔍 About

CyberLens addresses the **fragmentation problem** in vulnerability assessment workflows. Instead of running Nmap, Nikto, Nuclei, WhatWeb, Subfinder, and SSLyze separately — CyberLens provides a single unified interface with:

- 🤖 **AI-powered analysis** — Ask about vulnerabilities in plain English
- 🔴 **Automatic CVE correlation** — Fetches CVSS scores from CVE database
- ⚠️ **Risk scoring** — Calculates risk per target based on severity weights
- 📄 **PDF reports** — Professional export with one click
- 👤 **Multi-user** — Complete per-user data isolation

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔧 **6 Security Tools** | Nmap, Nuclei, Nikto, WhatWeb, Subfinder, SSLyze |
| 🤖 **AI Chatbot** | Powered by Llama 3.3 via Groq API |
| 🔴 **CVE Lookup** | Auto-fetches CVE details and CVSS scores |
| ⚠️ **Risk Scoring** | Dynamic risk calculation per target |
| 📄 **PDF Export** | Professional vulnerability reports |
| 📊 **Dashboard** | Real-time charts and statistics |
| 👤 **Multi-User** | JWT authentication with data isolation |
| 🐳 **Docker** | Fully containerized backend |

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** with Vite
- **Tailwind CSS v3** for styling
- **Chart.js** for data visualization
- **PDFMake** for PDF generation
- **React Router v6** for navigation

### Backend
- **Node.js 20** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Docker** for containerization

### AI & APIs
- **Groq API** (Llama 3.3 70B) for AI chatbot
- **CVE CIRCL API** for CVE correlation

---

## 🔧 Security Tools

```
┌─────────────┬──────────────┬─────────────────────────────────────┐
│ Tool        │ Version      │ Purpose                             │
├─────────────┼──────────────┼─────────────────────────────────────┤
│ Nmap        │ 7.x          │ Port scanning & service detection   │
│ Nuclei      │ v3.7.1       │ Vulnerability scanning (9000+ tpls) │
│ Nikto       │ v2.6         │ Web server vulnerability scanner    │
│ WhatWeb     │ v0.6.3       │ Technology fingerprinting           │
│ Subfinder   │ v2.13        │ Subdomain discovery                 │
│ SSLyze      │ v6.3         │ SSL/TLS configuration analyzer      │
└─────────────┴──────────────┴─────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 20+](https://nodejs.org/)
- [MongoDB Atlas](https://mongodb.com/atlas) account (free tier)
- [Groq API Key](https://console.groq.com) (free)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/CyberLens.git
cd CyberLens
```

**2. Setup Backend**
```bash
cd Backend

# Create .env file
cp .env.example .env
# Fill in your environment variables

# Build Docker image
docker build -t cyberlens-backend .

# Run backend container
docker run -d \
  --name cyberlens-backend \
  --network bridge \
  -p 5000:5000 \
  --env-file .env \
  cyberlens-backend
```

**3. Setup DVWA for testing (optional)**
```bash
docker run -d \
  --name dvwa \
  --network bridge \
  -p 8080:80 \
  vulnerables/web-dvwa
```

**4. Setup Frontend**
```bash
cd Frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

**5. Open your browser**
```
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/CyberLens

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# AI
GROQ_API_KEY=gsk_your_groq_api_key_here

# Server
PORT=5000

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```


## 📡 API Reference

### Authentication
```
POST /api/auth/register     Register new user
POST /api/auth/login        Login user
GET  /api/auth/profile      Get user profile
PUT  /api/auth/update-username   Update username
PUT  /api/auth/change-password   Change password
DELETE /api/auth/delete-account  Delete account
```

### Targets
```
GET    /api/targets          Get all targets
POST   /api/targets          Add new target
PUT    /api/targets/:id      Update target
DELETE /api/targets/:id      Delete target
POST   /api/targets/:id/verify  Verify target
```

### Scans
```
POST   /api/scan/start       Start a scan
GET    /api/scan/history     Get scan history
GET    /api/scan/:id         Get scan by ID
DELETE /api/scan/:id         Delete scan
```

### Dashboard
```
GET /api/dashboard/stats     Get dashboard statistics
```

### AI
```
POST /api/ai/chat            Chat with AI assistant
```

---

## ⚠️ Known Limitations

| Limitation | Description |
|---|---|
| **Nmap on Cloud** | Requires raw socket access — not available on shared cloud platforms (Railway/Render). Works on VPS or local deployment. |
| **Internet Required** | CVE lookup, AI chatbot, and Subfinder require internet connectivity |
| **Scan Duration** | Nuclei scans take 5-10 minutes with 6000+ templates |
| **Groq Rate Limits** | Free tier limited to 1,000 requests/day |

---

## ⚖️ Legal & Ethical Usage

> ⚠️ **Important:** Only scan systems you own or have explicit written permission to test. Unauthorized scanning may be illegal in your jurisdiction. This tool is intended for security research, education, and authorized penetration testing only.

---

## 🔴 Risk Scoring Formula

```
Risk Score = (Critical × 10) + (High × 7) + (Medium × 4) + (Low × 1)

Risk Levels:
  0        → None
  1 - 20   → Low
  21 - 50  → Medium
  51 - 100 → High
  100+     → Critical
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [ProjectDiscovery](https://projectdiscovery.io/) — Nuclei & Subfinder
- [Nmap Project](https://nmap.org/) — Network scanner
- [Nikto](https://github.com/sullo/nikto) — Web server scanner
- [WhatWeb](https://github.com/urbanadventurer/WhatWeb) — Technology fingerprinter
- [SSLyze](https://github.com/nabla-c0d3/sslyze) — SSL analyzer
- [Groq](https://groq.com/) — AI inference
- [CVE CIRCL](https://cve.circl.lu/) — CVE database API

---

<div align="center">
  <p>Built with ❤️ for security research and education</p>
  <p>© 2026 CyberLens</p>
</div>
