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
        // Ajouter les champs pour les informations du client
        $table->string('client_name')->nullable()->after('status');
        $table->string('client_phone')->nullable()->after('client_name');
        
        // Champ pour la demande de réactivation
        $table->boolean('reactivation_requested')->default(false)->after('client_phone');
        $table->text('reactivation_reason')->nullable()->after('reactivation_requested');
        
        // Soft deletes
        $table->softDeletes();
    });
}

public function down()
{
    Schema::table('properties', function (Blueprint $table) {
        $table->dropColumn([
            'client_name',
            'client_phone',
            'reactivation_requested',
            'reactivation_reason',
            'deleted_at'
        ]);
    });
}
};
