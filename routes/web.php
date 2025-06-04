<?php

use App\Http\Controllers\ActuatorsController;
use App\Http\Controllers\AssociationsController;
use App\Http\Controllers\BiomassesController;
use App\Http\Controllers\CitiesController;
use App\Http\Controllers\CronJobs;
use App\Http\Controllers\ExpensesController;
use App\Http\Controllers\FeedingController;
use App\Http\Controllers\MedicateController;
use App\Http\Controllers\MortalitiesController;
use App\Http\Controllers\MqttController;
use App\Http\Controllers\PartiesController;
use App\Http\Controllers\PondsController;
use App\Http\Controllers\ProductiveUnitsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SowingNewsController;
use App\Http\Controllers\SowingsController;
use App\Http\Controllers\StatReadingsController;
use App\Http\Controllers\StepsController;
use App\Http\Controllers\StepStatsController;
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

Route::get('/', [SowingsController::class, 'index'])->middleware(['auth', 'verified'])->name('first');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('manual_cronjobs', [CronJobs::class, 'index'])->name('manual_cronjobs');
});

Route::post('simulate', [StatReadingsController::class, 'index'])->name('simulate');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// Parties routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('personas')->group(function() {
        Route::get('/{partyRoleId}', [PartiesController::class, 'index'])->name('parties');
        Route::get('{partyId}/view', [PartiesController::class, 'view'])->name('party.view');
        Route::get('{partyRoleId}/create', [PartiesController::class, 'create'])->name('party.create');
        Route::post('store', [PartiesController::class, 'store'])->name('party.store');
        Route::get('{partyId}/edit', [PartiesController::class, 'edit'])->name('party.edit');
        Route::patch('{partyId}/update', [PartiesController::class, 'update'])->name('party.update');
        Route::delete('{partyId}', [PartiesController::class, 'destroy'])->name('party.delete');
    });
});

// Users routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('users')->group(function() {
        Route::get('/{productiveUnitId?}', [UsersController::class, 'index'])->name('users');
        Route::get('{clientId}/view', [UsersController::class, 'view'])->name('user.view');
        Route::get('create/{productiveUnitId?}', [UsersController::class, 'create'])->name('user.create');
        Route::post('store/{productiveUnitId?}', [UsersController::class, 'store'])->name('user.store');
        Route::get('{userId}/edit', [UsersController::class, 'edit'])->name('user.edit');
        Route::patch('{userId}/update', [UsersController::class, 'update'])->name('user.update');
        Route::patch('{userId}/password', [UsersController::class, 'restorePassword'])->name('user.password');
        Route::delete('{userId}', [UsersController::class, 'destroy'])->name('user.delete');
    });
});

// Sowings routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('sowings')->group(function() {
        Route::get('/', [SowingsController::class, 'index'])->name('sowings');
        Route::get('{sowingId}/resume', [SowingsController::class, 'resume'])->name('sowing.resume');
        Route::get('{sowingId}/view', [SowingsController::class, 'view'])->name('sowing.view');
        Route::get('create', [SowingsController::class, 'create'])->name('sowing.create');
        Route::post('store', [SowingsController::class, 'store'])->name('sowing.store');
        Route::get('{sowingId}/edit', [SowingsController::class, 'edit'])->name('sowing.edit')->middleware(['check.saledate']);
        Route::patch('{sowingId}/update', [SowingsController::class, 'update'])->name('sowing.update');
        Route::delete('{sowingId}', [SowingsController::class, 'destroy'])->name('sowing.delete')->middleware(['check.saledate']);
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
        Route::get('/pond/{pondId?}', [ActuatorsController::class, 'index'])->name('actuators');
        Route::get('{actuatorId}/view', [ActuatorsController::class, 'view'])->name('actuator.view');
        Route::get('create', [ActuatorsController::class, 'create'])->name('actuator.create');
        Route::post('store', [ActuatorsController::class, 'store'])->name('actuator.store');
        Route::delete('{actuatorId}', [ActuatorsController::class, 'destroy'])->name('actuator.delete');
        Route::get('{actuatorId}/edit', [ActuatorsController::class, 'edit'])->name('actuator.edit');
        Route::patch('{actuatorId}/update', [ActuatorsController::class, 'update'])->name('actuator.update');
    });
});

// Biomasses routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('biomasses')->group(function() {
        Route::middleware(['check.saledate'])->group(function () {
            Route::get('sowing/{sowingId}/create', [BiomassesController::class, 'create'])->name('biomasse.create');
            Route::post('store', [BiomassesController::class, 'store'])->name('biomasse.store');
            Route::get('{biomasseId}/edit', [BiomassesController::class, 'edit'])->name('biomasse.edit');
            Route::patch('{biomasseId}/update', [BiomassesController::class, 'update'])->name('biomasse.update');
            Route::delete('{biomasseId}', [BiomassesController::class, 'destroy'])->name('biomasse.delete');
        });
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [BiomassesController::class, 'readings'])->name('biomasse.readings');
        Route::get('sowing/{sowingId}', [BiomassesController::class, 'index'])->name('biomasses');
        Route::get('all/sowing/{sowingId}', [BiomassesController::class, 'getBySowing'])->name('biomasses.sowing');
    });
});

// Expenses routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('expenses')->group(function() {
        Route::middleware(['check.saledate'])->group(function () {
            Route::get('create/{sowingId?}', [ExpensesController::class, 'create'])->name('expense.create');
            Route::post('store/{sowingId?}', [ExpensesController::class, 'store'])->name('expense.store');
            Route::get('{expenseId}/edit/{sowingId?}', [ExpensesController::class, 'edit'])->name('expense.edit');
            Route::patch('{expenseId}/update', [ExpensesController::class, 'update'])->name('expense.update');
        });
        Route::get('all/{sowingId?}', [ExpensesController::class, 'index'])->name('expenses');
        Route::delete('{expenseId}', [ExpensesController::class, 'destroy'])->name('expense.delete');
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
        Route::middleware(['check.saledate'])->group(function () {
            Route::get('sowing/{sowingId}/create', [FeedingController::class, 'create'])->name('feeding.create');
            Route::post('store', [FeedingController::class, 'store'])->name('feeding.store');
            Route::get('{feedingId}/edit', [FeedingController::class, 'edit'])->name('feeding.edit');
            Route::patch('{feedingId}/update', [FeedingController::class, 'update'])->name('feeding.update');
            Route::delete('{feedingId}', [FeedingController::class, 'destroy'])->name('feeding.delete');
        });
        Route::get('sowing/{sowingId}', [FeedingController::class, 'index'])->name('feeding');
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [FeedingController::class, 'readings'])->name('feeding.readings.compare');
    });
});

// SupplyUse Medicate routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('medicate')->group(function() {
        Route::middleware(['check.saledate'])->group(function () {
            Route::get('sowing/{sowingId}/create', [MedicateController::class, 'create'])->name('medicate.create');
            Route::post('store', [MedicateController::class, 'store'])->name('medicate.store');
            Route::get('{feedingId}/edit', [MedicateController::class, 'edit'])->name('medicate.edit');
            Route::patch('{feedingId}/update', [MedicateController::class, 'update'])->name('medicate.update');
            Route::delete('{feedingId}', [MedicateController::class, 'destroy'])->name('medicate.delete');
        });
        Route::get('sowing/{sowingId}', [MedicateController::class, 'index'])->name('medicate');
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [MedicateController::class, 'readings'])->name('medicate.readings.compare');
    });
});

// Mortalities routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('mortalities')->group(function() {
        Route::middleware(['check.saledate'])->group(function () {
            Route::get('sowing/{sowingId}/create', [MortalitiesController::class, 'create'])->name('mortality.create');
            Route::post('{sowingId}/store', [MortalitiesController::class, 'store'])->name('mortality.store');
            Route::get('{mortalityId}/edit', [MortalitiesController::class, 'edit'])->name('mortality.edit');
            Route::patch('{mortalityId}/update', [MortalitiesController::class, 'update'])->name('mortality.update');
            Route::delete('{mortalityId}', [MortalitiesController::class, 'destroy'])->name('mortality.delete');
        });
        Route::get('sowing/{sowingId}', [MortalitiesController::class, 'index'])->name('mortalities');
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [MortalitiesController::class, 'readings'])->name('mortality.readings');
    });
});

// Associations routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('associations')->group(function() {
        Route::get('/', [AssociationsController::class, 'index'])->name('associations');
        Route::get('create', [AssociationsController::class, 'create'])->name('association.create');
        Route::post('store', [AssociationsController::class, 'store'])->name('association.store');
        Route::get('{associationId}/edit', [AssociationsController::class, 'edit'])->name('association.edit');
        Route::patch('{associationId}/update', [AssociationsController::class, 'update'])->name('association.update');
        Route::delete('{associationId}', [AssociationsController::class, 'destroy'])->name('association.delete');
    });
});

// Steps routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('steps')->group(function() {
        Route::get('/', [StepsController::class, 'index'])->name('steps');
        Route::post('store', [StepsController::class, 'store'])->name('step.store');
        Route::patch('{stepId}/update', [StepsController::class, 'update'])->name('step.update');
        Route::delete('{stepId}', [StepsController::class, 'destroy'])->name('step.delete');
    });
});

// Step stats routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('step_stats')->group(function() {
        Route::get('/all/{stepId?}', [StepStatsController::class, 'index'])->name('step_stats');
        Route::get('create/{stepId?}', [StepStatsController::class, 'create'])->name('step_stat.create');
        Route::post('store', [StepStatsController::class, 'store'])->name('step_stat.store');
        Route::get('{stepStatId}/edit/{stepId?}', [StepStatsController::class, 'edit'])->name('step_stat.edit');
        Route::patch('{stepStatId}/update', [StepStatsController::class, 'update'])->name('step_stat.update');
        Route::delete('{stepStatId}', [StepStatsController::class, 'destroy'])->name('step_stat.delete');
    });
});

// Productive units routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('productive_units')->group(function() {
        Route::get('/', [ProductiveUnitsController::class, 'index'])->name('productive_units');
        Route::get('create', [ProductiveUnitsController::class, 'create'])->name('productive_unit.create');
        Route::post('store', [ProductiveUnitsController::class, 'store'])->name('productive_unit.store');
        Route::get('{productiveUnitId}/edit', [ProductiveUnitsController::class, 'edit'])->name('productive_unit.edit');
        Route::patch('{productiveUnitId}/update', [ProductiveUnitsController::class, 'update'])->name('productive_unit.update');
        Route::delete('{productiveUnitId}', [ProductiveUnitsController::class, 'destroy'])->name('productive_unit.delete');
    });
});

// Sales routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('sales')->group(function() {
        Route::get('/', [SalesController::class, 'index'])->name('sales');
        Route::get('create', [SalesController::class, 'create'])->name('sale.create');
        Route::post('store', [SalesController::class, 'store'])->name('sale.store');
        Route::get('{saleId}/edit', [SalesController::class, 'edit'])->name('sale.edit');
        Route::patch('{saleId}/update', [SalesController::class, 'update'])->name('sale.update');
        Route::delete('{saleId}', [SalesController::class, 'destroy'])->name('sale.delete');
    });
});

// Sowing news routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('sowing_news')->group(function() {
        Route::get('{sowingId}', [SowingNewsController::class, 'index'])->name('sowing_news');
    });
});

// MQTT routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('mqtt')->group(function() {
        Route::post('set_actuator_turn', [MqttController::class, 'setTurnActuator'])->name('mqtt.set.actuator.turn');
    });
});

// Reports routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('reports')->group(function() {
        Route::get('/', [ReportsController::class, 'index'])->name('reports');
        Route::get('biomasses/{sowingId}', [ReportsController::class, 'biomasses'])->name('biomasses.report.exports');
        Route::get('readings/biomasse/{biomasseId}', [ReportsController::class, 'readingsBiomasse'])->name('readings.biomasse.report.exports');
        Route::get('supplies/sowing/{sowingId}/{useType}', [ReportsController::class, 'sowingSupplies'])->name('supplies.sowing.report.exports');
        Route::get('readings/betweenDates/pdf/{sowingId}/{fromDate}/{toDate}',[ReportsController::class, 'readingsBetweenDatesPdf'])->name('readings.betweenDates.pdf');
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
