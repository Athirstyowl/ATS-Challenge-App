# ATS Challenge App

A modern Applicant Tracking System (ATS) that helps recruiters efficiently process and evaluate candidate resumes using AI. The application demonstrates a transparent agent loop that shows how the ATS thinks through candidate filtering and ranking.

## 🌟 Features

- **AI-Powered Search**: Natural language processing to understand recruiter queries
- **Transparent Decision Making**: Watch the ATS think through its filtering and ranking process
- **Real-time Processing**: Immediate feedback and results
- **Smart Filtering**: Filter candidates based on multiple criteria
- **Intelligent Ranking**: Rank candidates by experience and other factors
- **Modern UI**: Built with Next.js and TailwindCSS
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Frontend**:
  - Next.js 15
  - React 19
  - TypeScript
  - TailwindCSS
  - Framer Motion (for animations)
  - React Spinners

- **Backend**:
  - Next.js API Routes
  - Google Gemini AI API
  - CSV Processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Athirstyowl/ATS-Challenge-App.git
   cd ATS-Challenge-App
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   VERCEL_URL=your_vercel_deployment_url
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ats-challenge/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── public/                # Static assets
└── tests/                # Test files
```

## 🔄 How It Works

1. **User Input**: Recruiters enter natural language queries
2. **AI Processing**: 
   - The query is processed by Gemini AI
   - Generates filter and rank plans
3. **Candidate Processing**:
   - Filters candidates based on the plan
   - Ranks candidates according to criteria
4. **Results Display**:
   - Shows filtered and ranked candidates
   - Provides a summary of results

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

## 🚢 Deployment

The application is deployed on Vercel. To deploy your own version:

1. Fork the repository
2. Connect to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `VERCEL_URL` | Vercel deployment URL | Yes (in production) |


## 🙏 Acknowledgments

- Google Gemini AI for the AI capabilities
- Next.js team for the amazing framework
- Vercel for hosting and deployment
