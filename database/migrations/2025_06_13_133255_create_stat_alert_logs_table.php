<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('stat_alert_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('stats_reading_id');
            $table->longText('stat_data');       // serializado
            $table->longText('emails');          // serializado
            $table->unsignedInteger('counter')->default(1);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stat_alert_logs');
    }
};
