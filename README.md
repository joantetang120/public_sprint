# 🚀 PublicSprint

<div align="center">

**Build in public, together.**

A modern social platform where creators join time-boxed sprints and share their progress daily. Built with Laravel 12, React 18, and cutting-edge UI/UX.

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)

[Live Demo](#) • [Documentation](#-quick-start) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Design](#-database-design)
- [Development](#-development)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 💡 About the Project

**PublicSprint** is a social accountability platform designed for creators, developers, and entrepreneurs who believe in building in public. Users can create time-boxed sprints (3, 7, or 30 days), post daily updates with images, and engage with a community of like-minded builders through reactions, comments, and follows.

### 🎯 Problem Statement

Many creators struggle with:
- **Accountability** - Staying consistent without external motivation
- **Visibility** - Sharing progress without overwhelming social media
- **Community** - Finding others working on similar goals
- **Momentum** - Maintaining motivation throughout long projects

### ✅ Solution

PublicSprint provides:
- **Structured Sprints** - Time-boxed challenges with clear start/end dates
- **Daily Updates** - Simple, focused progress sharing with multimedia support
- **Gamification** - Points, leaderboards, and badges to drive engagement
- **Real-time Interaction** - Live reactions and notifications via WebSockets
- **AI-Powered Insights** - Automated sprint summaries and progress analysis

---

## ✨ Key Features

### 🏃 Sprint Management
- **Create Sprints** - 3, 7, or 30-day challenges with custom goals
- **Public/Private Modes** - Build openly or with a private team
- **Join/Leave** - Flexible participation with real-time updates
- **Sprint Status** - Automatic tracking (upcoming, active, completed)
- **Tags & Categories** - Organize sprints by topic/industry

### 📝 Daily Updates
- **Rich Text Posts** - Markdown support for formatted content
- **Multi-Image Upload** - Up to 5 images per update via Cloudinary
- **Progress Tracking** - Visual timeline of daily achievements
- **Edit/Delete** - Full CRUD operations with soft deletes
- **Scheduled Posts** - Queue updates for future publishing

### 💬 Social Features
- **Reactions** - Quick engagement with ❤️ 🔥 👏 emoji reactions
- **Comments** - Threaded discussions on updates
- **Follow System** - Build your network of builders
- **User Profiles** - Customizable bios, avatars, and social links
- **Notifications** - Real-time alerts for interactions

### 🎮 Gamification
- **Points System** - Earn points for consistency and engagement
- **Leaderboards** - Daily, weekly, and all-time rankings
- **Badges** - Unlock achievements for milestones
- **Streak Tracking** - Maintain daily update streaks

### 🤖 AI Integration
- **Sprint Summaries** - Auto-generated recaps using HuggingFace/OpenRouter
- **Progress Analysis** - Insights on productivity patterns
- **Content Suggestions** - AI-powered update prompts

### 🎨 UI/UX Excellence
- **Dark/Light Themes** - System-aware theme switching
- **Glassmorphism** - Modern frosted glass effects
- **Framer Motion** - Smooth, professional animations
- **Responsive Design** - Mobile-first, works on all devices
- **Accessibility** - WCAG 2.1 AA compliant

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel** | 12.x | Modern PHP framework with Eloquent ORM |
| **PHP** | 8.2+ | Server-side language |
| **MySQL** | 8.0+ | Relational database |
| **Pusher** | 7.2 | Real-time WebSocket broadcasting |
| **Cloudinary** | 2.2 | Cloud-based image hosting & optimization |
| **Guzzle** | 7.8 | HTTP client for API integrations |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | Component-based UI library |
| **Inertia.js** | 2.0 | SPA framework without building an API |
| **Tailwind CSS** | 4.0 | Utility-first CSS framework |
| **Framer Motion** | 11.15 | Animation library |
| **Lucide React** | 0.468 | Modern icon library (1000+ icons) |
| **Headless UI** | 2.2 | Unstyled, accessible components |
| **React Markdown** | 9.0 | Markdown rendering |
| **Vite** | 7.0 | Fast build tool & dev server |

### DevOps & Tools
- **Composer** - PHP dependency management
- **NPM** - JavaScript package management
- **Laravel Breeze** - Authentication scaffolding
- **Laravel Pail** - Real-time log viewer
- **Concurrently** - Run multiple dev servers
- **Docker** - Containerization (optional)
- **Railway/Render** - Cloud deployment platforms

---

## 🏗️ Architecture

### Design Patterns
- **MVC Architecture** - Separation of concerns with Laravel
- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic isolation (e.g., `AISummaryService`)
- **Observer Pattern** - Event-driven notifications
- **Factory Pattern** - Database seeding & testing

### Key Architectural Decisions

#### 1. **Inertia.js over Traditional SPA**
- **Why**: Eliminates need for separate API layer
- **Benefit**: Faster development, automatic CSRF protection, shared routing
- **Trade-off**: Tighter coupling between frontend/backend

#### 2. **Pusher for Real-time Features**
- **Why**: Managed WebSocket service with Laravel integration
- **Benefit**: No server infrastructure for WebSockets
- **Alternative**: Laravel Reverb (self-hosted, considered for v2)

#### 3. **Cloudinary for Image Storage**
- **Why**: Automatic optimization, CDN, transformations
- **Benefit**: Reduced server load, faster image delivery
- **Alternative**: S3 + CloudFront (more control, higher complexity)

#### 4. **MySQL over PostgreSQL**
- **Why**: Simpler deployment, better Laravel ecosystem support
- **Trade-off**: Less advanced JSON features

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
# Check versions
php -v        # PHP 8.2 or higher
composer -V   # Composer 2.x
node -v       # Node.js 18 or higher
npm -v        # NPM 9 or higher
mysql --version  # MySQL 8.0 or higher
```

### Installation

#### Option 1: Automated Setup (Windows)

```bash
# Clone the repository
git clone https://github.com/yourusername/PublicSprint.git
cd PublicSprintApp

# Run automated installer
INSTALL.bat
```

#### Option 2: Manual Setup (All Platforms)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/PublicSprint.git
cd PublicSprintApp

# 2. Install PHP dependencies
composer install

# 3. Install Node dependencies
npm install

# 4. Create environment file
cp .env.example .env

# 5. Generate application key
php artisan key:generate

# 6. Create database
mysql -u root -p
CREATE DATABASE public_sprint CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 7. Configure .env file
# Update DB_DATABASE, DB_USERNAME, DB_PASSWORD
# Add Pusher, Cloudinary credentials (see Configuration section)

# 8. Run migrations
php artisan migrate

# 9. Install Laravel Breeze with React
php artisan breeze:install react --dark

# 10. Build frontend assets
npm run build

# 11. Start development server
composer dev
```

Visit **http://localhost:8000** in your browser.

### Configuration

#### Required Environment Variables

```env
# Application
APP_NAME=PublicSprint
APP_ENV=local
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=public_sprint
DB_USERNAME=root
DB_PASSWORD=your_password

# Pusher (Real-time features)
BROADCAST_CONNECTION=pusher
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=mt1

# Cloudinary (Image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Services (Optional)
HUGGINGFACE_API_KEY=your_key
OPENROUTER_API_KEY=your_key
```

#### Get API Keys

- **Pusher**: [pusher.com](https://pusher.com) - Free tier: 200k messages/day
- **Cloudinary**: [cloudinary.com](https://cloudinary.com) - Free tier: 25GB storage
- **HuggingFace**: [huggingface.co](https://huggingface.co) - Free API access
- **OpenRouter**: [openrouter.ai](https://openrouter.ai) - Pay-per-use pricing

---

## 📁 Project Structure

```
PublicSprintApp/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── SprintController.php       # Sprint CRUD, join/leave logic
│   │   │   ├── UpdateController.php       # Daily updates, reactions
│   │   │   ├── CommentController.php      # Comment system
│   │   │   ├── ProfileController.php      # User profiles, follow/unfollow
│   │   │   ├── NotificationController.php # Notification management
│   │   │   └── LeaderboardController.php  # Scoring & rankings
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php  # Shared Inertia data
│   │   └── Requests/
│   │       ├── StoreSprintRequest.php     # Sprint validation
│   │       └── StoreUpdateRequest.php     # Update validation
│   │
│   ├── Models/
│   │   ├── User.php                       # Extended with profile fields
│   │   ├── Sprint.php                     # Sprint model with relationships
│   │   ├── SprintParticipant.php          # Pivot with scores
│   │   ├── Update.php                     # Daily posts
│   │   ├── Reaction.php                   # Emoji reactions
│   │   ├── Comment.php                    # Comments with nesting
│   │   ├── Follow.php                     # Follow relationships
│   │   ├── Notification.php               # User notifications
│   │   └── SprintTag.php                  # Sprint categorization
│   │
│   ├── Services/
│   │   └── AISummaryService.php           # AI integration logic
│   │
│   └── Events/
│       ├── UpdatePosted.php               # Broadcast new updates
│       └── ReactionAdded.php              # Broadcast reactions
│
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_create_sprints_table.php
│   │   ├── 2024_01_02_create_sprint_participants_table.php
│   │   ├── 2024_01_03_create_updates_table.php
│   │   ├── 2024_01_04_create_reactions_table.php
│   │   ├── 2024_01_05_create_comments_table.php
│   │   ├── 2024_01_06_create_follows_table.php
│   │   ├── 2024_01_07_create_notifications_table.php
│   │   └── 2024_01_08_create_sprint_tags_table.php
│   │
│   ├── factories/
│   │   └── SprintFactory.php              # Test data generation
│   │
│   └── seeders/
│       └── DatabaseSeeder.php             # Sample data
│
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   ├── SprintCard.jsx             # Reusable sprint card
│   │   │   ├── UpdateCard.jsx             # Daily update display
│   │   │   ├── CommentSection.jsx         # Comment thread
│   │   │   ├── ReactionButton.jsx         # Emoji reactions
│   │   │   └── UserAvatar.jsx             # Profile pictures
│   │   │
│   │   ├── Layouts/
│   │   │   ├── AppLayout.jsx              # Main authenticated layout
│   │   │   └── GuestLayout.jsx            # Public pages layout
│   │   │
│   │   ├── Pages/
│   │   │   ├── Welcome.jsx                # Landing page
│   │   │   ├── Dashboard.jsx              # User feed
│   │   │   ├── Discover.jsx               # Browse sprints
│   │   │   ├── Sprint/
│   │   │   │   ├── Show.jsx               # Sprint detail page
│   │   │   │   └── Create.jsx             # Create sprint form
│   │   │   ├── Profile/
│   │   │   │   ├── Show.jsx               # User profile
│   │   │   │   └── Edit.jsx               # Profile settings
│   │   │   └── Auth/                      # Breeze auth pages
│   │   │
│   │   └── app.jsx                        # React entry point
│   │
│   └── css/
│       └── app.css                        # Custom Tailwind styles
│
├── routes/
│   ├── web.php                            # All application routes
│   ├── channels.php                       # Broadcast channels
│   └── console.php                        # Artisan commands
│
├── public/
│   └── build/                             # Compiled assets (Vite)
│
├── tests/
│   ├── Feature/                           # Integration tests
│   └── Unit/                              # Unit tests
│
├── .env.example                           # Environment template
├── composer.json                          # PHP dependencies
├── package.json                           # Node dependencies
├── vite.config.js                         # Vite configuration
├── tailwind.config.js                     # Tailwind configuration
├── INSTALL.bat                            # Windows installer
└── README.md                              # This file
```

---

## 🗄️ Database Design

### Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│    users    │───────│ sprint_participants│───────│   sprints   │
└─────────────┘       └──────────────────┘       └─────────────┘
      │                                                   │
      │                                                   │
      ├───────────────────┐                              │
      │                   │                              │
      ▼                   ▼                              ▼
┌─────────────┐     ┌─────────────┐              ┌─────────────┐
│   follows   │     │ notifications│              │   updates   │
└─────────────┘     └─────────────┘              └─────────────┘
                                                         │
                                                         │
                                          ┌──────────────┼──────────────┐
                                          │              │              │
                                          ▼              ▼              ▼
                                    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
                                    │  reactions  │ │  comments   │ │ sprint_tags │
                                    └─────────────┘ └─────────────┘ └─────────────┘
```

### Core Tables

#### **users**
Extended Laravel user model with profile fields.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Display name |
| email | string | Unique email |
| password | string | Hashed password |
| bio | text | User biography |
| avatar_url | string | Profile picture |
| github_url | string | GitHub profile link |
| twitter_url | string | Twitter profile link |
| website_url | string | Personal website |
| total_points | integer | Gamification score |
| created_at | timestamp | Account creation |

#### **sprints**
Time-boxed challenges with goals.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | Creator (foreign key) |
| title | string | Sprint name |
| description | text | Sprint goal |
| duration_days | integer | 3, 7, or 30 |
| start_date | date | Sprint start |
| end_date | date | Sprint end |
| is_public | boolean | Public/private |
| status | enum | upcoming/active/completed |
| participant_count | integer | Cached count |
| created_at | timestamp | Creation time |

#### **sprint_participants**
Many-to-many pivot with scores.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| sprint_id | bigint | Foreign key |
| user_id | bigint | Foreign key |
| joined_at | timestamp | Join time |
| points | integer | Participant score |
| updates_count | integer | Cached count |

#### **updates**
Daily progress posts.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| sprint_id | bigint | Foreign key |
| user_id | bigint | Foreign key |
| content | text | Post content (markdown) |
| images | json | Array of Cloudinary URLs |
| reaction_count | integer | Cached count |
| comment_count | integer | Cached count |
| created_at | timestamp | Post time |

#### **reactions**
Emoji reactions on updates.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| update_id | bigint | Foreign key |
| user_id | bigint | Foreign key |
| type | enum | heart/fire/clap |
| created_at | timestamp | Reaction time |

**Unique constraint**: (update_id, user_id, type) - One reaction type per user per update.

#### **comments**
Nested comments on updates.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| update_id | bigint | Foreign key |
| user_id | bigint | Foreign key |
| parent_id | bigint | For threading (nullable) |
| content | text | Comment text |
| created_at | timestamp | Comment time |

#### **follows**
Social connections between users.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| follower_id | bigint | User following |
| following_id | bigint | User being followed |
| created_at | timestamp | Follow time |

**Unique constraint**: (follower_id, following_id) - No duplicate follows.

#### **notifications**
In-app notification system.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | Recipient |
| type | string | Notification type |
| data | json | Notification payload |
| read_at | timestamp | Read status (nullable) |
| created_at | timestamp | Notification time |

#### **sprint_tags**
Categorization and discovery.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| sprint_id | bigint | Foreign key |
| tag | string | Tag name (e.g., "coding") |

---

## 💻 Development

### Development Workflow

```bash
# Start all dev servers (Laravel, Vite, Queue, Logs)
composer dev

# This runs:
# - php artisan serve (port 8000)
# - npm run dev (Vite HMR)
# - php artisan queue:listen (background jobs)
# - php artisan pail (real-time logs)
```

### Available Commands

```bash
# Backend
php artisan migrate              # Run migrations
php artisan migrate:fresh --seed # Reset DB with sample data
php artisan tinker               # Interactive REPL
php artisan route:list           # View all routes
php artisan queue:work           # Process jobs
php artisan test                 # Run PHPUnit tests

# Frontend
npm run dev                      # Start Vite dev server
npm run build                    # Build for production
npm run lint                     # Lint JavaScript

# Combined
composer dev                     # Start all dev servers
composer test                    # Run tests
composer setup                   # Fresh install
```

### Code Style

- **PHP**: Laravel Pint (PSR-12)
- **JavaScript**: ESLint + Prettier
- **CSS**: Tailwind conventions

```bash
# Format code
./vendor/bin/pint                # PHP
npm run format                   # JavaScript
```

### Testing

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=SprintTest

# With coverage
php artisan test --coverage
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate new `APP_KEY`
- [ ] Configure production database
- [ ] Set up Pusher production credentials
- [ ] Configure Cloudinary production account
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Run `npm run build`
- [ ] Set up queue worker (Supervisor)
- [ ] Configure SSL certificate
- [ ] Set up database backups
- [ ] Configure error monitoring (Sentry, Bugsnag)

### Deployment Platforms

#### Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

See `RAILWAY_SETUP.md` for detailed instructions.

#### Render

See `render.yaml` for configuration.

#### Docker

```bash
# Build image
docker-compose build

# Start containers
docker-compose up -d

# Run migrations
docker-compose exec app php artisan migrate
```

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Complete)
- [x] Database schema design (11 migrations)
- [x] Eloquent models with relationships
- [x] Authentication with Laravel Breeze
- [x] Core controllers (Sprint, Update, Comment, Profile)
- [x] React component library
- [x] Tailwind design system
- [x] Dark mode implementation

### ✅ Phase 2: Core Features (Complete)
- [x] Sprint CRUD operations
- [x] Daily update posting with images
- [x] Reaction system (❤️ 🔥 👏)
- [x] Comment threads
- [x] Follow/unfollow system
- [x] User profiles with social links
- [x] Real-time updates via Pusher
- [x] Cloudinary image uploads

### 🚧 Phase 3: Advanced Features (In Progress)
- [x] AI sprint summaries
- [x] Notification system
- [ ] Email notifications (queued)
- [ ] Leaderboard calculations
- [ ] Badge/achievement system
- [ ] Advanced search & filters
- [ ] Sprint templates
- [ ] Export sprint data (PDF/CSV)

### 📅 Phase 4: Polish & Optimization
- [ ] Performance optimization (query caching, eager loading)
- [ ] Loading states & skeleton screens
- [ ] Error boundary components
- [ ] Toast notification system
- [ ] Mobile app (React Native)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Internationalization (i18n)
- [ ] Analytics dashboard

### 🔮 Future Ideas
- [ ] Team sprints with roles
- [ ] Video updates
- [ ] Live streaming integration
- [ ] Sprint challenges/competitions
- [ ] Monetization (premium features)
- [ ] API for third-party integrations
- [ ] Browser extension
- [ ] Slack/Discord bot

---

## 🤝 Contributing

This is currently a personal portfolio project, but contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 PublicSprint

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **[Laravel](https://laravel.com)** - The PHP framework for web artisans
- **[React](https://react.dev)** - A JavaScript library for building user interfaces
- **[Inertia.js](https://inertiajs.com)** - The modern monolith
- **[Tailwind CSS](https://tailwindcss.com)** - Rapidly build modern websites
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animation library
- **[Pusher](https://pusher.com)** - Real-time communication platform
- **[Cloudinary](https://cloudinary.com)** - Image and video management

---

## 📧 Contact

**Project Maintainer**: Your Name

- GitHub: [@joantetang120](https://github.com/joantetang120)
- LinkedIn: [LinkIn](https://www.linkedin.com/in/jerry-joanito-365318324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app)
- Email: juenjerry120@gmail.com
- Portfolio: [Tetang Jerry](https://portfolio-eight-delta-48.vercel.app/)

---

<div align="center">



⭐ **Star this repo if you find it helpful!**

[Report Bug](https://github.com/joantetang120/public_sprint/issues) • [Request Feature](https://github.com/joantetang120/public_sprint/issues)

</div>
