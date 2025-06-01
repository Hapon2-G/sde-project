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
        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
    $table->unsignedBigInteger('user_id')->nullable(); // optional if you link to logged in user
    $table->string('shop_name');
    $table->string('email')->unique();
    $table->string('id_type');
    $table->string('id_number');
    $table->string('house_and_ward');
    $table->string('district_and_province');
    $table->string('photo_id');
    $table->string('phone_number');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sellers');
    }
};
