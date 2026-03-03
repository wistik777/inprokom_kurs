<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['login' => 'admin'],
            [
                'email' => 'admin@inprokom.local',
                'password' => 'admin12345',
                'phone' => '+7(999)-000-00-00',
                'rule' => 'success',
                'role' => true,
            ]
        );

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
