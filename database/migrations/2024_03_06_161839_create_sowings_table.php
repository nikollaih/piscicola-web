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
        Schema::create('sowings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('productive_unit_id')->constrained('productive_units');
            $table->foreignId('fish_id')->constrained('fish');
            $table->foreignId('step_id')->constrained('steps');
            $table->foreignId('pond_id')->constrained('ponds');
            $table->string('name');
            $table->integer('quantity');
            $table->dateTime('sale_date')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sowings');
    }
};
