<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sprint_participants', function (Blueprint $table) {
            if (!Schema::hasColumn('sprint_participants', 'ai_summary')) {
                $table->text('ai_summary')->nullable()->after('badges');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sprint_participants', function (Blueprint $table) {
            if (Schema::hasColumn('sprint_participants', 'ai_summary')) {
                $table->dropColumn('ai_summary');
            }
        });
    }
};
