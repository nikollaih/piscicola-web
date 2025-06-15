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
        Schema::create('reconnections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('productive_unit_id')->constrained()->onDelete('cascade');
            $table->dateTime('last_connection_date');
            $table->dateTime('reconnection_date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reconnections');
    }
};
