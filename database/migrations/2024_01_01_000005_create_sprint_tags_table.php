<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sprint_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->integer('usage_count')->default(0);
            $table->timestamps();
        });

        Schema::create('sprint_tag_pivot', function (Blueprint $table) {
            $table->foreignId('sprint_id')->constrained()->onDelete('cascade');
            $table->foreignId('sprint_tag_id')->constrained()->onDelete('cascade');
            $table->primary(['sprint_id', 'sprint_tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sprint_tag_pivot');
        Schema::dropIfExists('sprint_tags');
    }
};
