<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\VacancyApplicationController;
use App\Http\Controllers\NewsletterController;
use App\Models\Product;
use App\Support\SiteContent;
use App\Support\StaffAccess;

Route::get('/', function () {
    $siteNewsItems = SiteContent::publishedNews();

    return view('home', compact('siteNewsItems'));
});

Route::get(StaffAccess::loginPath(), function () {
    return view('staff-login');
});

Route::get('/catalog', function () {
    $products = Product::query()
        ->with(['categories:id,name,slug,parent_id'])
        ->where('is_active', true)
        ->latest('id')
        ->get();

    return view('catalog', compact('products'));
});

Route::get('/catalog/{product}', function (Product $product) {
    $product->load(['categories:id,name,slug,parent_id']);

    return view('product', compact('product'));
})->whereNumber('product');

Route::middleware('admin')->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);
    Route::get('/admin/statistics', [AdminController::class, 'statistics']);
    Route::get('/admin/create-manager', [AdminController::class, 'createManager']);
    Route::post('/admin/create-manager', [AdminController::class, 'storeManager']);
    Route::delete('/admin/managers/{manager}', [AdminController::class, 'destroyManager']);
    Route::post('/admin/audit-logs/{auditLog}/rollback', [AdminController::class, 'rollbackAuditLog']);
});

Route::middleware('manager')->group(function () {
    Route::get('/manager', [ManagerController::class, 'index']);
    Route::post('/manager/products', [ManagerController::class, 'storeProduct']);
    Route::delete('/manager/products/{product}', [ManagerController::class, 'destroyProduct']);
    Route::get('/manager/inbox', [ManagerController::class, 'inbox']);
    Route::patch('/manager/feedback/{message}', [ManagerController::class, 'updateFeedbackStatus']);
    Route::patch('/manager/vacancy-applications/{application}', [ManagerController::class, 'updateVacancyStatus']);
    Route::get('/manager/vacancy-applications/{application}/resume', [ManagerController::class, 'downloadVacancyResume']);
    Route::get('/manager/content', [ManagerController::class, 'content']);
    Route::get('/manager/content/news/{newsPost}/preview', [ManagerController::class, 'previewNews']);
    Route::post('/manager/content/news', [ManagerController::class, 'storeNews']);
    Route::patch('/manager/content/news/{newsPost}', [ManagerController::class, 'updateNews']);
    Route::delete('/manager/content/news/{newsPost}', [ManagerController::class, 'destroyNews']);
    Route::post('/manager/content/vacancies', [ManagerController::class, 'storeVacancy']);
    Route::patch('/manager/content/vacancies/{vacancy}', [ManagerController::class, 'updateVacancy']);
    Route::delete('/manager/content/vacancies/{vacancy}', [ManagerController::class, 'destroyVacancy']);
});

Route::get('/about-company', function () {
    return view('about-company');
});

Route::get('/press-center', function () {
    $siteNewsItems = SiteContent::publishedNews();

    return view('press-center', compact('siteNewsItems'));
});

Route::get('/press-center/news', function () {
    $siteNewsItems = SiteContent::publishedNews();

    return view('press-center-news', compact('siteNewsItems'));
});

Route::get('/press-center/news/{news}', function (int $news) {
    $siteNewsItems = SiteContent::publishedNews();

    return view('press-center-news-article', [
        'newsId' => $news,
        'siteNewsItems' => $siteNewsItems,
    ]);
})->whereNumber('news');

Route::get('/contacts', function () {
    return view('contacts');
});

Route::post('/contacts/feedback', [ContactMessageController::class, 'store']);

Route::get('/vacancies', function () {
    $siteVacancies = SiteContent::activeVacancies();

    return view('vacancies', compact('siteVacancies'));
});

Route::post('/vacancies/apply', [VacancyApplicationController::class, 'store']);

Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

