<?php

use App\Http\Controllers\ActuatorsController;
use App\Http\Controllers\BiomassesController;
use App\Http\Controllers\CitiesController;
use App\Http\Controllers\FeedingController;
use App\Http\Controllers\MedicateController;
use App\Http\Controllers\MortalitiesController;
use App\Http\Controllers\PartiesController;
use App\Http\Controllers\PondsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\SowingNewsController;
use App\Http\Controllers\SowingsController;
use App\Http\Controllers\StatReadingsController;
use App\Http\Controllers\SuppliesController;
use App\Http\Controllers\SupplyPurchasesController;
use App\Http\Controllers\UsersController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::post('simulate', [StatReadingsController::class, 'index'])->name('simulate');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// Parties routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('clients')->group(function() {
        Route::get('/', [ClientsController::class, 'index'])->name('clients');
        Route::get('{clientId}/view', [ClientsController::class, 'view'])->name('client.view');
        Route::get('create', [ClientsController::class, 'create'])->name('client.create');
        Route::post('store', [PartiesController::class, 'store'])->name('client.store');
        Route::get('{clientId}/edit', [ClientsController::class, 'edit'])->name('client.edit');
        Route::patch('{partyId}/update', [PartiesController::class, 'update'])->name('client.update');
        Route::delete('{partyId}', [PartiesController::class, 'destroy'])->name('client.delete');
    });
});

// Users routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('users')->group(function() {
        Route::get('/', [UsersController::class, 'index'])->name('users');
        Route::get('{clientId}/view', [UsersController::class, 'view'])->name('user.view');
        Route::get('create', [UsersController::class, 'create'])->name('user.create');
        Route::post('store', [UsersController::class, 'store'])->name('user.store');
        Route::get('{userId}/edit', [UsersController::class, 'edit'])->name('user.edit');
        Route::patch('{userId}/update', [UsersController::class, 'update'])->name('user.update');
        Route::delete('{userId}', [UsersController::class, 'destroy'])->name('user.delete');
    });
});

// Sowings routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('sowings')->group(function() {
        Route::get('/', [SowingsController::class, 'index'])->name('sowings');
        Route::get('{sowingId}/view', [SowingsController::class, 'view'])->name('sowing.view');
        Route::get('create', [SowingsController::class, 'create'])->name('sowing.create');
        Route::post('store', [SowingsController::class, 'store'])->name('sowing.store');
        Route::get('{sowingId}/edit', [SowingsController::class, 'edit'])->name('sowing.edit');
        Route::patch('{sowingId}/update', [SowingsController::class, 'update'])->name('sowing.update');
        Route::delete('{sowingId}', [SowingsController::class, 'destroy'])->name('sowing.delete');
    });
});

// Ponds routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('ponds')->group(function() {
        Route::get('/', [PondsController::class, 'index'])->name('ponds');
        Route::get('create', [PondsController::class, 'create'])->name('pond.create');
        Route::post('store', [PondsController::class, 'store'])->name('pond.store');
        Route::delete('{pondId}', [PondsController::class, 'destroy'])->name('pond.delete');
        Route::delete('{pondId}', [PondsController::class, 'destroy'])->name('pond.delete');
        Route::get('{pondId}/edit', [PondsController::class, 'edit'])->name('pond.edit');
        Route::patch('{pondId}/update', [PondsController::class, 'update'])->name('pond.update');
    });
});

// Actuators routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('actuators')->group(function() {
        Route::get('/{pondId?}', [ActuatorsController::class, 'index'])->name('actuators');
        Route::get('create', [ActuatorsController::class, 'create'])->name('actuator.create');
        Route::post('store', [ActuatorsController::class, 'store'])->name('actuator.store');
        /*

        Route::delete('{actuatorId}', [ActuatorsController::class, 'destroy'])->name('actuator.delete');
        Route::delete('{actuatorId}', [ActuatorsController::class, 'destroy'])->name('actuator.delete');
        Route::get('{actuatorId}/edit', [ActuatorsController::class, 'edit'])->name('actuator.edit');
        Route::patch('{actuatorId}/update', [ActuatorsController::class, 'update'])->name('actuator.update');*/
    });
});

// Biomasses routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('biomasses')->group(function() {
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [BiomassesController::class, 'readings'])->name('biomasse.readings');
        Route::get('sowing/{sowingId}', [BiomassesController::class, 'index'])->name('biomasses');
        Route::get('sowing/{sowingId}/create', [BiomassesController::class, 'create'])->name('biomasse.create');
        Route::post('store', [BiomassesController::class, 'store'])->name('biomasse.store');
        Route::get('{biomasseId}/edit', [BiomassesController::class, 'edit'])->name('biomasse.edit');
        Route::patch('{biomasseId}/update', [BiomassesController::class, 'update'])->name('biomasse.update');
        Route::delete('{biomasseId}', [BiomassesController::class, 'destroy'])->name('biomasse.delete');
    });
});

// Supplies routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('supplies')->group(function() {
        Route::get('/', [SuppliesController::class, 'index'])->name('supplies');
        Route::get('create', [SuppliesController::class, 'create'])->name('supply.create');
        Route::post('store', [SuppliesController::class, 'store'])->name('supply.store');
        Route::delete('{supplyId}', [SuppliesController::class, 'destroy'])->name('supply.delete');
        Route::get('{supplyId}/view', [SuppliesController::class, 'view'])->name('supply.view');
        Route::get('{supplyId}/edit', [SuppliesController::class, 'edit'])->name('supply.edit');
        Route::patch('{supplyId}/update', [SuppliesController::class, 'update'])->name('supply.update');

        // Stock routes
        Route::prefix('purchases')->group(function() {
            Route::get('{supplyId}/create', [SupplyPurchasesController::class, 'create'])->name('supply_purchase.create');
            Route::post('store', [SupplyPurchasesController::class, 'store'])->name('supply_purchase.store');
            Route::get('edit/{supplyPurchaseId}', [SupplyPurchasesController::class, 'edit'])->name('supply_purchase.edit');
            Route::patch('update/{supplyPurchaseId}', [SupplyPurchasesController::class, 'update'])->name('supply_purchase.update');
            Route::delete('{supplyPurchaseId}', [SupplyPurchasesController::class, 'destroy'])->name('supply_purchase.delete');
        });
    });
});

// SupplyUse Feeding routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('feeding')->group(function() {
        Route::get('sowing/{sowingId}', [FeedingController::class, 'index'])->name('feeding');
        Route::get('sowing/{sowingId}/create', [FeedingController::class, 'create'])->name('feeding.create');
        Route::post('store', [FeedingController::class, 'store'])->name('feeding.store');
        Route::get('{feedingId}/edit', [FeedingController::class, 'edit'])->name('feeding.edit');
        Route::patch('{feedingId}/update', [FeedingController::class, 'update'])->name('feeding.update');
        Route::delete('{feedingId}', [FeedingController::class, 'destroy'])->name('feeding.delete');
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [FeedingController::class, 'readings'])->name('feeding.readings.compare');
    });
});

// SupplyUse Medicate routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('medicate')->group(function() {
        Route::get('sowing/{sowingId}', [MedicateController::class, 'index'])->name('medicate');
        Route::get('sowing/{sowingId}/create', [MedicateController::class, 'create'])->name('medicate.create');
        Route::post('store', [MedicateController::class, 'store'])->name('medicate.store');
        Route::get('{feedingId}/edit', [MedicateController::class, 'edit'])->name('medicate.edit');
        Route::patch('{feedingId}/update', [MedicateController::class, 'update'])->name('medicate.update');
        Route::delete('{feedingId}', [MedicateController::class, 'destroy'])->name('medicate.delete');
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [MedicateController::class, 'readings'])->name('medicate.readings.compare');
    });
});

// Mortalities routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('mortalities')->group(function() {
        Route::get('sowing/{sowingId}', [MortalitiesController::class, 'index'])->name('mortalities');
        Route::get('sowing/{sowingId}/create', [MortalitiesController::class, 'create'])->name('mortality.create');
        Route::post('{sowingId}/store', [MortalitiesController::class, 'store'])->name('mortality.store');
        Route::get('{mortalityId}/edit', [MortalitiesController::class, 'edit'])->name('mortality.edit');
        Route::patch('{mortalityId}/update', [MortalitiesController::class, 'update'])->name('mortality.update');
        Route::delete('{mortalityId}', [MortalitiesController::class, 'destroy'])->name('mortality.delete');
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [MortalitiesController::class, 'readings'])->name('mortality.readings');
    });
});

// Sowing news routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('sowing_news')->group(function() {
        Route::get('{sowingId}', [SowingNewsController::class, 'index'])->name('sowing_news');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('states')->group(function() {
    Route::get('{state}/cities', [CitiesController::class, 'getCities'])->name('get.cities');
});

require __DIR__.'/auth.php';
