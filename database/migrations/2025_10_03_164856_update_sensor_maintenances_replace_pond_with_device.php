<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSensorMaintenancesReplacePondWithDevice extends Migration
{
    /**
     * Run the migrations.
     *
     * Eliminamos sensor_name y pond_id (si existen) y añadimos device_id.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sensor_maintenances', function (Blueprint $table) {
            // Intentar dropear constraint FK sobre pond_id si existe.
            if (Schema::hasColumn('sensor_maintenances', 'pond_id')) {
                try {
                    // Esto funciona si la FK fue creada con convención Laravel:
                    $table->dropForeign(['pond_id']);
                } catch (\Throwable $e) {
                    // Si falla (FK no existe o distinto nombre), ignoramos y seguimos.
                }
            }

            // Eliminar columnas antiguas si existen
            if (Schema::hasColumn('sensor_maintenances', 'sensor_name')) {
                $table->dropColumn('sensor_name');
            }

            if (Schema::hasColumn('sensor_maintenances', 'pond_id')) {
                // Si la columna existe y aún no fue dropeada por la FK, dropeamos la columna
                // Nota: dropColumn lanzará si intentas dropear varias columnas en MySQL anteriores
                // por eso lo hacemos por separado dentro del mismo closure.
                try {
                    $table->dropColumn('pond_id');
                } catch (\Throwable $e) {
                    // ignorar
                }
            }

            // Añadir device_id (nullable para permitir migración segura)
            if (! Schema::hasColumn('sensor_maintenances', 'device_id')) {
                $table->unsignedBigInteger('device_id')->nullable()->after('id');
                $table->index('device_id');

                try {
                    $table->foreign('device_id')
                        ->references('id')
                        ->on('devices')
                        ->onUpdate('cascade')
                        ->onDelete('cascade');
                } catch (\Throwable $e) {
                    // En algunos drivers o setups la creación de FK puede fallar aquí;
                    // si eso ocurre, igual dejamos la columna y la index, el FK lo puedes
                    // crear luego con otra migración.
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * Re-crear sensor_name y pond_id (sin datos originales), y eliminar device_id.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sensor_maintenances', function (Blueprint $table) {
            // Dropear FK device_id si existe (intentar y silenciar error si no existe)
            if (Schema::hasColumn('sensor_maintenances', 'device_id')) {
                try {
                    $table->dropForeign(['device_id']);
                } catch (\Throwable $e) {
                    // ignore
                }

                try {
                    $table->dropIndex(['device_id']);
                } catch (\Throwable $e) {
                    // ignore
                }

                try {
                    $table->dropColumn('device_id');
                } catch (\Throwable $e) {
                    // ignore
                }
            }

            // Re-crear pond_id y sensor_name (sin datos originales) si no existen
            if (! Schema::hasColumn('sensor_maintenances', 'pond_id')) {
                $table->unsignedBigInteger('pond_id')->nullable()->after('id');
                $table->index('pond_id');
                // No agrego FK automáticamente porque el nombre de la tabla/constraint puede variar.
            }

            if (! Schema::hasColumn('sensor_maintenances', 'sensor_name')) {
                $table->string('sensor_name')->nullable()->after('pond_id');
            }
        });
    }
}
