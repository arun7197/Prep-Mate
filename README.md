# PrepMate — AI Mock Interview Platform

> Practice real interviews before the real one. Speak out loud, get detailed AI feedback, and track your progress.

🔗 **Live Demo:** [prep-mate-ai-beta.vercel.app](https://prep-mate-ai-beta.vercel.app)

---

## What is PrepMate?

PrepMate is an AI-powered mock interview platform that simulates a real face-to-face interview experience. You speak your answers out loud using your microphone — just like in an actual interview — and the AI evaluates your responses, giving you detailed feedback on what you said, what the ideal answer was, and how you can improve.

---

## Features

- **Personalized Interview Setup** — Enter your job role, tech stack, and years of experience to generate tailored interview questions
- **Realistic Interview Experience** — Webcam + microphone enabled; speak your answers out loud like a real f2f interview
- **AI-Generated Questions** — Questions are dynamically generated based on your role and tech stack
- **Text-to-Speech** — Questions are read aloud so you can stay focused without reading a screen
- **Voice Recording** — Record your spoken answers per question
- **Detailed Post-Interview Feedback** — For every question, see:
  - The correct/ideal answer
  - What you said
  - What you can improve
- **Dashboard** — View all previous interview sessions with role, date, and experience details
- **Authentication** — Secure sign-up and login

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| AI | Google Gemini API |
| Auth | Clerk |
| Deployment | Vercel |

---

## Screenshots

### Landing Page

<img width="1898" height="798" alt="Screenshot 2026-03-12 083609" src="https://github.com/user-attachments/assets/ecc7fc53-0a46-4930-a48c-757d5756e73e" />

### Dashboard
<img width="998" height="836" alt="Screenshot 2026-03-11 122344" src="https://github.com/user-attachments/assets/5be618d5-12b7-4fb1-a2cd-f8aa36cd4ba4" />


### Interview Setup
<img width="1919" height="864" alt="Screenshot 2026-03-12 083847" src="https://github.com/user-attachments/assets/a6b9ac4e-7f76-48ff-98c4-1c8ea6d340b3" />


### Live Interview
<img width="1897" height="855" alt="Screenshot 2026-03-12 084258" src="https://github.com/user-attachments/assets/1aabbbca-2259-4b26-afae-927ca2bae498" />


### Feedback
<img width="1899" height="864" alt="Screenshot 2026-03-12 084006" src="https://github.com/user-attachments/assets/1531e57c-deae-4267-b571-c5cd28f40451" />


---

## Getting Started (Local Setup)

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud e.g. Neon)
- Google Gemini API key
- Clerk account (for auth)

### 1. Clone the repository

```bash
git clone https://github.com/arun7197/Prep-Mate.git
cd Prep-Mate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/

NEXT_PUBLIC_DRIZZLE_DB_URL=your_postgresql_connection_string

NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run database migrations

```bash
npx drizzle-kit push
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## User Flow

```
Sign Up / Log In
      ↓
Dashboard (view past interviews)
      ↓
Create New Interview (fill role, tech stack, experience)
      ↓
Interview Setup Page (enable webcam + mic)
      ↓
Live Interview (5 questions, speak answers via mic)
      ↓
Detailed Feedback Page (per-question breakdown)
      ↓
Back to Dashboard
```

---

## Author

**Arun** — [github.com/arun7197](https://github.com/arun7197)

---

## License

This project is open source and available under the [MIT License](LICENSE).
