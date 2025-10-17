<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('properties', function (Blueprint $table) {
        $table->string('status', 50)->change(); // ou la longueur nécessaire
    });
}

public function down()
{
    Schema::table('properties', function (Blueprint $table) {
        $table->string('status', 20)->change(); // Remettre la longueur d'origine si nécessaire
    });
}
};
