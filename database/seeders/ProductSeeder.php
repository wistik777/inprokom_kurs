<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Камера-извещатель',
                'model' => 'WI1003002',
                'description' => 'Компактная камера для видеонаблюдения с защитным корпусом.',
                'price' => 20500.00,
                'stock' => 17,
                'categories' => ['obektovaya-bezopasnost', 'videonablyudenie'],
            ],
            [
                'name' => 'Датчик движения',
                'model' => 'MD2004011',
                'description' => 'Инфракрасный датчик для помещений и складов.',
                'price' => 6800.00,
                'stock' => 35,
                'categories' => ['obektovaya-bezopasnost', 'pozharnaya-bezopasnost'],
            ],
            [
                'name' => 'Контроллер доступа',
                'model' => 'AC3302004',
                'description' => 'Контроллер для управления точками входа и учёта доступа.',
                'price' => 15400.00,
                'stock' => 12,
                'categories' => ['obektovaya-bezopasnost', 'kontrol-dostupa'],
            ],
            [
                'name' => 'Сирена наружная',
                'model' => 'SN5400188',
                'description' => 'Уличная сирена с влагозащищённым корпусом.',
                'price' => 3900.00,
                'stock' => 44,
                'categories' => ['pozharnaya-bezopasnost', 'pozharnye-izveshchateli'],
            ],
            [
                'name' => 'Видеорегистратор',
                'model' => 'VR9805021',
                'description' => 'Гибридный регистратор для IP и аналоговых камер.',
                'price' => 27990.00,
                'stock' => 9,
                'categories' => ['videonablyudenie'],
            ],
            [
                'name' => 'Блок питания',
                'model' => 'PS1207780',
                'description' => 'Стабилизированный блок питания для систем безопасности.',
                'price' => 2500.00,
                'stock' => 60,
                'categories' => ['kontraktnoe-proizvodstvo', 'elektronnye-moduli'],
            ],
            [
                'name' => 'Считыватель карт',
                'model' => 'RD4401200',
                'description' => 'Бесконтактный считыватель карт и брелоков доступа.',
                'price' => 7200.00,
                'stock' => 22,
                'categories' => ['kontrol-dostupa'],
            ],
            [
                'name' => 'Замок электромагнитный',
                'model' => 'LM7700003',
                'description' => 'Электромагнитный замок для офисных и промышленных дверей.',
                'price' => 11400.00,
                'stock' => 14,
                'categories' => ['kontrol-dostupa', 'obektovaya-bezopasnost'],
            ],
            [
                'name' => 'Коммутатор PoE',
                'model' => 'SW1609085',
                'description' => 'Коммутатор с PoE-портами для камер и сетевых устройств.',
                'price' => 18900.00,
                'stock' => 19,
                'categories' => ['videonablyudenie'],
            ],
            [
                'name' => 'Модуль GSM-оповещения',
                'model' => 'GM2210044',
                'description' => 'Модуль отправки тревожных уведомлений через GSM-канал.',
                'price' => 9300.00,
                'stock' => 11,
                'categories' => ['obektovaya-bezopasnost', 'ekologicheskaya-bezopasnost'],
            ],
            [
                'name' => 'Панель оператора',
                'model' => 'OP5512020',
                'description' => 'Сенсорная панель для настройки и мониторинга оборудования.',
                'price' => 42300.00,
                'stock' => 6,
                'categories' => ['voennaya-tekhnika', 'nablyudatelnye-kompleksy'],
            ],
            [
                'name' => 'Кабельный набор',
                'model' => 'CB7719055',
                'description' => 'Комплект кабелей и разъёмов для монтажа систем безопасности.',
                'price' => 1500.00,
                'stock' => 80,
                'categories' => ['kontraktnoe-proizvodstvo', 'elektronnye-moduli'],
            ],
        ];

        $extraProducts = [];
        $seriesCount = 5;

        foreach ($products as $index => $baseProduct) {
            for ($series = 1; $series <= $seriesCount; $series++) {
                $extraProducts[] = [
                    'name' => $baseProduct['name'] . ' серия ' . ($series + 1),
                    'model' => $baseProduct['model'] . '-S' . ($series + 1),
                    'description' => $baseProduct['description'] . ' Версия серии ' . ($series + 1) . '.',
                    'price' => (float) $baseProduct['price'] + ($series * 350) + (($index % 4) * 120),
                    'stock' => max(1, (int) $baseProduct['stock'] + ($series * 2) - ($index % 3)),
                    'categories' => $baseProduct['categories'],
                ];
            }
        }

        $allProducts = array_merge($products, $extraProducts);

        foreach ($allProducts as $product) {
            $categorySlugs = $product['categories'];
            unset($product['categories']);

            $product['image_url'] = '/img/card.svg';

            $createdProduct = Product::updateOrCreate(
                ['model' => $product['model']],
                $product
            );

            $categoryIds = Category::query()
                ->whereIn('slug', $categorySlugs)
                ->pluck('id')
                ->all();

            $createdProduct->categories()->sync($categoryIds);
        }
    }
}
