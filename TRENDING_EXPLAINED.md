# 🔥 How Trending Sprints Work

## 📊 **Trending Definition**

A sprint is considered **"Trending"** based on this logic:

```php
public function scopeTrending($query)
{
    return $query->where('status', 'active')
        ->orderByDesc('participants_count')
        ->orderByDesc('updates_count');
}
```

---

## ✅ **Requirements to Be Trending**

### **1. Must Be Active** ⚡
- Sprint status = `active`
- Currently running (between start_at and ends_at)
- **NOT upcoming or completed**

### **2. Ranked By Engagement** 📈
Sorted by (in order):
1. **Participants Count** (DESC) - More participants = Higher rank
2. **Updates Count** (DESC) - More updates = Higher rank

---

## 🎯 **Trending Algorithm**

### **Primary Sort: Participants**
```
Sprint A: 50 participants, 100 updates  → Rank #1
Sprint B: 40 participants, 200 updates  → Rank #2
Sprint C: 30 participants, 300 updates  → Rank #3
```
**More participants = Higher priority!**

### **Secondary Sort: Updates**
If participants are equal:
```
Sprint A: 20 participants, 100 updates  → Rank #1
Sprint B: 20 participants, 80 updates   → Rank #2
Sprint C: 20 participants, 50 updates   → Rank #3
```
**More updates = Tiebreaker!**

---

## 📈 **How to Make Your Sprint Trending**

### **1. Get More Participants** 👥
- Share your sprint link
- Make it public
- Use popular tags
- Post engaging updates
- Invite friends/community

### **2. Post Regular Updates** 📝
- Daily updates boost ranking
- Encourage participants to post
- More activity = More visibility

### **3. Keep It Active** ⚡
- Sprint must be currently running
- Upcoming sprints won't show in trending
- Completed sprints won't show in trending

---

## 🔍 **Trending vs Active vs Upcoming**

### **🔥 Trending Section**
- **Filter:** Status = `active` only
- **Sort:** By participants + updates
- **Shows:** Top 6 most popular active sprints
- **Purpose:** Highlight hot sprints with most engagement

### **⚡ Active Section**
- **Filter:** Status = `active` only
- **Sort:** By ends_at (ending soonest first)
- **Shows:** Up to 6 active sprints
- **Purpose:** Show all currently running sprints

### **📅 Upcoming Section**
- **Filter:** Status = `upcoming` only
- **Sort:** By starts_at (starting soonest first)
- **Shows:** Up to 6 upcoming sprints
- **Purpose:** Show sprints starting soon

---

## 💡 **Important Notes**

### **Trending ≠ Active**
- **Trending:** Active sprints ranked by popularity
- **Active:** All active sprints by end date

### **Same Sprint Can Appear Twice**
A sprint can show in BOTH:
- ✅ Trending section (if popular)
- ✅ Active section (if currently running)

This is intentional! Popular sprints get more visibility.

---

## 🎯 **Example Scenarios**

### **Scenario 1: New Sprint**
```
Status: active
Participants: 1 (just you)
Updates: 0

Result: Shows in "Active" but NOT in "Trending"
Why: Not enough engagement yet
```

### **Scenario 2: Popular Sprint**
```
Status: active
Participants: 25
Updates: 50

Result: Shows in BOTH "Trending" AND "Active"
Why: High engagement + currently running
```

### **Scenario 3: Upcoming Sprint**
```
Status: upcoming
Participants: 10
Updates: 0

Result: Shows in "Starting Soon" only
Why: Not active yet, can't be trending
```

### **Scenario 4: Completed Sprint**
```
Status: completed
Participants: 100
Updates: 500

Result: Shows NOWHERE on discover
Why: Not active anymore
```

---

## 🔧 **Current Implementation**

### **In SprintController@discover:**
```php
// Trending: Top 6 active sprints by engagement
$trending = Sprint::public()
    ->trending()  // Active + sorted by participants/updates
    ->take(6)
    ->get();

// Active: Up to 6 active sprints by end date
$active = Sprint::public()
    ->active()  // Status = active
    ->orderBy('ends_at', 'asc')
    ->take(6)
    ->get();

// Upcoming: Up to 6 upcoming sprints by start date
$upcoming = Sprint::public()
    ->where('status', 'upcoming')
    ->orderBy('starts_at', 'asc')
    ->take(6)
    ->get();
```

---

## 🚀 **How to Improve Trending Algorithm**

### **Current (Simple):**
```php
->orderByDesc('participants_count')
->orderByDesc('updates_count')
```

### **Potential Improvements:**

#### **1. Weighted Score**
```php
// Give more weight to recent activity
->orderByRaw('(participants_count * 2) + updates_count DESC')
```

#### **2. Time-Based Decay**
```php
// Favor newer sprints
->orderByRaw('(participants_count + updates_count) / DATEDIFF(NOW(), starts_at) DESC')
```

#### **3. Engagement Rate**
```php
// Consider updates per participant
->orderByRaw('updates_count / GREATEST(participants_count, 1) DESC')
```

#### **4. Reactions & Comments**
```php
// Include all engagement metrics
->withCount(['updates', 'participants'])
->orderByRaw('(participants_count * 3) + (updates_count * 2) + reactions_count DESC')
```

---

## ✅ **Summary**

**A sprint is trending when:**
1. ✅ Status = `active` (currently running)
2. ✅ Has high participant count
3. ✅ Has high update count
4. ✅ Ranks in top 6 by these metrics

**To make your sprint trending:**
- 🎯 Get more people to join
- 📝 Post regular updates
- 💬 Encourage participant engagement
- 🔥 Keep the momentum going!

**Your sprint will automatically appear in trending once it becomes active and gains traction!** 🚀
