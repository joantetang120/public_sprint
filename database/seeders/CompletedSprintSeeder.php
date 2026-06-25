<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Reaction;
use App\Models\Sprint;
use App\Models\Update;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CompletedSprintSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Find or fail the target user ──────────────────────────────
        $user = User::where('email', 'juanjerry120@gmail.com')->first();

        if (!$user) {
            $this->command->error('User juanjerry120@gmail.com not found. Please register first.');
            return;
        }

        // ── 2. Create 4 fake community members ───────────────────────────
        $community = collect([
            ['name' => 'Sofia Morales',   'email' => 'sofia.morales@example.com',   'avatar' => 'https://i.pravatar.cc/150?img=47'],
            ['name' => 'Lucas Petit',     'email' => 'lucas.petit@example.com',      'avatar' => 'https://i.pravatar.cc/150?img=12'],
            ['name' => 'Amara Diallo',    'email' => 'amara.diallo@example.com',     'avatar' => 'https://i.pravatar.cc/150?img=23'],
            ['name' => 'Tom Eriksen',     'email' => 'tom.eriksen@example.com',      'avatar' => 'https://i.pravatar.cc/150?img=68'],
        ])->map(fn ($data) => User::firstOrCreate(
            ['email' => $data['email']],
            [
                'ulid'               => (string) Str::ulid(),
                'name'               => $data['name'],
                'avatar'             => $data['avatar'],
                'password'           => Hash::make('password'),
                'email_verified_at'  => now(),
            ]
        ));

        // ── 3. Sprint dates (completed 3 days ago) ───────────────────────
        $startsAt = now()->subDays(10)->startOfDay();
        $endsAt   = now()->subDays(3)->endOfDay();

        // ── 4. Create the sprint ─────────────────────────────────────────
        $sprint = Sprint::create([
            'user_id'            => $user->id,
            'title'              => 'Ship my SaaS MVP in 7 days',
            'description'        => "Building the core features of my project in public — auth system, sprint creation flow, and the first version of the update feed. No excuses, daily check-ins every day.",
            'category'           => 'dev',
            'duration_days'      => 7,
            'is_private'         => false,
            'starts_at'          => $startsAt,
            'ends_at'            => $endsAt,
            'status'             => 'completed',
            'participants_count' => 5,
            'updates_count'      => 6,
        ]);

        // ── 5. Add sprint_participants for main user + community ──────────
        DB::table('sprint_participants')->insert([
            [
                'sprint_id'          => $sprint->id,
                'user_id'            => $user->id,
                'joined_at'          => $startsAt,
                'updates_posted'     => 6,
                'reactions_received' => 18,
                'comments_made'      => 3,
                'score'              => 142.0,
                'rank'               => 1,
                'badges'             => json_encode(['top_contributor', 'consistent_builder']),
                'ai_summary'         => null,
                'share_token'        => null,
                'created_at'         => $startsAt,
                'updated_at'         => $endsAt,
            ],
            [
                'sprint_id'          => $sprint->id,
                'user_id'            => $community[0]->id,
                'joined_at'          => $startsAt->copy()->addHours(2),
                'updates_posted'     => 5,
                'reactions_received' => 12,
                'comments_made'      => 8,
                'score'              => 98.0,
                'rank'               => 2,
                'badges'             => json_encode(['active_commenter']),
                'ai_summary'         => null,
                'share_token'        => null,
                'created_at'         => $startsAt,
                'updated_at'         => $endsAt,
            ],
            [
                'sprint_id'          => $sprint->id,
                'user_id'            => $community[1]->id,
                'joined_at'          => $startsAt->copy()->addHours(5),
                'updates_posted'     => 4,
                'reactions_received' => 9,
                'comments_made'      => 2,
                'score'              => 74.0,
                'rank'               => 3,
                'badges'             => json_encode([]),
                'ai_summary'         => null,
                'share_token'        => null,
                'created_at'         => $startsAt,
                'updated_at'         => $endsAt,
            ],
            [
                'sprint_id'          => $sprint->id,
                'user_id'            => $community[2]->id,
                'joined_at'          => $startsAt->copy()->addDay(),
                'updates_posted'     => 3,
                'reactions_received' => 6,
                'comments_made'      => 1,
                'score'              => 48.0,
                'rank'               => 4,
                'badges'             => json_encode([]),
                'ai_summary'         => null,
                'share_token'        => null,
                'created_at'         => $startsAt,
                'updated_at'         => $endsAt,
            ],
            [
                'sprint_id'          => $sprint->id,
                'user_id'            => $community[3]->id,
                'joined_at'          => $startsAt->copy()->addDays(2),
                'updates_posted'     => 2,
                'reactions_received' => 4,
                'comments_made'      => 1,
                'score'              => 28.0,
                'rank'               => 5,
                'badges'             => json_encode([]),
                'ai_summary'         => null,
                'share_token'        => null,
                'created_at'         => $startsAt,
                'updated_at'         => $endsAt,
            ],
        ]);

        // ── 6. Create updates (6 out of 7 days — day 4 skipped) ──────────
        $updatesData = [
            [
                'day'     => 1,
                'content' => "**Day 1 — Sprint kicked off!**\n\nAlright, starting the clock. The goal is to ship a working MVP of my SaaS in 7 days — auth, sprint creation, and a live update feed.\n\nToday I set up the project structure, installed Laravel 12 and React 18, wired up Inertia.js, and got the database schema drafted. 11 tables, UUID primary keys, pivot tables for participants.\n\nAlready ran into an issue with the Vite config and the @ alias for imports — lost 40 minutes on that. Fixed by adding `resolve.alias` manually.\n\n**Tomorrow:** Build the auth system (Breeze + Google OAuth).",
                'images'  => [
                    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80',
                    'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=900&q=80',
                ],
                'links'   => ['https://laravel.com/docs/12.x', 'https://inertiajs.com'],
            ],
            [
                'day'     => 2,
                'content' => "**Day 2 — Auth is alive**\n\nLaravel Breeze is in. Spent the morning customizing the auth pages to match the design system — no more default Bootstrap vibes.\n\nGot Google OAuth working via Laravel Socialite. The redirect loop took longer than expected (callback URL mismatch on the Google console side, not even a code issue).\n\nAlso built the user profile model — avatar, bio, location, social links, stats fields. Cloudinary is hooked up for image uploads.\n\n**Feeling:** Solid. Ahead of schedule by a few hours.",
                'images'  => [
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80',
                ],
                'links'   => ['https://socialiteproviders.com/Google/'],
            ],
            [
                'day'     => 3,
                'content' => '**Day 3 — Sprint creation flow**' . "\n\n" .
                    'Built the full sprint CRUD today. Create, edit, join, leave — all wired up. The form has a duration picker (3 / 7 / 14 / 21 / 30 days), public/private toggle, category selector, and tag support.' . "\n\n" .
                    'The trickiest part was auto-calculating status (`upcoming`, `active`, `completed`) based on `starts_at` and `ends_at`. Added a `calculateStatus()` method on the Sprint model and hook it in the `boot()` lifecycle.' . "\n\n" .
                    'Also set up the Discover page — trending sprints, filters by status, search. Pagination working.' . "\n\n" .
                    "```php\npublic function calculateStatus(): string\n{\n    \$now = now();\n    if (\$now->isBefore(\$this->starts_at)) return 'upcoming';\n    if (\$now->isAfter(\$this->ends_at)) return 'completed';\n    return 'active';\n}\n```",
                'images'  => [
                    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&q=80',
                    'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=900&q=80',
                ],
                'links'   => [],
            ],
            // Day 4 intentionally skipped (missed)
            [
                'day'     => 5,
                'content' => "**Day 5 — Back after missing yesterday**\n\nSkipped day 4 — completely ran out of steam mid-afternoon and decided to rest rather than push garbage code.\n\nToday was productive though. Built the full update flow: post a daily update with Markdown support, attach up to 5 images (Cloudinary), embed links. Edit and delete working.\n\nAlso built the reaction system — ❤️ 🔥 👏 — with toggle logic on the backend. Single DB call, no over-engineering.\n\nThe `reactions_count` is cached directly on the `updates` table to avoid N+1 on the feed.",
                'images'  => [
                    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=900&q=80',
                ],
                'links'   => ['https://cloudinary.com/documentation/php_integration'],
            ],
            [
                'day'     => 6,
                'content' => "**Day 6 — Comments, notifications, and a leaderboard**\n\nLong day. Got three systems done:\n\n1. **Comments** — nested, with parent/reply structure. Edit and delete for your own comments.\n2. **Notifications** — in-app notification center. You get notified when someone reacts to your update or leaves a comment.\n3. **Leaderboard** — scoring is based on updates posted (×10), reactions received (×2), comments made (×1). Rankings are updated via a BadgeService that also hands out badges.\n\nThe hardest bug today: eager-loading comments.replies.user with 3 levels of nesting was causing a `maximum call stack exceeded` on the frontend when serializing via Inertia. Fixed by limiting depth and using `withCount`.\n\n**Tomorrow is day 7 — the final push.**",
                'images'  => [
                    'https://images.unsplash.com/photo-1607798748738-b15c40d33d57?w=900&q=80',
                    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80',
                ],
                'links'   => [],
            ],
            [
                'day'     => 7,
                'content' => "**Day 7 — Sprint done. Ship it.**\n\nWrapped up the last pieces today:\n\n- ✅ AI sprint summary feature (template-based, no API cost)\n- ✅ Public share page — anyone can view your end-of-sprint report via `/share/{token}`\n- ✅ Twitter/LinkedIn share buttons with pre-filled content\n- ✅ Search (sprints + users)\n- ✅ Settings page (theme, language, notifications, privacy)\n- ✅ Full i18n (EN/FR)\n\nLooked back at my day 1 commit and it's night and day. The codebase is clean, the design is polished, and it actually works.\n\nWould I do a 7-day sprint again? 100%. The daily check-ins made me move faster than any 2-week sprint I've ever done.\n\n**Total:** 6/7 days posted, 18 reactions, ranked #1 on the leaderboard. Not bad.",
                'images'  => [
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80',
                ],
                'links'   => ['https://publicsprint.io'],
            ],
        ];

        $createdUpdates = collect();

        foreach ($updatesData as $data) {
            $update = Update::create([
                'sprint_id'       => $sprint->id,
                'user_id'         => $user->id,
                'day_number'      => $data['day'],
                'content'         => $data['content'],
                'images'          => $data['images'],
                'links'           => $data['links'],
                'is_draft'        => false,
                'reactions_count' => 0,
                'comments_count'  => 0,
                'created_at'      => $startsAt->copy()->addDays($data['day'] - 1)->setTime(18, rand(0, 59)),
                'updated_at'      => $startsAt->copy()->addDays($data['day'] - 1)->setTime(18, rand(0, 59)),
            ]);

            $createdUpdates->push($update);
        }

        // ── 7. Reactions from community users ────────────────────────────
        $reactionTypes = ['heart', 'fire', 'clap'];

        $reactionsToAdd = [
            // [update_index, user_index, type]
            [0, 0, 'fire'],  [0, 1, 'fire'],  [0, 2, 'heart'],
            [1, 0, 'heart'], [1, 3, 'clap'],
            [2, 0, 'fire'],  [2, 1, 'heart'], [2, 2, 'fire'], [2, 3, 'clap'],
            [3, 1, 'heart'], [3, 2, 'fire'],
            [4, 0, 'fire'],  [4, 1, 'clap'],  [4, 2, 'heart'], [4, 3, 'fire'],
            [5, 0, 'fire'],  [5, 1, 'fire'],  [5, 2, 'clap'],
        ];

        foreach ($reactionsToAdd as [$updateIdx, $userIdx, $type]) {
            Reaction::create([
                'update_id'  => $createdUpdates[$updateIdx]->id,
                'user_id'    => $community[$userIdx]->id,
                'type'       => $type,
                'created_at' => $createdUpdates[$updateIdx]->created_at->addMinutes(rand(5, 120)),
                'updated_at' => $createdUpdates[$updateIdx]->created_at->addMinutes(rand(5, 120)),
            ]);

            // Update cached count
            $createdUpdates[$updateIdx]->increment('reactions_count');
        }

        // ── 8. Comments from community users ─────────────────────────────
        $commentsData = [
            [
                'update'  => 0,
                'user'    => $community[0],
                'content' => "Solid start! The @ alias issue in Vite trips everyone up at least once 😅 Looking forward to following this one.",
            ],
            [
                'update'  => 0,
                'user'    => $community[1],
                'content' => "Love that you're doing this in public. Day 1 energy is strong, let's see if it holds 💪",
            ],
            [
                'update'  => 2,
                'user'    => $community[0],
                'content' => "That `calculateStatus()` pattern is clean. I was doing this with a cron job before, much better to derive it from dates directly.",
            ],
            [
                'update'  => 3,
                'user'    => $community[2],
                'content' => "Missing a day happens to everyone. The fact that you came back and wrote about it honestly is actually more useful than a fake streak.",
            ],
            [
                'update'  => 4,
                'user'    => $community[1],
                'content' => "That Inertia serialization bug sounds painful. We hit something similar — the fix was switching to lazy loading for deeply nested relations on routes that don't need the full depth.",
            ],
            [
                'update'  => 5,
                'user'    => $community[0],
                'content' => "This is a great wrap-up. 6/7 and #1 on the leaderboard — you won your own sprint 🏆",
            ],
            [
                'update'  => 5,
                'user'    => $community[3],
                'content' => "The public share page idea is genius for this kind of app. Sharing the link brings people back to the platform.",
            ],
        ];

        foreach ($commentsData as $data) {
            $update = $createdUpdates[$data['update']];
            Comment::create([
                'update_id'  => $update->id,
                'user_id'    => $data['user']->id,
                'content'    => $data['content'],
                'parent_id'  => null,
                'created_at' => $update->created_at->addMinutes(rand(10, 240)),
                'updated_at' => $update->created_at->addMinutes(rand(10, 240)),
            ]);
            $update->increment('comments_count');
        }

        // ── 9. One reply from the main user ──────────────────────────────
        $firstComment = Comment::where('update_id', $createdUpdates[0]->id)->first();
        if ($firstComment) {
            Comment::create([
                'update_id'  => $createdUpdates[0]->id,
                'user_id'    => $user->id,
                'parent_id'  => $firstComment->id,
                'content'    => "Haha yeah the Vite alias thing cost me way too long. Thanks for following along!",
                'created_at' => $firstComment->created_at->addMinutes(30),
                'updated_at' => $firstComment->created_at->addMinutes(30),
            ]);
            $createdUpdates[0]->increment('comments_count');
        }

        // ── 10. Update sprint updates_count ──────────────────────────────
        $sprint->update(['updates_count' => $createdUpdates->count()]);

        $this->command->info('');
        $this->command->info('✅  Completed sprint seeded successfully!');
        $this->command->info('   Sprint : "' . $sprint->title . '" (ID: ' . $sprint->id . ', ULID: ' . $sprint->ulid . ')');
        $this->command->info('   User   : ' . $user->name . ' <' . $user->email . '>');
        $this->command->info('   Updates: ' . $createdUpdates->count() . ' (days 1, 2, 3, 5, 6, 7 — day 4 missed)');
        $this->command->info('   Rank   : #1 with 142 pts — ready to test the AI summary feature!');
        $this->command->info('');
        $this->command->info('   → Go to: /sprints/' . $sprint->ulid);
    }
}
