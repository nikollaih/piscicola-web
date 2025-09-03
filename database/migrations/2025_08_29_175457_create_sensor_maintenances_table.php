<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sensor_maintenances', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('pond_id');

            // Campos como texto
            $table->string('sensor_name', 150)->nullable();    // nombre / código del sensor (texto)
            $table->string('operator_name', 150)->nullable();  // operario (texto)

            $table->dateTime('maintenance_at');                // fecha y hora
            $table->text('observations')->nullable();          // observaciones

            // Soporte (imagen)
            $table->string('evidence_path')->nullable();       // path en storage

            $table->softDeletes();
            $table->timestamps();

            $table->foreign('pond_id')
                ->references('id')->on('ponds')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sensor_maintenances');
    }
};
