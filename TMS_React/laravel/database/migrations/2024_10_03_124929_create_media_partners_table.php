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
        Schema::create('tbl_media_partners', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('image')->nullable();
            $table->unsignedBigInteger('award_id');
            $table->string('slug')->unique()->nullable();
            $table->longText('description')->nullable();
            $table->enum('status', ['0', '1'])->default('0')->comment('0: InActive, 1: Active');
            $table->timestamps();

            // $table->foreign('award_id')->references('id')->on('tbl_awards')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_media_partners');
    }
};