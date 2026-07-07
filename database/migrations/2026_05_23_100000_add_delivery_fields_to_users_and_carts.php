<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('delivery_method')->default('pickup')->after('phone');
            $table->text('delivery_address')->nullable()->after('delivery_method');
        });

        Schema::table('carts', function (Blueprint $table) {
            $table->string('delivery_method')->nullable()->after('status');
            $table->text('delivery_address')->nullable()->after('delivery_method');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['delivery_method', 'delivery_address']);
        });

        Schema::table('carts', function (Blueprint $table) {
            $table->dropColumn(['delivery_method', 'delivery_address']);
        });
    }
};
