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
        Schema::create('tbl_videos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('award_id');
            $table->unsignedBigInteger('sponsored_id')->nullable();
            $table->string('image')->nullable();
            $table->string('title')->nullable();
            $table->string('link')->nullable();
            $table->timestamps();

            // $table->foreign('award_id')->references('id')->on('tbl_awards')->onDelete('cascade');
            // $table->foreign('sponsored_id')->references('id')->on('tbl_sponsers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_videos');
    }
};