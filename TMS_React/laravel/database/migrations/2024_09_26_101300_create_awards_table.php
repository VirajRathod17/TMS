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
        Schema::create('tbl_awards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('year');
            $table->string('location');
            $table->string('award_date');
            $table->string('start_date');
            $table->string('end_date');
            $table->string('slug');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_awards');
    }
};
