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
        Schema::create('auditor_mqtt_connections', function (Blueprint $table) {
            $table->id();
            $table->dateTime('register_time')->nullable();
            $table->tinyInteger('status')->nullable();
            $table->text('failed')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditor_mqtt_connections');
    }
};
