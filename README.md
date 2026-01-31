# Dribbble Manager

A comprehensive Dribbble portfolio management application built with Next.js 14, TypeScript, and Tailwind CSS. Access and manage all your Dribbble data from a beautiful, unified dashboard.

## Features

- **Dashboard Overview** - View all your portfolio stats at a glance
- **Shots Management** - Browse, search, and manage all your design shots
- **Projects** - Organize your work into projects
- **Buckets** - View and manage your saved collections
- **Likes** - Browse shots you've liked
- **Followers/Following** - Track your network
- **Profile** - View your complete Dribbble profile information
- **Settings** - Manage your account and preferences

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Dribbble OAuth
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Dribbble account
- A Dribbble application (for OAuth)

### 1. Create a Dribbble Application

1. Go to [Dribbble Developer Applications](https://dribbble.com/account/applications)
2. Click "Register a new application"
3. Fill in the details:
   - **Name**: Your app name
   - **Description**: Brief description
   - **Website URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/api/auth/callback/dribbble`
4. Save your Client ID and Client Secret

### 2. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd insta

# Install dependencies
npm install

# Copy environment example
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `.env` with your Dribbble credentials:

```env
# Dribbble OAuth Configuration
DRIBBBLE_CLIENT_ID=your_client_id_here
DRIBBBLE_CLIENT_SECRET=your_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth configuration
│   │   └── dribbble/            # Dribbble API routes
│   ├── auth/                    # Auth pages (signin, error)
│   ├── dashboard/               # Dashboard pages
│   │   ├── shots/
│   │   ├── projects/
│   │   ├── buckets/
│   │   ├── likes/
│   │   ├── followers/
│   │   ├── following/
│   │   ├── profile/
│   │   └── settings/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/                  # Layout components
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── providers/               # Context providers
│   │   └── AuthProvider.tsx
│   └── ui/                      # UI components
│       ├── StatCard.tsx
│       ├── ShotCard.tsx
│       ├── UserCard.tsx
│       ├── ProjectCard.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSpinner.tsx
│       └── Pagination.tsx
├── lib/
│   └── dribbble.ts              # Dribbble API client
└── types/
    └── dribbble.ts              # TypeScript types
```

## API Routes

The application uses Next.js API routes to proxy requests to the Dribbble API:

- `GET /api/dribbble/user` - Get authenticated user
- `GET /api/dribbble/shots` - Get user's shots
- `GET /api/dribbble/projects` - Get user's projects
- `GET /api/dribbble/buckets` - Get user's buckets
- `GET /api/dribbble/likes` - Get user's likes
- `GET /api/dribbble/followers` - Get user's followers
- `GET /api/dribbble/following` - Get users the user follows

## Dribbble API Scopes

The application requests the following OAuth scopes:

- `public` - Access public information
- `upload` - Upload shots (if Pro account)
- `comment` - Post comments
- `write` - Write access to user data

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXTAUTH_URL` to your production URL
5. Update the Dribbble app callback URL to `https://your-domain.com/api/auth/callback/dribbble`

### Other Platforms

Ensure you:
1. Set all required environment variables
2. Update `NEXTAUTH_URL` to your production URL
3. Update the Dribbble OAuth callback URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- [Dribbble API](https://developer.dribbble.com/) for the platform and API
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide Icons](https://lucide.dev/) for beautiful icons
