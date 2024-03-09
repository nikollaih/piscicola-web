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
        Schema::create('step_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('step_id')->constrained('steps');
            $table->string('name');
            $table->string('key');
            $table->float('value_minimun');
            $table->float('value_maximun');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('step_stats');
    }
};
