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
        Schema::table('productive_units', function (Blueprint $table) {
            $table->string('phone')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('productive_units', function (Blueprint $table) {
            $table->string('phone')->nullable(false)->change(); // o elimina `nullable(false)` si antes ya era nullable
        });
    }
};
