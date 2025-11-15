<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sprint_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('day_number'); // Day X of Y
            $table->text('content');
            $table->string('image')->nullable();
            $table->boolean('is_draft')->default(false);
            $table->integer('reactions_count')->default(0);
            $table->integer('comments_count')->default(0);
            $table->timestamps();
            
            $table->index(['sprint_id', 'user_id', 'day_number']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('updates');
    }
};
