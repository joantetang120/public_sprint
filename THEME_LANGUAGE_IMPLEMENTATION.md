# Theme & Language Switching - Implementation Guide 🎨🌍

## Overview
Complete theme (Light/Dark/Auto) and language (English/French) switching functionality across the entire app.

---

## ✅ What's Been Implemented

### 1. **Theme Context** 🎨
**File**: `resources/js/Contexts/ThemeContext.jsx`

**Features**:
- Light, Dark, and Auto (system preference) modes
- Automatically detects system theme when set to Auto
- Applies theme to entire app via `dark` class on `<html>`
- Persists theme from user settings in database
- Real-time theme switching

**How it works**:
```javascript
// Wraps entire app
<ThemeProvider>
  <App />
</ThemeProvider>

// Use in any component
const { theme, setTheme } = useTheme();
```

---

### 2. **Language Context** 🌍
**File**: `resources/js/Contexts/LanguageContext.jsx`

**Features**:
- English and French translations
- Translation function with parameter support
- Persists language from user settings
- Real-time language switching

**How it works**:
```javascript
// Wraps entire app
<LanguageProvider>
  <App />
</LanguageProvider>

// Use in any component
const { t, language } = useLanguage();

// Translate text
<h1>{t('common.home')}</h1>

// With parameters
<p>{t('dashboard.welcome', { name: user.name })}</p>
```

---

### 3. **Translation Files** 📝

**English**: `resources/js/translations/en.json`
**French**: `resources/js/translations/fr.json`

**Sections**:
- `common` - Common words (Home, Save, Cancel, etc.)
- `nav` - Navigation items
- `dashboard` - Dashboard page
- `sprints` - Sprint pages
- `updates` - Update pages
- `settings` - Settings page (complete)
- `aiSummary` - AI Summary feature
- `profile` - Profile page
- `messages` - Success/error messages

---

### 4. **App Integration** 🔧
**File**: `resources/js/app.jsx`

Both providers wrap the entire app:
```javascript
<ThemeProvider>
  <LanguageProvider>
    <App {...props} />
  </LanguageProvider>
</ThemeProvider>
```

---

### 5. **Tailwind Dark Mode** 🌙
**File**: `tailwind.config.js`

Already configured:
```javascript
darkMode: 'class', // Uses .dark class on html element
```

**Dark mode classes**:
```jsx
// Light mode: bg-white text-gray-900
// Dark mode: dark:bg-gray-800 dark:text-white
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

---

### 6. **Settings Integration** ⚙️
**File**: `resources/js/Pages/Settings/Index.jsx`

- Uses `useLanguage()` hook for translations
- Reloads page after saving preferences to apply changes
- All text translated using `t()` function
- Dark mode classes added to all elements

---

## 🚀 Setup Instructions

### **1. Run Migration**
```bash
php artisan migrate
```

This adds the following columns to `users` table:
- `theme` (light/dark/auto)
- `language` (en/fr)

### **2. Test Theme Switching**
1. Go to Settings → Preferences
2. Select a theme (Light/Dark/Auto)
3. Click "Save Preferences"
4. Page reloads with new theme applied

### **3. Test Language Switching**
1. Go to Settings → Preferences
2. Select a language (English/Français)
3. Click "Save Preferences"
4. Page reloads with new language applied

---

## 📋 How to Add Translations to Components

### **Step 1: Import the hook**
```javascript
import { useLanguage } from '@/Contexts/LanguageContext';
```

### **Step 2: Get the translation function**
```javascript
export default function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('common.home')}</h1>
    </div>
  );
}
```

### **Step 3: Add translations to JSON files**
In `en.json` and `fr.json`:
```json
{
  "mySection": {
    "title": "My Title",
    "description": "My description with {param}"
  }
}
```

### **Step 4: Use with parameters**
```javascript
<p>{t('mySection.description', { param: 'value' })}</p>
```

---

## 🎨 How to Add Dark Mode to Components

### **Basic Pattern**
```jsx
// Light: white background, dark text
// Dark: dark background, light text
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

### **Common Patterns**

**Backgrounds**:
```jsx
bg-white dark:bg-gray-800
bg-gray-50 dark:bg-gray-900
bg-gray-100 dark:bg-gray-800
```

**Text**:
```jsx
text-gray-900 dark:text-white
text-gray-600 dark:text-gray-400
text-gray-700 dark:text-gray-300
```

**Borders**:
```jsx
border-gray-200 dark:border-gray-700
border-gray-300 dark:border-gray-600
```

**Inputs**:
```jsx
bg-white dark:bg-gray-700
text-gray-900 dark:text-white
border-gray-300 dark:border-gray-600
focus:ring-green-500 dark:focus:ring-green-400
```

**Buttons**:
```jsx
// Primary button (no dark mode needed - gradient works in both)
bg-gradient-to-r from-green-500 to-green-600 text-white

// Secondary button
bg-white dark:bg-gray-700
text-gray-700 dark:text-gray-300
border-gray-300 dark:border-gray-600
```

---

## 📁 Files Modified/Created

### **Created**:
1. `resources/js/Contexts/ThemeContext.jsx`
2. `resources/js/Contexts/LanguageContext.jsx`
3. `resources/js/translations/en.json`
4. `resources/js/translations/fr.json`
5. `database/migrations/2025_11_21_000001_add_settings_to_users_table.php`

### **Modified**:
1. `resources/js/app.jsx` - Added providers
2. `resources/js/Pages/Settings/Index.jsx` - Added translations and dark mode
3. `app/Http/Controllers/SettingsController.php` - Handles theme/language updates

---

## 🎯 Next Steps

### **1. Add Translations to All Pages**

**Priority Pages**:
- ✅ Settings (Done)
- ⏳ Dashboard
- ⏳ Sprint List/Detail
- ⏳ Profile
- ⏳ Notifications
- ⏳ Navigation

**Example for Dashboard**:
```javascript
// In Dashboard.jsx
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.greeting.morning')}, {user.name}!</p>
    </div>
  );
}
```

### **2. Add Dark Mode to All Components**

**Priority Components**:
- ✅ Settings (Done)
- ⏳ PublicSprintLayout (Navigation)
- ⏳ Dashboard
- ⏳ Sprint Cards
- ⏳ Update Cards
- ⏳ Modals
- ⏳ Forms

**Example**:
```jsx
// Before
<div className="bg-white border-gray-200 text-gray-900">

// After
<div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
```

### **3. Test Everything**

**Theme Testing**:
- [ ] Switch to Light → Check all pages
- [ ] Switch to Dark → Check all pages
- [ ] Switch to Auto → Check system preference detection
- [ ] Test on different devices

**Language Testing**:
- [ ] Switch to English → Check all pages
- [ ] Switch to French → Check all pages
- [ ] Test with parameters (e.g., user names)
- [ ] Check for missing translations

---

## 🔧 Troubleshooting

### **Theme not applying?**
1. Check if `dark` class is on `<html>` element
2. Verify Tailwind config has `darkMode: 'class'`
3. Clear browser cache
4. Check console for errors

### **Translations not showing?**
1. Check JSON file syntax (valid JSON)
2. Verify translation key exists
3. Check console for warnings
4. Make sure LanguageProvider wraps component

### **Changes not saving?**
1. Run migration: `php artisan migrate`
2. Check database columns exist
3. Verify form submission
4. Check Laravel logs

---

## 📊 Translation Coverage

### **Completed** ✅
- Settings page (100%)
- Common words
- Navigation items

### **To Do** ⏳
- Dashboard page
- Sprint pages
- Update pages
- Profile pages
- Notification pages
- AI Summary modal
- Forms and validation messages

---

## 🎉 Summary

You now have:

✅ **Theme Switching** - Light, Dark, Auto modes  
✅ **Language Switching** - English and French  
✅ **Context Providers** - Easy to use in any component  
✅ **Translation Files** - Organized and extensible  
✅ **Settings Integration** - Users can change preferences  
✅ **Dark Mode Ready** - Tailwind configured  
✅ **Database Support** - Preferences saved per user  

**Next**: Add translations and dark mode classes to all remaining pages! 🚀

---

## 💡 Pro Tips

1. **Always add dark mode classes when styling**
   ```jsx
   className="bg-white dark:bg-gray-800"
   ```

2. **Use translation keys consistently**
   ```javascript
   t('section.subsection.key')
   ```

3. **Test in both themes before committing**

4. **Keep translations short and clear**

5. **Use parameters for dynamic content**
   ```javascript
   t('welcome', { name: user.name })
   ```

---

## 🎊 You're Ready!

Run the migration and start testing:

```bash
php artisan migrate
```

Then go to `/settings` and try switching themes and languages! 🎨🌍
