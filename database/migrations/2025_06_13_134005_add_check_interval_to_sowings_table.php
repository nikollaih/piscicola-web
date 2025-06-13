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
        Schema::table('sowings', function (Blueprint $table) {
            $table->integer('check_interval')->nullable()->after('fecha_estimada'); // puedes ajustar la posición con after
        });
    }

    public function down()
    {
        Schema::table('sowings', function (Blueprint $table) {
            $table->dropColumn('check_interval');
        });
    }
};
