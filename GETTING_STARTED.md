# 🎯 Getting Started with PublicSprint

## 🚀 Quick Installation (5 Minutes)

### Step 1: Install Dependencies
```bash
# Open terminal in project directory
composer install
npm install
```

### Step 2: Create Database
```bash
# Open MySQL
mysql -u root -p

# Create database
CREATE DATABASE public_sprint CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 3: Run Migrations
```bash
php artisan migrate
```

### Step 4: Install Breeze (Authentication)
```bash
php artisan breeze:install react --dark
```

### Step 5: Build & Start
```bash
# Build frontend
npm run build

# Start development server
composer dev
```

### Step 6: Visit Your App
Open: **http://localhost:8000**

---

## ✅ What You'll See

1. **Landing Page** - Beautiful welcome page with animations
2. **Discover Page** - Browse sprints (empty initially)
3. **Register/Login** - Create your account

---

## 🎨 What's Already Built

### Backend ✅
- Complete database schema (11 tables)
- All models with relationships
- Controllers for sprints, updates, comments, profiles
- AI summary service
- Routes configured
- Authentication ready

### Frontend ✅
- Modern landing page
- Discover page
- App layout with dark mode
- Sprint card component
- Glassmorphism design
- Framer Motion animations

### Still To Build 🚧
- Dashboard/Feed page
- Sprint detail page
- Create sprint form
- Update posting
- Comments section
- Profile pages
- Image uploads

---

## 📝 Your First Sprint

After installation:

1. **Register an Account**
   - Click "Get Started"
   - Fill in your details
   - Verify email (if configured)

2. **Complete Your Profile**
   - Add avatar
   - Write bio
   - Add location/website

3. **Create Your First Sprint**
   - Click "Create Sprint"
   - Choose duration (3, 7, or 30 days)
   - Add description
   - Select tags
   - Make it public or private

4. **Post Daily Updates**
   - Share your progress
   - Add screenshots
   - Get reactions and comments

---

## 🛠️ Development Workflow

### Running the App
```bash
# Start all services (recommended)
composer dev

# Or run separately:
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Vite
npm run dev

# Terminal 3: Queue
php artisan queue:work

# Terminal 4: Logs
php artisan pail
```

### Making Changes

**Backend Changes:**
1. Edit controllers in `app/Http/Controllers/`
2. Modify models in `app/Models/`
3. Create migrations: `php artisan make:migration`
4. Run migrations: `php artisan migrate`

**Frontend Changes:**
1. Edit pages in `resources/js/Pages/`
2. Create components in `resources/js/Components/`
3. Update styles in `resources/css/app.css`
4. Vite will auto-reload

---

## 🎨 Customizing the Design

### Colors
Edit `tailwind.config.js`:
```js
colors: {
    primary: {
        500: '#your-color',
        // ...
    }
}
```

### Animations
Edit `resources/css/app.css`:
```css
@keyframes yourAnimation {
    /* ... */
}
```

### Components
Create in `resources/js/Components/`:
```jsx
import { motion } from 'framer-motion';

export default function YourComponent() {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6"
        >
            {/* Your content */}
        </motion.div>
    );
}
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
# Verify .env credentials
php artisan config:clear
```

### Vite Build Fails
```bash
# Clear node_modules
rm -rf node_modules
npm install
npm run build
```

### Pusher Not Working
```bash
# Verify credentials in .env
# Clear config
php artisan config:clear
```

### Cloudinary Upload Fails
```bash
# Test connection
php artisan tinker
Storage::disk('cloudinary')->put('test.txt', 'test');
```

---

## 📚 Learn More

### Laravel Resources
- [Laravel Docs](https://laravel.com/docs/12.x)
- [Inertia.js Guide](https://inertiajs.com/)
- [Laravel Breeze](https://laravel.com/docs/12.x/starter-kits#breeze)

### Frontend Resources
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

### Design Inspiration
- [Dribbble](https://dribbble.com/)
- [Awwwards](https://www.awwwards.com/)
- [Mobbin](https://mobbin.com/)

---

## 🎯 Building Your First Feature

### Example: Create a New Page

1. **Create Page Component**
   ```jsx
   // resources/js/Pages/MyPage.jsx
   import AppLayout from '@/Layouts/AppLayout';
   import { Head } from '@inertiajs/react';
   
   export default function MyPage() {
       return (
           <AppLayout>
               <Head title="My Page" />
               <div className="glass-card p-8">
                   <h1 className="text-3xl font-bold gradient-text">
                       My New Page
                   </h1>
               </div>
           </AppLayout>
       );
   }
   ```

2. **Add Route**
   ```php
   // routes/web.php
   Route::get('/my-page', function () {
       return Inertia::render('MyPage');
   })->name('my-page');
   ```

3. **Add Navigation Link**
   ```jsx
   // resources/js/Layouts/AppLayout.jsx
   <Link href="/my-page">My Page</Link>
   ```

---

## 💡 Tips for Success

1. **Start Small** - Build one feature at a time
2. **Test Often** - Check your changes frequently
3. **Use Components** - Reuse code with components
4. **Follow Conventions** - Stick to Laravel/React patterns
5. **Read Docs** - When stuck, check documentation
6. **Ask for Help** - Community is friendly!

---

## 🎉 You're Ready!

You now have:
- ✅ A fully configured Laravel 12 + React app
- ✅ Beautiful, modern UI with animations
- ✅ Complete database schema
- ✅ Authentication system
- ✅ Real-time capabilities
- ✅ Image upload integration
- ✅ AI summary service

**Start building your features and make PublicSprint amazing!**

---

## 📞 Need Help?

- Check `SETUP.md` for detailed instructions
- Read `PROJECT_OVERVIEW.md` for complete status
- Review `README_PUBLICSPRINT.md` for features

---

**Happy Building! 🚀**
