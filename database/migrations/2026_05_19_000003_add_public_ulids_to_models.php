<?php

use App\Models\Sprint;
use App\Models\Update;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('ulid', 26)->nullable()->unique()->after('id');
        });

        Schema::table('sprints', function (Blueprint $table) {
            $table->string('ulid', 26)->nullable()->unique()->after('id');
        });

        Schema::table('updates', function (Blueprint $table) {
            $table->string('ulid', 26)->nullable()->unique()->after('id');
        });

        User::query()->whereNull('ulid')->each(function (User $user): void {
            $user->forceFill(['ulid' => (string) Str::ulid()])->saveQuietly();
        });

        Sprint::query()->whereNull('ulid')->each(function (Sprint $sprint): void {
            $sprint->forceFill(['ulid' => (string) Str::ulid()])->saveQuietly();
        });

        Update::query()->whereNull('ulid')->each(function (Update $update): void {
            $update->forceFill(['ulid' => (string) Str::ulid()])->saveQuietly();
        });
    }

    public function down(): void
    {
        Schema::table('updates', function (Blueprint $table) {
            $table->dropUnique(['ulid']);
            $table->dropColumn('ulid');
        });

        Schema::table('sprints', function (Blueprint $table) {
            $table->dropUnique(['ulid']);
            $table->dropColumn('ulid');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['ulid']);
            $table->dropColumn('ulid');
        });
    }
};
