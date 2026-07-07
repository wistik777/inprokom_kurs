<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('order_status_logs');
        Schema::dropIfExists('order_inquiries');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('product_reviews');

        if (Schema::hasColumn('users', 'delivery_method')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn(['delivery_method', 'delivery_address']);
            });
        }
    }

    public function down(): void
    {
        // E-commerce tables are intentionally not restored.
    }
};
