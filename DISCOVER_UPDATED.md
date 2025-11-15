# 📅 Discover Page Updated - Now Shows Upcoming Sprints!

## ✅ **Issue Fixed**

**Problem:** Upcoming sprints were not showing on the Discover page.

**Solution:** Added "Starting Soon" section to display upcoming sprints!

---

## 🎨 **Discover Page Now Has 3 Sections**

### **1. 🔥 Trending Now**
- Most popular sprints (by participants + updates)
- Shows up to 6 sprints
- Orange gradient icon

### **2. ⚡ Active Sprints**
- Currently running sprints
- Shows up to 6 sprints
- Green gradient icon with pulsing dot
- "X live" badge

### **3. 📅 Starting Soon** ✅ NEW!
- Upcoming sprints that haven't started yet
- Shows up to 6 sprints
- Blue gradient icon
- "X upcoming" badge
- Ordered by start date (soonest first)

---

## 🔧 **What Changed**

### **1. SprintController.php**

**Before:**
```php
public function discover() {
    $trending = Sprint::trending()->take(6)->get();
    $active = Sprint::active()->take(6)->get();
    // ❌ No upcoming sprints
    
    return Inertia::render('PublicSprint/Discover', [
        'trending' => $trending,
        'active' => $active,
    ]);
}
```

**After:**
```php
public function discover() {
    $trending = Sprint::trending()->take(6)->get();
    $active = Sprint::active()->take(6)->get();
    
    // ✅ Added upcoming sprints
    $upcoming = Sprint::public()
        ->where('status', 'upcoming')
        ->orderBy('starts_at', 'asc')
        ->take(6)
        ->get();
    
    return Inertia::render('PublicSprint/Discover', [
        'trending' => $trending,
        'active' => $active,
        'upcoming' => $upcoming,  // ✅ NEW!
    ]);
}
```

### **2. Discover.jsx**

**Added:**
- ✅ `upcoming` prop to component
- ✅ Updated sprint count to include upcoming
- ✅ New "Starting Soon" section with blue theme
- ✅ Calendar icon
- ✅ Updated empty state condition

---

## 📊 **Sprint Display Logic**

### **Trending Sprints:**
- Status: Any (active, upcoming, completed)
- Sort: By participants_count + updates_count (DESC)
- Shows: Most popular sprints

### **Active Sprints:**
- Status: `active`
- Sort: By ends_at (ASC) - ending soonest first
- Shows: Currently running sprints

### **Upcoming Sprints:**
- Status: `upcoming`
- Sort: By starts_at (ASC) - starting soonest first
- Shows: Not started yet

---

## 🎯 **Your Sprint Will Now Show!**

When you create a sprint with:
- **Status: upcoming** (starts in the future)
- **Privacy: public**

It will appear in:
- ✅ **Discover page** → "Starting Soon" section
- ✅ **My Sprints page** → Your sprints list
- ✅ **Dashboard** → Active sprints count (when it starts)

---

## 🚀 **Test It**

1. **Create a sprint** with start date = tomorrow
2. **Go to /discover**
3. **Scroll down** to "📅 Starting Soon" section
4. **Your sprint should appear!** ✅

---

## 📅 **Sprint Lifecycle on Discover**

### **Phase 1: Upcoming** (Before start date)
- Shows in: "Starting Soon" section
- Badge: Blue "upcoming"
- Can: Join sprint, view details

### **Phase 2: Active** (Between start and end date)
- Shows in: "Active Sprints" section
- Badge: Green "active" with pulse
- Can: Join, post updates, participate

### **Phase 3: Completed** (After end date)
- Shows in: "Trending Now" (if popular)
- Badge: Gray "completed"
- Can: View updates, see results

---

## 🎨 **Visual Design**

### **Starting Soon Section:**
```
┌─────────────────────────────────────────┐
│  📅 Starting Soon                       │
│  Get ready to join these upcoming...    │
│                              [6 upcoming]│
├─────────────────────────────────────────┤
│  [Sprint Card] [Sprint Card] [Sprint]  │
│  [Sprint Card] [Sprint Card] [Sprint]  │
└─────────────────────────────────────────┘
```

**Colors:**
- Icon: Blue to Indigo gradient
- Badge: Blue background
- Matches PublicSprint design system

---

## ✅ **All Sections Working**

- ✅ **Trending Now** - Shows popular sprints
- ✅ **Active Sprints** - Shows running sprints
- ✅ **Starting Soon** - Shows upcoming sprints ✅ NEW!
- ✅ **Popular Tags** - Shows trending tags
- ✅ **Empty State** - Shows when no sprints exist

---

## 🎉 **Result**

**Your upcoming sprint will now appear on the Discover page!**

Refresh `/discover` and you should see:
- Sprint count updated
- "Starting Soon" section visible
- Your sprint card displayed

**All sprint statuses are now properly displayed!** 📅✨
