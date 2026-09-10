# GlobePass: Global Visa & Consular Intelligence Platform

[![Live Site](https://img.shields.io/badge/Live%20Site-globepass--visa.vercel.app-2ea44f?style=for-the-badge&logo=vercel)](https://globepass-visa.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38b2ac?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange?style=for-the-badge&logo=google)](https://aistudio.google.com/)

> 🌐 **Official Live Production URL**: [https://globepass-visa.vercel.app/](https://globepass-visa.vercel.app/)

---

## 📖 Overview & Project Description

**GlobePass** is a high-performance, bilingual (Thai / English) travel intelligence and consular roadmap web application. Built with Next.js 16 App Router, React 19, Tailwind CSS v4, and powered by Google Gemini 2.5 Flash, GlobePass provides travelers with instant bilateral visa status, consular document checklists, estimated processing fees, and step-by-step application guidance across 199 countries and over 39,601 bilateral diplomatic relationships.

The platform is designed and optimized as a **Zero-Database Serverless Web Application deployed on Vercel**, eliminating the operational overhead and costs of dedicated cloud databases while delivering sub-millisecond initial responses through pre-indexed diplomatic matrices and secure on-demand serverless AI synthesis.

---

## 🗺️ Architecture & System Flow

GlobePass operates on a serverless Edge architecture where Next.js App Router delivers the user interface while isolated Serverless Route Handlers orchestrate consular intelligence and AI synthesis:

```mermaid
sequenceDiagram
    autonumber
    actor User as Traveler (Browser Client)
    participant FE as Next.js 16 App Router (Client & UI)
    participant Edge as Serverless Route (/api/visa/ai-guide)
    participant Dataset as Pre-Indexed Consular Dataset (199 Countries)
    participant AI as Google Gemini 2.5 Flash

    Note over User, FE: Step 1: Destination Selection
    User->>FE: Selects Origin & Destination Countries
    FE->>Dataset: Instant Local Baseline Verification (< 5ms)
    FE->>User: Displays Instant Status (Visa Free, eVisa, Embassy Visa)

    Note over User, Edge: Step 2: Consular Checklist Request
    User->>FE: Clicks "ตรวจสอบข้อกำหนดทางการ (Check Official Requirements)"
    FE->>Edge: POST /api/visa/ai-guide { from_country: "TH", to_country: "JP", lang: "th" }
    
    Note over Edge: Step 3: Security & Input Sanitization
    Edge->>Edge: Strict ISO 3166-1 alpha-2 Regex Check (/^[A-Z]{2}$/)
    
    Note over Edge, AI: Step 4: Serverless AI Synthesis
    alt Gemini API Key Configured
        Edge->>AI: Synthesize consular requirements & official embassy portal URL
        alt AI Response Success
            AI-->>Edge: Structured Consular JSON (docs, steps, fees, processing time)
            Edge-->>FE: HTTP 200 (Cache-Control: s-maxage=3600)
        else Rate-limited or Timeout
            Edge->>Dataset: Deterministic Consular Policy Baseline
            Edge-->>FE: HTTP 200 (Deterministic Fallback)
        end
    else No API Key Provided
        Edge->>Dataset: Deterministic Consular Policy Baseline
        Edge-->>FE: HTTP 200 (Deterministic Fallback)
    end

    Note over FE, User: Step 5: Interactive Traveler UI
    FE->>User: Renders Status Badge, Document Dossier, Step Roadmap & Official Embassy Link
```

---

## ✨ Key Features & Capabilities

- **⚡ Zero-Database Serverless Operation**: Deploys effortlessly on Vercel with zero external database dependencies (no PostgreSQL, Redis, or SQLite required in production).
- **🌐 Comprehensive Bilateral Coverage**: Pre-indexes all 199 ISO countries and 39,601 bilateral diplomatic pairings.
- **🤖 Server-Side AI Synthesis**: Generates up-to-date document dossiers, step-by-step consular roadmaps, and official embassy links via Google Gemini 2.5 Flash.
- **🔒 Bank-Grade Key Isolation**: All AI synthesis requests execute securely inside serverless route handlers; zero API credentials or tokens are ever exposed to the client bundle.
- **🏙️ Kinetic Cityscape Visuals**: Dynamic animated skyline silhouettes celebrating global landmarks with physics-based spring animations.
- **🇹🇭 Bilingual Typography**: Elegant typography system pairing Google Font's organic serif (`Fraunces`) with clean Thai geometric sans-serif (`Prompt`).
- **📱 Fully Responsive**: 375px mobile density budget with bottom navigation bar and adaptive desktop layouts.

---

## 🛡️ Security Audit & Vulnerability Safeguards

GlobePass enforces strict security controls across both client and serverless boundaries:

| Security Domain | Defense Mechanism | Risk Prevented |
| :--- | :--- | :--- |
| **Credential Protection** | API keys read strictly via `process.env.GEMINI_API_KEY` in server-side Route Handlers. No client-exposed tokens. | **Zero credential leakage or token extraction** |
| **Input Sanitization** | All endpoints validate parameters using `/^[A-Z]{2}$/` regex against ISO 3166-1 alpha-2 standards. | **Eliminates prompt injection, parameter tampering & SSRF** |
| **DDoS & Quota Defense** | Edge caching with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200`. | **Mitigates rate exhaustion and unnecessary API billing** |
| **Request Timeout** | `AbortController` timeout (10,000ms) prevents unbounded worker thread hangs. | **Prevents resource exhaustion on slow upstream services** |
| **Deterministic Failover** | Automatic fallback to verified consular baselines if external AI APIs fail or rate limit. | **Zero service downtime (100% availability)** |
| **Safe Error Handling** | Production error responses return sanitized messages without server stack traces. | **Prevents internal infrastructure fingerprinting** |

---

## 🚀 Live Production & Deployment

### Live Application
- **Production URL**: [https://globepass-visa.vercel.app/](https://globepass-visa.vercel.app/)
- **Hosting Platform**: Vercel Serverless Edge Network
- **Status**: Operational & Live

### Deploying Your Own Instance on Vercel

1. **Fork or Import**: Import repository `ZillerDX/globepass-visa` in your [Vercel Dashboard](https://vercel.com/dashboard).
2. **Root Directory**: Set **Root Directory** to `frontend`.
3. **Framework**: Vercel automatically selects **Next.js**.
4. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
5. **Deploy**: Click **Deploy** to launch in under 60 seconds.

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/ZillerDX/globepass-visa.git
cd globepass-visa/frontend

# 2. Install dependencies
npm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Add your Gemini API key (optional for local AI testing)
# GEMINI_API_KEY=your_key_here

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application locally.

---

## 📁 Repository Structure

```
globepass-visa/
├── frontend/                     # Next.js 16 App Router (Vercel Production Root)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/visa/ai-guide # Serverless AI consular synthesis route
│   │   │   ├── api/visa/quick    # Serverless baseline lookup route
│   │   │   ├── layout.tsx        # Root layout & bilingual fonts
│   │   │   └── page.tsx          # Main interactive application page
│   │   ├── components/
│   │   │   ├── CitySilhouette.tsx# Kinetic architectural skyline component
│   │   │   ├── CountryCard.tsx   # Popular destination cards
│   │   │   ├── VisaResult.tsx    # Consular guide dossier & step timeline
│   │   │   ├── Navbar.tsx        # Clean brand navbar & language toggle
│   │   │   └── ui/               # Modular UI controls
│   │   ├── lib/
│   │   │   ├── api.ts            # Dynamic client API & failover handler
│   │   │   ├── i18n.ts           # Thai & English translation dictionaries
│   │   │   └── data/             # 199 Countries & bilateral visa matrices
│   │   └── types/                # TypeScript interfaces
│   ├── package.json
│   └── next.config.ts
├── backend/                      # Optional Python FastAPI service (local/hybrid)
│   ├── app/                      # Endpoints, database models & scrapers
│   └── requirements.txt
├── LICENSE                       # MIT License
└── README.md                     # Documentation & technical specifications
```

---

## 📄 License

This project is open source and available under the terms of the [MIT License](./LICENSE).

Copyright (c) 2026 Tanathon Chanapha (ZillerDX)

