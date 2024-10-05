<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\LoginController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::group(['namespace' => 'App\Http\Controllers\Admin'], function () {
    Route::post('admin-login', 'LoginController@login')->name('admin-login');
    Route::post('logout', 'LoginController@logout')->name('logout');

    Route::middleware('auth:api')->group(function () {
        Route::post('/update-profile', [LoginController::class, 'updateProfile'])->name('updateProfile');
        Route::any('/get-user', [LoginController::class, 'getProfile'])->name('get-user'); 
        Route::post('change-award-year', [LoginController::class, 'changeAwardYear'])->name('change-award-year');
        
        Route::post('/change-password', [LoginController::class, 'changePassword'])->name('change-password');

        
        Route::resource('award-category', 'AwardCategoryController');
        Route::group(['controller' => 'AwardCategoryController'], function () {
            Route::post('award-category-multiple-delete', 'multipleDelete')->name('award-category-multiple-delete');
        });

        Route::resource('/awards', 'AwardController');
        Route::group(['controller' => 'AwardController'], function () {
            Route::delete('/awards-delete-multiple', 'deleteMultipleAwardsById')->name('award-delete-multiple-datatable');
        });
    }); 
});
