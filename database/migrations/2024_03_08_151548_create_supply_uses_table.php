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
        Schema::create('supply_uses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supply_id')->constrained('supplies');
            $table->foreignId('sowing_id')->constrained('sowings');
            $table->foreignId('biomasse_id')->constrained('biomasses');
            $table->double('quantity');
            $table->double('unit_cost');
            $table->dateTime('manual_created_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feeding');
    }
};
