<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sprints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('duration_days'); // 3, 7, 30, etc.
            $table->boolean('is_private')->default(false);
            $table->string('invite_code')->unique()->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->enum('status', ['upcoming', 'active', 'completed', 'cancelled'])->default('upcoming');
            $table->text('ai_summary')->nullable();
            $table->integer('participants_count')->default(1);
            $table->integer('updates_count')->default(0);
            $table->timestamps();
            
            $table->index(['status', 'starts_at']);
            $table->index('is_private');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sprints');
    }
};
