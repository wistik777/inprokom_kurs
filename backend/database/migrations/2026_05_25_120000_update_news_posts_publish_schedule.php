<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news_posts', function (Blueprint $table) {
            $table->timestamp('published_at')->nullable()->after('title');
        });

        $posts = DB::table('news_posts')->get(['id', 'created_at']);

        foreach ($posts as $post) {
            DB::table('news_posts')
                ->where('id', $post->id)
                ->update(['published_at' => $post->created_at ?? now()]);
        }

        Schema::table('news_posts', function (Blueprint $table) {
            $table->dropColumn(['display_date', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::table('news_posts', function (Blueprint $table) {
            $table->string('display_date')->default('');
            $table->unsignedInteger('sort_order')->default(0);
        });

        Schema::table('news_posts', function (Blueprint $table) {
            $table->dropColumn('published_at');
        });
    }
};
