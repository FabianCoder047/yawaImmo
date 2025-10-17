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
        Schema::table('properties', function (Blueprint $table) {
            $table->boolean('reactivation_requested')->default(false)->after('is_available');
            $table->text('reactivation_reason')->nullable()->after('reactivation_requested');
            $table->timestamp('reactivation_requested_at')->nullable()->after('reactivation_reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'reactivation_requested',
                'reactivation_reason',
                'reactivation_requested_at'
            ]);
        });
    }
};
