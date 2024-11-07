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
        Schema::create('tbl_judges', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('award_id')->nullable();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->string('post')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', [0, 1])->comment('0: inactive, 1: active')->default(1);
            $table->enum('is_chairman', [0, 1])->comment('0: no , 1: yes')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_judges');
    }
};
