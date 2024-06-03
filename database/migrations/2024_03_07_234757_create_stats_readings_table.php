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
        Schema::create('stats_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sowing_id')->constrained('sowings');
            $table->foreignId('step_id')->constrained('steps');
            $table->foreignId('step_stat_id')->constrained('step_stats');
            $table->foreignId('biomasse_id')->constrained('biomasses');
            //se agrega el value como un flotante de precision 2 ejm  222222222222222.22
            $table->double('value',20,2);
            $table->boolean('triggered_alarm');
            $table->dateTime('topic_time')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stats_readings');
    }
};
