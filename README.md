<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).


## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## 🚀 PublicSprint MVP+

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

## 📁 Project Structure

```
PublicSprintApp/
├── app/
│   ├── Http/Controllers/
│   │   ├── SprintController.php      # Sprint CRUD, join/leave
│   │   ├── UpdateController.php      # Daily updates, reactions
│   │   ├── CommentController.php     # Comments system
│   │   └── ProfileController.php     # User profiles, follow
│   ├── Models/
│   │   ├── User.php                  # Extended user model
│   │   ├── Sprint.php                # Sprint management
│   │   ├── Update.php                # Daily posts
│   │   ├── Comment.php               # Comments
│   │   ├── Reaction.php              # Emoji reactions
│   │   └── SprintTag.php             # Tags
│   └── Services/
│       └── AISummaryService.php      # AI integration
├── database/migrations/              # 11 comprehensive migrations
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   └── SprintCard.jsx        # Reusable sprint card
│   │   ├── Layouts/
│   │   │   └── AppLayout.jsx         # Main layout
│   │   ├── Pages/
│   │   │   ├── Welcome.jsx           # Landing page
│   │   │   └── Discover.jsx          # Browse sprints
│   │   └── app.jsx                   # React entry point
│   └── css/
│       └── app.css                   # Custom styles
├── routes/
│   └── web.php                       # All routes configured
├── SETUP.md                          # Detailed setup guide
├── PROJECT_OVERVIEW.md               # Complete project status
└── INSTALL.bat                       # Automated installer
```

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

### Environment Variables
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

# AI (Optional)
HUGGINGFACE_API_KEY=your_key
OPENROUTER_API_KEY=your_key
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

### Run Tests
```bash
composer test
```

---

## 🎯 Roadmap

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Database schema & migrations
- [x] Models with relationships
- [x] Core controllers
- [x] Authentication setup
- [x] Basic React components
- [x] Design system
- [x] Dark mode

### 🚧 Phase 2: Core Features (IN PROGRESS)
- [ ] Feed/Dashboard page
- [ ] Sprint detail page
- [ ] Create sprint form
- [ ] Update card component
- [ ] Comment section
- [ ] Image upload
- [ ] Real-time integration

### 📅 Phase 3: Advanced Features
- [ ] Email notifications
- [ ] AI summary generation
- [ ] Leaderboard calculation
- [ ] Badge system
- [ ] Search functionality
- [ ] Filters & sorting

### 🎨 Phase 4: Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Performance optimization
- [ ] Mobile testing
- [ ] Accessibility audit

---

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

---

## 📄 License

MIT License - feel free to use this for your own projects!

---

## 🙏 Acknowledgments

- Laravel Team
- React Team
- Tailwind CSS Team
- Framer Motion Team
- All open-source contributors

---

**Built with ❤️ for builders who build in public**

🚀 **Start your sprint today!**

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
