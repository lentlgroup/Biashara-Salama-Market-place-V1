<?php

use App\Http\Controllers\MarketplaceStateController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'pong',
        'service' => config('app.name'),
    ]);
});

Route::get('/marketplace-state', [MarketplaceStateController::class, 'show']);
Route::put('/marketplace-state', [MarketplaceStateController::class, 'update']);
