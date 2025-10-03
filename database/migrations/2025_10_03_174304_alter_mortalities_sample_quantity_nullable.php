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
        Schema::table('mortalities', function (Blueprint $table) {
            // Eliminamos y volvemos a crear sample_quantity como nullable
            $table->dropColumn('sample_quantity');
        });

        Schema::table('mortalities', function (Blueprint $table) {
            $table->double('sample_quantity')->nullable()->after('biomasse_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mortalities', function (Blueprint $table) {
            $table->dropColumn('sample_quantity');
        });

        Schema::table('mortalities', function (Blueprint $table) {
            $table->double('sample_quantity')->after('biomasse_id');
        });
    }
};
