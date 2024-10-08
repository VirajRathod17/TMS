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
        Schema::create('tbl_sponsers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('award_id');
            $table->string('slug')->unique()->nullable();
            $table->string('name')->nullable();
            $table->longText('description')->nullable();
            $table->string('website_link')->nullable();
            $table->enum('is_main_sponsor', ['0', '1'])->default('0')->comment('0: not a main sponsor, 1: main sponsor');
            $table->string('image')->nullable();
            $table->string('company_name')->nullable();
            $table->longText('Intrest')->comment('0: Sponsoring an award category, 1: Other Sponsorship opportunities');
            $table->string('email')->nullable();
            $table->string('contact_number')->nullable();
            $table->enum('status', [0, 1])->default(1)->comment('0 = Inactive, 1 = Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_sponsers');
    }
};
