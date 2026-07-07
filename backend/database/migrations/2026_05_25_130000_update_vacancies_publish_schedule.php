<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->timestamp('published_at')->nullable()->after('title');
        });

        $vacancies = DB::table('vacancies')->get(['id', 'created_at']);

        foreach ($vacancies as $vacancy) {
            DB::table('vacancies')
                ->where('id', $vacancy->id)
                ->update(['published_at' => $vacancy->created_at ?? now()]);
        }

        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0);
        });

        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropColumn('published_at');
        });
    }
};
