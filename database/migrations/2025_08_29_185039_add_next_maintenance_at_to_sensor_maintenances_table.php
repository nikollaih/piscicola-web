<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('sensor_maintenances', function (Blueprint $table) {
            $table->dateTime('next_maintenance_at')->nullable()->after('maintenance_at');
        });
    }

    public function down(): void
    {
        Schema::table('sensor_maintenances', function (Blueprint $table) {
            $table->dropColumn('next_maintenance_at');
        });
    }
};
