# PublicSprint MVP+ Setup Guide

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Git

### Installation Steps

1. **Install PHP Dependencies**
```bash
composer install
```

2. **Install Node Dependencies**
```bash
npm install
```

3. **Create Database**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE public_sprint CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

4. **Run Migrations**
```bash
php artisan migrate
```

5. **Install Laravel Breeze with React**
```bash
php artisan breeze:install react --dark
```

6. **Build Assets**
```bash
npm run build
```

7. **Start Development Servers**
```bash
# Option 1: Use the built-in dev script (recommended)
composer dev

# Option 2: Run servers separately
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server
npm run dev

# Terminal 3: Queue worker
php artisan queue:work

# Terminal 4: Logs
php artisan pail
```

## 🔑 Environment Configuration

Your `.env` file is already configured with:
- **Database**: `public_sprint`
- **Pusher**: Real-time broadcasting
- **Cloudinary**: Image uploads
- **AI APIs**: HuggingFace/OpenRouter (add your keys)

### Add AI API Keys (Optional but Recommended)
```env
HUGGINGFACE_API_KEY=your_key_here
# OR
OPENROUTER_API_KEY=your_key_here
```

## 📦 What's Included

### Backend (Laravel 12)
- ✅ User authentication (Breeze)
- ✅ Sprint management
- ✅ Daily updates with images
- ✅ Comments & reactions
- ✅ Real-time notifications (Pusher)
- ✅ Follow system
- ✅ Leaderboards
- ✅ AI summaries
- ✅ Email notifications

### Frontend (React + Inertia)
- ✅ Modern UI with Tailwind CSS 4
- ✅ Framer Motion animations
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Infinite scroll
- ✅ Image uploads (Cloudinary)

### Database Schema
- `users` - User profiles with stats
- `sprints` - Sprint management
- `sprint_participants` - Participant tracking
- `updates` - Daily progress posts
- `reactions` - ❤️ 🔥 👏
- `comments` - Nested comments
- `follows` - Social connections
- `notifications` - In-app notifications
- `sprint_tags` - Sprint categorization

## 🎨 Design Features

- **Glassmorphism effects**
- **Smooth animations** (Framer Motion)
- **Gradient accents**
- **Micro-interactions**
- **Loading skeletons**
- **Toast notifications**
- **Modal dialogs**
- **Infinite scroll feeds**

## 🔥 Next Steps

After setup, you'll need to create controllers and React components. The database structure is ready!

### Create Your First Sprint
1. Register an account
2. Complete your profile
3. Click "Create Sprint"
4. Set duration (3, 7, or 30 days)
5. Start posting daily updates!

## 🐛 Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check `.env` database credentials
- Run `php artisan config:clear`

### Vite Build Issues
- Delete `node_modules` and run `npm install` again
- Clear cache: `npm run build -- --force`

### Pusher Not Working
- Verify Pusher credentials in `.env`
- Check `BROADCAST_CONNECTION=pusher`
- Run `php artisan config:clear`

### Cloudinary Upload Fails
- Verify Cloudinary credentials
- Check `FILESYSTEM_DISK=cloudinary`
- Test with: `php artisan tinker` then `Storage::disk('cloudinary')->put('test.txt', 'test')`

## 📚 Resources

- [Laravel 12 Docs](https://laravel.com/docs/12.x)
- [Inertia.js](https://inertiajs.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Ready to build in public? Let's sprint! 🏃‍♂️💨**
