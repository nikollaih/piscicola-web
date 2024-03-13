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
        Schema::create('sowing_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sowing_id')->constrained('sowings');
            $table->foreignId('expense_id')->constrained('expenses');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sowing_expenses');
    }
};
