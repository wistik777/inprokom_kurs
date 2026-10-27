<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('vacancy_applications')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE vacancy_applications MODIFY resume_path VARCHAR(255) NULL');
            DB::statement('ALTER TABLE vacancy_applications MODIFY resume_original_name VARCHAR(255) NULL');
            DB::statement('ALTER TABLE vacancy_applications MODIFY message TEXT NULL');

            return;
        }

        if ($driver === 'sqlite') {
            // SQLite ignores NOT NULL changes in many setups; keep migration no-op friendly.
            return;
        }
    }

    public function down(): void
    {
        // Intentionally left empty: restoring NOT NULL would fail if null rows exist.
    }
};
