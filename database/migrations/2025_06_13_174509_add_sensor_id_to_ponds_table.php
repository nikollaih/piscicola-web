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
        Schema::table('ponds', function (Blueprint $table) {
            $table->string('sensor_id')->nullable()->after('id');
        });
    }

    public function down()
    {
        Schema::table('ponds', function (Blueprint $table) {
            $table->dropColumn('sensor_id');
        });
    }
};
