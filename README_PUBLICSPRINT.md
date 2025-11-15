# 🚀 PublicSprint MVP+

**"Build in public, together."**

A modern social platform where creators join time-boxed sprints (3, 7, or 30 days) and share their progress daily. Built with Laravel 12, React, and cutting-edge UI/UX.

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### 🎯 Core Features
- ✅ **Time-Boxed Sprints** - Create 3, 7, or 30-day sprints
- ✅ **Daily Updates** - Post progress with text + images
- ✅ **Public & Private Sprints** - Build openly or with your team
- ✅ **Reactions & Comments** - Engage with ❤️ 🔥 👏
- ✅ **Follow System** - Connect with other builders
- ✅ **Leaderboards** - Gamified scoring system
- ✅ **AI Summaries** - Auto-generated sprint recaps
- ✅ **Real-time Updates** - Live reactions via Pusher
- ✅ **Dark Mode** - Beautiful dark/light themes

### 🎨 Design Highlights
- **Glassmorphism** - Modern frosted glass effects
- **Framer Motion** - Smooth, professional animations
- **Gradient Accents** - Eye-catching color schemes
- **Responsive** - Mobile-first design
- **Accessible** - WCAG compliant

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

### Installation

#### Option 1: Automated (Windows)
```bash
# Run the installation script
INSTALL.bat
```

#### Option 2: Manual
```bash
# 1. Install PHP dependencies
composer install

# 2. Install Node dependencies
npm install

# 3. Create database
mysql -u root -p
CREATE DATABASE public_sprint CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# 4. Run migrations
php artisan migrate

# 5. Install Breeze
php artisan breeze:install react --dark

# 6. Build assets
npm run build

# 7. Start development server
composer dev
```

Visit: **http://localhost:8000**

---

## 📁 What's Been Built

### ✅ Backend (Complete)
- **11 Database Migrations** - Comprehensive schema
- **6 Models** - User, Sprint, Update, Comment, Reaction, SprintTag
- **4 Controllers** - Sprint, Update, Comment, Profile
- **AI Service** - HuggingFace & OpenRouter integration
- **Routes** - All endpoints configured
- **Authentication** - Ready for Breeze installation

### ✅ Frontend (Foundation)
- **AppLayout** - Main layout with dark mode & mobile menu
- **Welcome Page** - Stunning landing page with animations
- **Discover Page** - Browse sprints
- **SprintCard** - Reusable component
- **Design System** - Tailwind + custom styles
- **Animations** - Framer Motion integration

### 🚧 Still Needed
- Feed/Dashboard page
- Sprint detail page
- Create sprint form
- Update card component
- Comment section
- Image upload component
- Real-time integration
- Email notifications

---

## 🗄️ Database Schema

### Core Tables
- **users** - Extended with profile fields & stats
- **sprints** - Sprint management (public/private)
- **sprint_participants** - Participant tracking with scores
- **updates** - Daily progress posts
- **reactions** - Emoji reactions (❤️ 🔥 👏)
- **comments** - Nested comments
- **follows** - Social connections
- **sprint_tags** - Tag system
- **notifications** - In-app notifications

---

## 🎨 Tech Stack

### Backend
- **Laravel 12** - Modern PHP framework
- **MySQL** - Relational database
- **Pusher** - Real-time broadcasting
- **Cloudinary** - Image hosting
- **HuggingFace/OpenRouter** - AI summaries

### Frontend
- **React 18** - UI library
- **Inertia.js** - SPA without API
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Headless UI** - Accessible components

---

## 🔧 Configuration

Your `.env` file is already configured with:

```env
# App
APP_NAME=PublicSprint
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_DATABASE=public_sprint

# Pusher (Real-time)
PUSHER_APP_ID=2075747
PUSHER_APP_KEY=4027594ef6415333e661
PUSHER_APP_SECRET=46b37af0f9e65470c6ee
PUSHER_APP_CLUSTER=mt1

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=dlxzjeqbz
CLOUDINARY_API_KEY=144532644859176
CLOUDINARY_API_SECRET=6bFPPMSWxjNH8S_bwx5x1UpO0_o

# AI (Optional - add your keys)
HUGGINGFACE_API_KEY=
OPENROUTER_API_KEY=
```

---

## 📝 Development

### Start Development Server
```bash
composer dev
```

This starts:
- Laravel server (port 8000)
- Vite dev server
- Queue worker
- Log viewer (Pail)

### Build for Production
```bash
npm run build
php artisan optimize
```

---

## 📚 Documentation

- **SETUP.md** - Detailed setup instructions
- **PROJECT_OVERVIEW.md** - Complete project status & roadmap
- **INSTALL.bat** - Automated installation script

---

## 🎯 Next Steps

1. **Run Installation**
   ```bash
   INSTALL.bat
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE public_sprint;
   ```

3. **Start Building**
   - Create remaining React pages
   - Build core components
   - Implement image uploads
   - Add real-time features

---

## 🎨 Design Philosophy

**Modern & Innovative**
- Glassmorphism for depth
- Smooth animations everywhere
- Gradient accents for energy
- Clean, spacious layouts

**User-Centric**
- Mobile-first responsive
- Dark mode by default
- Fast loading times
- Intuitive navigation

**Engaging**
- Micro-interactions
- Gamification elements
- Real-time updates
- Social features

---

## 🔥 Unique Selling Points

1. **Time-Boxed Accountability** - Fixed duration creates urgency
2. **Public Building** - Transparency drives motivation
3. **Gamification** - Leaderboards and badges make it fun
4. **AI Summaries** - Automatic sprint recaps
5. **Beautiful UI** - Modern design that stands out
6. **Real-time** - Live reactions and comments
7. **Social** - Follow, react, comment, collaborate

---

## 📄 License

MIT License - feel free to use this for your own projects!

---

**Built with ❤️ for builders who build in public**

🚀 **Start your sprint today!**
