<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketplace_states', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->unsignedInteger('schema_version')->default(1);
            $table->unsignedBigInteger('revision')->default(1);
            $table->json('data');
            $table->boolean('migrated_from_local_storage')->default(false);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketplace_states');
    }
};
