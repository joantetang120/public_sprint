# 📝 Installation Steps - Follow in Order

## ⚠️ Current Issue
The `auth.php` file doesn't exist yet because Breeze hasn't been installed. Follow these steps:

---

## Step 1: Update Composer Dependencies
```bash
composer update
```
This will install:
- laravel/breeze
- pusher/pusher-php-server
- cloudinary-labs/cloudinary-laravel
- guzzlehttp/guzzle

**Wait for this to complete before proceeding.**

---

## Step 2: Install Laravel Breeze
```bash
php artisan breeze:install react --dark
```

This will:
- Create `routes/auth.php`
- Generate authentication pages
- Set up Inertia middleware
- Configure authentication

**Important:** When prompted, choose:
- Stack: **React**
- Dark mode: **Yes**
- TypeScript: **No** (optional)

---

## Step 3: Uncomment Auth Routes

After Breeze is installed, edit `routes/web.php` line 53:

**Change from:**
```php
// require __DIR__.'/auth.php';
```

**To:**
```php
require __DIR__.'/auth.php';
```

---

## Step 4: Install NPM Dependencies
```bash
npm install
```

This will install all React and frontend dependencies.

---

## Step 5: Create Database

Open MySQL:
```bash
mysql -u root -p
```

Create database:
```sql
CREATE DATABASE public_sprint CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## Step 6: Run Migrations
```bash
php artisan migrate:fresh
```

This will create all 11 tables.

---

## Step 7: Build Frontend Assets
```bash
npm run build
```

---

## Step 8: Start Development Server
```bash
composer dev
```

This starts:
- Laravel server (localhost:8000)
- Vite dev server
- Queue worker
- Log viewer

---

## Step 9: Visit Your App
Open: **http://localhost:8000**

You should see:
- ✅ Beautiful landing page
- ✅ Login/Register buttons
- ✅ Dark mode toggle
- ✅ Smooth animations

---

## 🎉 Success!

You can now:
1. Register an account
2. Browse the discover page
3. Start building remaining features

---

## 🐛 Troubleshooting

### If composer update fails:
```bash
composer clear-cache
composer update --no-cache
```

### If npm install fails:
```bash
rm -rf node_modules package-lock.json
npm install
```

### If migrations fail:
```bash
# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Clear config
php artisan config:clear

# Try again
php artisan migrate:fresh
```

### If Breeze installation fails:
```bash
# Clear everything
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Try again
php artisan breeze:install react --dark
```

---

## 📞 Next Steps After Installation

1. **Test Authentication**
   - Register a new account
   - Login/Logout
   - Check profile

2. **Explore Pages**
   - Landing page (/)
   - Discover page (/discover)

3. **Start Building**
   - Create Feed page
   - Build Sprint detail page
   - Add Create Sprint form

---

**Good luck! 🚀**
