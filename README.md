# JMRH Publications - Academic Publishing Platform

A comprehensive academic publishing platform for JMRH Publications, featuring journal and book publishing services.

## 🌐 Website

**Live URL**: https://jmrhpublications.com

## 🔐 Login & Registration Credentials

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jmrh.com | admin123 |
| Professor | professor@jmrh.com | professor123 |
| User | user@jmrh.com | user123 |

### Registration

Users can register at `/auth` with the following fields:
- Full Name
- Email Address
- Password (min 6 characters)
- Phone Number
- Institution / Affiliation
- Department
- Degree
- Role (Researcher/Student/Professor/Academician/Professional)

## 📋 Submission Credentials

### Email for Manuscript Submission

- **Submission Email**: submit.jmrh@gmail.com
- **Editorial Email**: editor.jmrh@gmail.com
- **General Email**: jmrhpublications@gmail.com
- **Reviewer Email**: review.jmrh@gmail.com

### Submission Process

1. Visit `/submit-paper`
2. Select Journal Paper or Book Chapter
3. Fill in author details
4. Fill in manuscript details (title, abstract, discipline, keywords)
5. Upload manuscript file
6. Click Submit - this opens email client with all details pre-filled
7. Attach manuscript file and send to submit.jmrh@gmail.com

## 📱 Contact

- **Phone**: +91 80722 42010
- **Address**: JMRH Publications, Gudalur, The Nilgiris – 643212, Tamil Nadu, India

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage)
- **Routing**: React Router
- **Animations**: Framer Motion

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/journals` | Journal About |
| `/books` | Published Books |
| `/call-for-papers` | Call for Papers |
| `/call-for-chapters` | Call for Book Chapters |
| `/submit-paper` | Online Submission Form |
| `/auth` | Login / Register |
| `/policies` | Publication Policies |
| `/about-us` | About Us |
| `/contact` | Contact Us |

## Journal Pages

| Route | Description |
|-------|-------------|
| `/journal/about` | About the Journal |
| `/journal/aims-scope` | Aims & Scope |
| `/journal/editorial-board` | Editorial Board |
| `/journal/peer-review` | Peer Review Process |
| `/journal/ethics` | Publication Ethics |
| `/journal/plagiarism` | Plagiarism Policy |
| `/journal/open-access` | Open Access Policy |
| `/journal/guidelines` | Author Guidelines |
| `/journal/current-issue` | Current Issue |
| `/journal/archives` | Archives |
| `/journal/submit` | Submit Manuscript |

## Books Pages

| Route | Description |
|-------|-------------|
| `/books/about` | About Book Publishing |
| `/books/published` | Published Books |
| `/books/proposal` | Submit Book Proposal |
| `/books/isbn` | ISBN Information |

## 🎨 Design

- **Colors**: Oxford Blue (#1e3a5f), Gold (#d4af37)
- **Theme**: Clean white background
- **Font**: Serif for headings, Sans-serif for body

## 📝 APC (Article Processing Charge)

- Journal Papers: ₹750 (INR)
- Book Chapters: ₹500 (INR)

## License

Copyright © 2026 JMRH Publications. All rights reserved.
