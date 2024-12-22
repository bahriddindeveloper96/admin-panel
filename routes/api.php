<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ProductController;

Route::prefix('admin')->group(function () {
    Route::post('products/variants/upload-images', [ProductController::class, 'uploadImages']);
    Route::post('products/{product}/variants', [ProductController::class, 'storeVariants']);
});
