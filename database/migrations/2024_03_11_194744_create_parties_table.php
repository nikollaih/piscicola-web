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
        Schema::create('parties', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('document');
            $table->foreignId('productive_unit_id')->constrained('productive_units');
            $table->foreignId('party_role_id')->constrained('parties_rol');
            $table->string('name');
            $table->string('mobile_phone')->nullable();
            $table->string('home_phone')->nullable();
            $table->string('office_phone')->nullable();
            $table->string('email');
            $table->longText('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parties');
    }
};
