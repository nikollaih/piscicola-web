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
        Schema::create('actuators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pond_id')->constrained('ponds');
            $table->foreignId('actuator_type_id')->constrained('actuator_types');
            $table->string('name');
            $table->text('description')->nullable();
            $table->double('cost_by_minute');
            $table->boolean('is_turned_on')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actuators');
    }
};
