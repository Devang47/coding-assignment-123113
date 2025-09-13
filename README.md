# Career Counselor AI 🚀

A modern, AI-powered career counseling platform that provides personalized career guidance, resume feedback, interview preparation, and professional development advice.

## ✨ Features

- **🤖 AI Career Counselor**: Expert guidance powered by OpenAI GPT-4o-mini via Replicate API
- **💬 Interactive Chat Interface**: Real-time conversations with your personal career counselor
- **📝 Resume Review**: Get specific feedback on content, formatting, and ATS optimization
- **🎯 Interview Preparation**: Practice interviews and learn the STAR method
- **📈 Skill Development**: Personalized learning paths and certification recommendations
- **🔍 Career Exploration**: Discover careers aligned with your interests and values
- **🌙 Dark Mode Design**: Modern, minimalist UI with professional aesthetics
- **🔐 Secure Authentication**: GitHub OAuth integration with NextAuth.js
- **💾 Persistent Chat History**: Save and resume your career counseling sessions

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Turso LibSQL](https://turso.tech/) (SQLite-compatible)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/)
- **API Layer**: [tRPC](https://trpc.io/) for type-safe APIs
- **AI Integration**: [Replicate](https://replicate.com/) with OpenAI GPT-4o-mini
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Validation**: [Zod](https://zod.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- A [Turso](https://turso.tech/) account for the database
- A [GitHub OAuth App](https://github.com/settings/applications/new) for authentication
- A [Replicate](https://replicate.com/) account for AI functionality

### Installation

1. **Clone the repository**

   ```bash
   git clone ...
   cd career-counselor-ai
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure your `.env.local` file**

   ```env
   # NextAuth
   AUTH_SECRET="your-auth-secret-here"
   AUTH_GITHUB_ID="your-github-client-id"
   AUTH_GITHUB_SECRET="your-github-client-secret"

   # Turso Database
   DATABASE_URL="libsql://your-database-url.turso.io"
   DATABASE_AUTH_TOKEN="your-turso-auth-token"

   # AI Service
   REPLICATE_API_TOKEN="your-replicate-api-token"
   ```

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App with:
   - **Application name**: Career Counselor AI
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and Client Secret to your `.env.local`

### Replicate API Setup

1. Sign up at [Replicate](https://replicate.com/)
2. Go to [Account Settings](https://replicate.com/account/api-tokens)
3. Create a new API token
4. Copy the token to your `.env.local`

### Running the Application

```bash
# Development mode
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── chat/              # Chat interface pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── server/                # Server-side code
│   ├── api/               # tRPC routers
│   ├── auth/              # Authentication configuration
│   ├── ai/                # AI integration (Replicate)
│   └── db/                # Database schema and connection
├── trpc/                  # tRPC client configuration
└── styles/                # Global styles
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev                   # Start development server
pnpm build                 # Build for production
pnpm start                 # Start production server

# Database
pnpm db:generate           # Generate database migrations
pnpm db:push               # Push schema to database
pnpm db:studio             # Open Drizzle Studio

# Code Quality
pnpm lint                  # Run ESLint
pnpm lint:fix              # Fix ESLint errors
pnpm typecheck             # Run TypeScript checks
pnpm format:check          # Check code formatting
pnpm format:write          # Format code with Prettier
```

## 🎯 Key Features Explained

### AI Career Counselor

- **Expert System Prompt**: 15+ years of experience simulation
- **Industry Coverage**: Technology, Healthcare, Finance, Marketing, Education, and more
- **Comprehensive Guidance**: Career exploration, resume review, interview prep, skill development
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### Security Features

- **Input Validation**: Zod schemas for all user inputs
- **Rate Limiting**: Prevents spam and abuse
- **Content Sanitization**: Removes potentially harmful characters
- **Authentication Required**: Protected routes and API endpoints
- **Environment Validation**: Ensures all required configuration is present

### Database Design

- **Efficient Schema**: Optimized for chat storage and retrieval
- **User Isolation**: Each user's data is completely separate
- **Cascading Deletes**: Clean data removal when sessions are deleted
- **Indexed Queries**: Fast lookups for chat sessions and messages

## 🚦 Environment Variables

| Variable              | Description                | Required |
| --------------------- | -------------------------- | -------- |
| `AUTH_SECRET`         | NextAuth.js secret key     | ✅       |
| `AUTH_GITHUB_ID`      | GitHub OAuth Client ID     | ✅       |
| `AUTH_GITHUB_SECRET`  | GitHub OAuth Client Secret | ✅       |
| `DATABASE_URL`        | Turso database URL         | ✅       |
| `DATABASE_AUTH_TOKEN` | Turso authentication token | ✅       |
| `REPLICATE_API_TOKEN` | Replicate API token        | ✅       |

## 🔍 Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` and `DATABASE_AUTH_TOKEN` are correct
- Ensure your Turso token has the right permissions
- Check if your database exists: `turso db list`

### Authentication Problems

- Verify GitHub OAuth app configuration
- Check callback URL matches your domain
- Ensure `AUTH_SECRET` is set and secure

### AI Service Issues

- Verify your Replicate API token is valid
- Check your account has sufficient credits
- Monitor rate limits in the Replicate dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [T3 Stack](https://create.t3.gg/) for the excellent starter template
- [OpenAI](https://openai.com/) for the powerful GPT-4o-mini model
- [Replicate](https://replicate.com/) for the AI API infrastructure
- [Turso](https://turso.tech/) for the blazing-fast SQLite database
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful UI components

## 📞 Support

If you have any questions or need help, please:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search existing [GitHub Issues](../../issues)
3. Create a new issue if your problem isn't covered

---
