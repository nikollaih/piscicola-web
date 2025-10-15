<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stats_readings', function (Blueprint $table) {
            $table->string('reading_type')->default('mqtt')->after('topic_time');
        });

        // Si quieres actualizar filas existentes explícitamente (no necesario si DB respeta default),
        // puedes descomentar la línea siguiente:
        // \DB::table('stats_readings')->whereNull('reading_type')->update(['reading_type' => 'mqtt']);
    }

    public function down(): void
    {
        Schema::table('stats_readings', function (Blueprint $table) {
            $table->dropColumn('reading_type');
        });
    }
};
