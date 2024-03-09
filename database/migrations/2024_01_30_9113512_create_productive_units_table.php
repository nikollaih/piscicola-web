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
        Schema::create('productive_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('association_id')->constrained('associations');
            $table->string('name');
            $table->string('email');
            $table->string('address')->nullable();
            $table->string('mobile_phone')->nullable();
            $table->string('phone');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productive_units');
    }
};
