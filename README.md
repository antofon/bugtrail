# BugTrail — Live Roleplay

BugTrail lets you roleplay a real support conversation (you = agent, AI = customer). Ask questions, the AI reveals facts gradually. Click Generate BugTrail to produce a clear, shareable repro doc (title, summary, environment markers, preconditions, steps, expected vs actual, impact, artifacts/evidence). If OpenAI is unavailable or your budget is exhausted, the app switches to an offline customer that's good enough to demo.

## Features

- **Live Roleplay Mode**: Interactive chat where you play the support agent and AI plays the customer
- **Gradual Fact Revelation**: AI customer reveals one new fact per turn following a realistic disclosure plan
- **Structured BugTrail Generation**: Convert conversations into professional bug reports
- **Offline Fallback**: Works even without OpenAI API access using built-in customer simulator
- **Local-First**: All data persists in localStorage, no external database required
- **Responsive Design**: Works on desktop and mobile devices

## Scenarios

Choose from 4 realistic support scenarios:
- **Reset link expires**: Password reset tokens becoming invalid
- **2FA SMS delay**: Two-factor authentication SMS delivery issues  
- **Double charge**: Billing system charging users multiple times
- **iOS Face ID crash**: Mobile app crashes during biometric authentication

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
4. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Pick a scenario** - Choose from the 4 available support scenarios
2. **Adjust persona** - Configure the customer's industry, tech savvy level, patience, tone arc, and timezone
3. **Start the conversation** - Ask the customer what's going on
4. **Ask follow-up questions** - The AI will reveal one new fact per turn
5. **Generate BugTrail** - Click the button to create a structured bug report
6. **Copy and share** - Export as Markdown or Jira format

## Offline Mode

The app automatically falls back to offline mode when:
- No OpenAI API key is provided
- OpenAI API requests fail (network issues, rate limits, etc.)
- API budget is exhausted

In offline mode, a rule-based customer simulator provides realistic responses based on the selected scenario.

## Technical Details

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4o-mini via REST API
- **State Management**: React state with localStorage persistence
- **API Routes**: Two serverless functions (`/api/roleplay`, `/api/extract`)

## Project Structure

```
├── src/app/                 # Next.js app router pages
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/             # React components
├── lib/                    # Utility functions and data
│   ├── types.ts           # TypeScript definitions
│   ├── scenarioBriefs.ts  # Scenario data
│   ├── prompts.ts         # OpenAI prompts
│   ├── offlineCustomer.ts # Offline simulator
│   ├── extractor.ts       # Heuristic bug report extraction
│   └── storage.ts         # localStorage utilities
└── README.md              # This file
```

## Testing Offline Mode

To test the offline customer simulator:

1. Temporarily remove or comment out `OPENAI_API_KEY` from `.env.local`
2. Restart the development server
3. The app will automatically use the offline customer simulator
4. You'll see a banner indicating "Running in offline customer mode"

## Contributing

This is a portfolio demo project. Feel free to fork and modify for your own use cases.

## License

MIT License - feel free to use this code for your own projects.