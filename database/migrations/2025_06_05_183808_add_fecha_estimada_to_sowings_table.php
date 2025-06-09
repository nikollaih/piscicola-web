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
        Schema::table('sowings', function (Blueprint $table) {
            $table->dateTime('fecha_estimada')->nullable()->after('manual_created_at');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sowings', function (Blueprint $table) {
            //
        });
    }
};
