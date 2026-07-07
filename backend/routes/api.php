<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\VacancyApplicationController;
use App\Http\Controllers\Api\PublicContentController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/news', [PublicContentController::class, 'news']);
    Route::get('/news/{newsPost}', [PublicContentController::class, 'newsShow'])->whereNumber('newsPost');
    Route::get('/products', [PublicContentController::class, 'products']);
    Route::get('/products/{product}', [PublicContentController::class, 'productShow'])->whereNumber('product');
    Route::get('/vacancies', [PublicContentController::class, 'vacancies']);

    Route::post('/contact-messages', [ContactMessageController::class, 'store']);
    Route::post('/vacancy-applications', [VacancyApplicationController::class, 'store']);
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::middleware('auth')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
    });

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'index']);
        Route::get('/statistics', [AdminController::class, 'statistics']);
        Route::post('/managers', [AdminController::class, 'storeManager']);
        Route::delete('/managers/{manager}', [AdminController::class, 'destroyManager']);
        Route::post('/audit-logs/{auditLog}/rollback', [AdminController::class, 'rollbackAuditLog']);
    });

    Route::middleware('manager')->prefix('manager')->group(function () {
        Route::get('/products', [ManagerController::class, 'index']);
        Route::post('/products', [ManagerController::class, 'storeProduct']);
        Route::delete('/products/{product}', [ManagerController::class, 'destroyProduct']);

        Route::get('/inbox', [ManagerController::class, 'inbox']);
        Route::patch('/feedback/{message}', [ManagerController::class, 'updateFeedbackStatus']);
        Route::patch('/vacancy-applications/{application}', [ManagerController::class, 'updateVacancyStatus']);
        Route::get('/vacancy-applications/{application}/resume', [ManagerController::class, 'downloadVacancyResume']);

        Route::get('/content', [ManagerController::class, 'content']);
        Route::get('/content/news/{newsPost}/preview', [ManagerController::class, 'previewNews']);
        Route::post('/content/news', [ManagerController::class, 'storeNews']);
        Route::patch('/content/news/{newsPost}', [ManagerController::class, 'updateNews']);
        Route::delete('/content/news/{newsPost}', [ManagerController::class, 'destroyNews']);
        Route::post('/content/vacancies', [ManagerController::class, 'storeVacancy']);
        Route::patch('/content/vacancies/{vacancy}', [ManagerController::class, 'updateVacancy']);
        Route::delete('/content/vacancies/{vacancy}', [ManagerController::class, 'destroyVacancy']);
    });
});
