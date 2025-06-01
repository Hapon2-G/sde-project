<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\BuyerDashboardController;
use App\Http\Controllers\WelcomeController; // ✅ Make sure this is added

Route::get('/', function () {
    return view('welcome');
});

// Welcome data route
Route::get('/welcome-data', [WelcomeController::class, 'getWelcomeData']);

// Unauthorized login fallback for sanctum
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized'], 401);
})->name('login');

// Password reset form route with signed URL verification
Route::get('/reset-password', function (Request $request) {
    // Verify the signed URL
    if (!$request->hasValidSignature()) {
        abort(403, 'Invalid or expired reset link.');
    }

    // Return your password reset form view
    return view('auth.reset-password', ['email' => $request->email]);
})->name('password.reset.form');
