# Code Tutorial Generator

<img src="codelet.png" alt="Codelet Logo" width="1500" height="1500"/>

An AI-powered platform that transforms uploaded codebases into comprehensive, interactive tutorials with intelligent chat assistance.

## Project Vision

This application enables developers to:

- **Upload any codebase** (via GitHub repository URL or direct file upload)
- **Generate comprehensive tutorials** automatically using AI analysis
- **Chat with AI** about the code to get explanations, suggestions, and answers
- **Learn interactively** through AI-generated step-by-step guides

## Key Features

### Code Upload

- GitHub repository integration with branch selection
- Direct file/folder upload support
- Automatic code parsing and analysis
- Smart file filtering (ignores node_modules, build artifacts, etc.)

### Tutorial Generation

- AI-powered comprehensive tutorial creation
- Covers architecture, design patterns, and best practices
- Step-by-step explanations of code functionality
- Code snippet highlights with context
- Beginner to advanced learning paths

### AI Chat Assistant

- Interactive Q&A about the uploaded codebase
- Context-aware responses based on actual code
- Code refactoring suggestions
- Debugging assistance
- Architecture and design pattern explanations

## Tech Stack

This project is built with the [T3 Stack](https://create.t3.gg/):

- **[Next.js](https://nextjs.org)** - React framework for production
- **[NextAuth.js](https://next-auth.js.org)** - Authentication solution
- **[Prisma](https://prisma.io)** - Next-generation ORM
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[tRPC](https://trpc.io)** - End-to-end typesafe APIs
- **[Google Gemini](https://deepmind.google/technologies/gemini/)** - AI for tutorial generation and chat
- **[Axios](https://axios-http.com/)** - HTTP client for GitHub API integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- GitHub Personal Access Token (for repository uploads)
- Google Gemini API Key (for AI features)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/omar-mostafa205/Codelet.git
cd Codelet
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# GitHub API
GITHUB_TOKEN="your-github-personal-access-token"

# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key"
```

4. Set up the database:

```bash
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## How It Works

1. **Upload Code**: Paste a GitHub repository URL or upload your project files
2. **AI Analysis**: The system processes and analyzes your codebase structure
3. **Tutorial Generation**: Gemini AI generates a comprehensive tutorial covering:
   - Project overview and architecture
   - Key components and their relationships
   - Code patterns and best practices
   - Setup and usage instructions
4. **Interactive Chat**: Ask questions and get instant AI-powered explanations about any part of the code

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── server/           # tRPC API routes
│   ├── utils/            # Utility functions
│   └── styles/           # Global styles
├── prisma/               # Database schema
└── public/               # Static assets
```

## Learn More

### T3 Stack Resources

- [T3 Stack Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available)
- [T3 Stack GitHub](https://github.com/t3-oss/create-t3-app)

### Technology Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

This application can be deployed on various platforms:

- **[Vercel](https://create.t3.gg/en/deployment/vercel)** (Recommended for Next.js)
- **[Netlify](https://create.t3.gg/en/deployment/netlify)**
- **[Docker](https://create.t3.gg/en/deployment/docker)**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your chosen license]

## Acknowledgments

- Built with [create-t3-app](https://create.t3.gg/)
- Powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Inspired by the need for better code learning tools
