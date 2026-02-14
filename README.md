# CoverCraft

CoverCraft is a premium SaaS-style web application that generates strong, human-sounding cover letters from a Job Description and Resume using Google's Gemini AI.

## Features

- **Human-sounding Generation**: Uses Gemini 2.0 Flash to create natural, non-robotic text.
- **ATS Optimized**: Integrates keywords from the JD and Resume.
- **DOCX Export**: Download your cover letter as a perfectly formatted Word document.
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, Google Generative AI SDK, docx, Zod.

## Prerequisites

- Node.js (v18+)
- Google Gemini API Key

## Setup

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd cover-craft
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Add your GEMINI_API_KEY to .env
    npm start
    ```
    The server runs on `http://localhost:3000`.

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The app runs on `http://localhost:5173`.

## Deployment

### Frontend (Vercel/Netlify)
1.  Build the frontend: `npm run build`
2.  Deploy the `dist` folder.
3.  Set environment variables if needed (though API URL is currently hardcoded to localhost, update it in `AppPage.tsx` for production).

### Backend (Render/Fly.io)
1.  Deploy the `backend` folder.
2.  Set `GEMINI_API_KEY` environment variable.
3.  Update the CORS origin in `server.ts` to match your frontend domain.

## License

MIT
