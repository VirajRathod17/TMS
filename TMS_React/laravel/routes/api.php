<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
        Route::resource('award-category', 'AwardCategoryController');
        Route::group(['controller' => 'AwardCategoryController'], function () {
            Route::post('award-category-multiple-delete', 'multipleDelete')->name('award-category-multiple-delete');
        });
    }); 
});
