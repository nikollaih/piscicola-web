<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDevicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();

            // FK al modelo ProductiveUnit (tabla productive_units).
            $table->foreignId('id_unidad_productiva')->constrained('productive_units');
            $table->string('name');
            $table->text('category')->nullable(); // texto opcional
            $table->integer('maintenance_period'); // número de días entre mantenimientos
            $table->integer('pond_id')->nullable(); // no obligatorio, número
            $table->text('description')->nullable(); // notas opcional

            $table->timestamps(); // created_at, updated_at
            $table->softDeletes(); // deleted_at para soft delete

            // índices y constraint FK
            $table->index('id_unidad_productiva');
            $table->index('pond_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('devices', function (Blueprint $table) {
            // eliminar FK antes de dropear tabla (seguro)
            $table->dropForeign(['id_unidad_productiva']);
        });

        Schema::dropIfExists('devices');
    }
}
