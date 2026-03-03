<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $rootCategories = [
            [
                'name' => 'Объектовая безопасность',
                'slug' => 'obektovaya-bezopasnost',
                'sort_order' => 10,
                'children' => [
                    ['name' => 'Видеонаблюдение', 'slug' => 'videonablyudenie', 'sort_order' => 1],
                    ['name' => 'Контроль доступа', 'slug' => 'kontrol-dostupa', 'sort_order' => 2],
                ],
            ],
            [
                'name' => 'Опорно-поворотные устройства',
                'slug' => 'oporno-povorotnye-ustroystva',
                'sort_order' => 20,
                'children' => [
                    ['name' => 'Уличные платформы', 'slug' => 'ulichnye-platformy', 'sort_order' => 1],
                    ['name' => 'Стационарные модули', 'slug' => 'statsionarnye-moduli', 'sort_order' => 2],
                ],
            ],
            [
                'name' => 'Военная техника',
                'slug' => 'voennaya-tekhnika',
                'sort_order' => 30,
                'children' => [
                    ['name' => 'Наблюдательные комплексы', 'slug' => 'nablyudatelnye-kompleksy', 'sort_order' => 1],
                ],
            ],
            [
                'name' => 'Контрактное производство',
                'slug' => 'kontraktnoe-proizvodstvo',
                'sort_order' => 40,
                'children' => [
                    ['name' => 'Электронные модули', 'slug' => 'elektronnye-moduli', 'sort_order' => 1],
                ],
            ],
            [
                'name' => 'Пожарная безопасность',
                'slug' => 'pozharnaya-bezopasnost',
                'sort_order' => 50,
                'children' => [
                    ['name' => 'Пожарные извещатели', 'slug' => 'pozharnye-izveshchateli', 'sort_order' => 1],
                ],
            ],
            [
                'name' => 'Ядерная безопасность',
                'slug' => 'yadernaya-bezopasnost',
                'sort_order' => 60,
                'children' => [
                    ['name' => 'Радиационный контроль', 'slug' => 'radiatsionnyy-kontrol', 'sort_order' => 1],
                ],
            ],
            [
                'name' => 'Экологическая безопасность',
                'slug' => 'ekologicheskaya-bezopasnost',
                'sort_order' => 70,
                'children' => [
                    ['name' => 'Мониторинг окружающей среды', 'slug' => 'monitoring-okruzhayushchey-sredy', 'sort_order' => 1],
                ],
            ],
        ];

        foreach ($rootCategories as $rootData) {
            $children = $rootData['children'];
            unset($rootData['children']);

            $root = Category::updateOrCreate(
                ['slug' => $rootData['slug']],
                array_merge($rootData, ['parent_id' => null, 'is_active' => true])
            );

            foreach ($children as $childData) {
                Category::updateOrCreate(
                    ['slug' => $childData['slug']],
                    array_merge($childData, ['parent_id' => $root->id, 'is_active' => true])
                );
            }
        }
    }
}
