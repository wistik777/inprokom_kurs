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

        User::updateOrCreate(
            ['login' => 'manager'],
            [
                'email' => 'manager@inprokom.local',
                'password' => 'manager12345',
                'phone' => '+7(999)-111-11-11',
                'rule' => 'manager',
                'role' => false,
            ]
        );

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
