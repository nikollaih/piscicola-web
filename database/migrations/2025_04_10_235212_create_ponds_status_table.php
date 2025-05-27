<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ponds_status', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pond_id')->constrained('ponds')->onDelete('cascade');
            $table->boolean('status');
            $table->dateTime('event_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ponds_status');
    }
};
