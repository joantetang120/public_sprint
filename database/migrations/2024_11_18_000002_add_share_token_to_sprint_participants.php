<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sprint_participants', function (Blueprint $table) {
            $table->string('share_token', 24)->nullable()->unique()->after('ai_summary');
        });
    }

    public function down(): void
    {
        Schema::table('sprint_participants', function (Blueprint $table) {
            $table->dropColumn('share_token');
        });
    }
};
