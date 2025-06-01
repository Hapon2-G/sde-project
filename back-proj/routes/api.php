<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SellerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendRecoveryEmail']);
Route::get('/welcome-data', [WelcomeController::class, 'index']);
Route::apiResource('users', UserController::class);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/sellers/users/{userId}/public', [SellerController::class, 'publicInfoByUserId']);

// Protected routes that require authentication
Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']); // Use AuthController's user method

    // Profile routes
    Route::get('/profile', [AuthController::class, 'user']); // Use same method as /user
    Route::put('/profile', [ProfileController::class, 'update']);

    // Product routes
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Address routes
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);

    // Purchase routes
    Route::get('/purchases', [PurchaseController::class, 'index']);
    Route::post('/purchases', [PurchaseController::class, 'store']);
    Route::get('/purchases/{id}', [PurchaseController::class, 'show']);
    Route::post('/purchases/{id}/cancel', [PurchaseController::class, 'cancel']);
    Route::post('/purchases/{id}/return', [PurchaseController::class, 'return']);

    // Seller routes
    Route::prefix('seller')->group(function () {
        Route::post('/register', [SellerController::class, 'register']);
        Route::get('/info', [SellerController::class, 'getInfo']);
        Route::post('/update', [SellerController::class, 'updateInfo']);
        Route::get('/status', [SellerController::class, 'checkStatus']);
        Route::get('/products', [SellerController::class, 'getProducts']);
        Route::get('/sales', [SellerController::class, 'getSales']);
    });

    // User management routes (admin/self management)
    Route::prefix('user')->group(function () {
        Route::put('/update', [UserController::class, 'update']);
        Route::delete('/delete', [UserController::class, 'destroy']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});