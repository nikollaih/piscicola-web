<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('biomasses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sowing_id')->constrained('sowings');
            $table->foreignId('step_id')->constrained('steps');
            $table->double('approximate_weight');
            $table->double('approximate_height');
            $table->string('quantity_of_fish');
            $table->dateTime('manual_created_at')->default(DB::raw('CURRENT_TIMESTAMP'));;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biomasses');
    }
};
