<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_award_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('award_id');
            $table->string('slug')->unique()->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('credentials')->nullable();
            $table->unsignedBigInteger('main_sponsored_id')->nullable();
            $table->enum('status', [0, 1])->comment('0: inactive, 1: active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('award_categories');
    }
};
