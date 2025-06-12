<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('supply_purchases', function (Blueprint $table) {
            $table->softDeletes(); // Esto crea la columna deleted_at
        });
    }

    public function down(): void
    {
        Schema::table('supply_purchases', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
