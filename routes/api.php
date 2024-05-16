<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\PartiesController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SowingsController;
use App\Http\Controllers\Api\PondsController;
use App\Http\Controllers\Api\ActuatorsController;
use App\Http\Controllers\Api\BiomassesController;
use App\Http\Controllers\Api\ExpensesController;
use App\Http\Controllers\Api\SuppliesController;
use App\Http\Controllers\Api\SupplyPurchasesController;
use App\Http\Controllers\Api\FeedingController;
use App\Http\Controllers\Api\MedicateController;
use App\Http\Controllers\Api\MortalitiesController;
use App\Http\Controllers\Api\AssociationsController;
use App\Http\Controllers\Api\StepsController;
use App\Http\Controllers\Api\StepStatsController;
use App\Http\Controllers\Api\ProductiveUnitsController;


use Illuminate\Support\Facades\Auth;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return array('info' =>Auth::user());
});
// authentication routes
Route::prefix('auth')->group(function() {
    //allows user to login
    Route::post('login', [AuthController::class, 'login']);
    //allows user to register
    Route::post('register', [AuthController::class, 'register']);
    //allows user to send a mail with the recovery password token
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    //allows user to  reset his password
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    // Parties routes
    Route::middleware(['auth:sanctum'])->group(function () {
        //allows user to logout removing token 
        Route::post('logout', [AuthController::class, 'logout']);
        //responses true if the email was verified, false if it doesnt 
        Route::get('verify-email', [AuthController::class, 'getEmailVerificationStatus']);
        //allow to verify the email using id and hash TODO: check if there are some better throttle that returns api responses
        Route::get('verify-email/{id}/{hash}', [AuthController::class,'verifyEmail'])->middleware('throttle:6,1');
        //sends a email with the token for validate de email
        Route::post('email/verification-notification', [AuthController::class, 'verificationNotification'])->middleware('throttle:6,1');
        //verify if the password is the same of the user
        Route::post('confirm-password', [AuthController::class, 'confirmPassword']);
        //allows to update users password
        Route::put('update-password', [AuthController::class, 'updatePassword']);

    });

});

// Parties routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('personas')->group(function() {
        Route::get('/{partyRoleId}', [PartiesController::class, 'getPartiesByRoleId']);
        Route::get('{partyId}/view', [PartiesController::class, 'getPartyInfoById']);
        Route::post('store-party', [PartiesController::class, 'storeParty']);
        Route::post('{partyId}/update', [PartiesController::class, 'updateParty']);
        Route::delete('{partyId}', [PartiesController::class, 'deleteParty']);
    });
});


// Users routes

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('users')->group(function() {
        //gets all users that are on the productive unit
        Route::get('/{productiveUnitId?}', [UserController::class, 'getUserList']);
        //gets details about a client using clientId
        Route::get('{userId}/view', [UserController::class, 'getUserInformation']);
        //allows to create a new user
        Route::post('store/{productiveUnitId?}', [UserController::class, 'addNewUser']);
        //update a user record
        Route::post('{userId}/update', [UserController::class, 'updateUser']);
        //set the password of the user as default
        Route::post('{userId}/password', [UserController::class, 'restorePassword']);
        //soft delete of a user
        Route::delete('{userId}', [UserController::class, 'destroy']);
    });
});

// Sowings routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('sowings')->group(function() {
        Route::get('/list', [SowingsController::class, 'getSowingsList']);
        Route::get('{sowingId}/resume', [SowingsController::class, 'resumeSowing']);
        Route::get('{sowingId}/view', [SowingsController::class, 'view']);
        Route::get('createInfo', [SowingsController::class, 'getCreateInfo']);
        Route::post('store', [SowingsController::class, 'storeSowing']);
        Route::post('{sowingId}/update', [SowingsController::class, 'updateSowing']);
        Route::delete('{sowingId}', [SowingsController::class, 'destroySowing'])->middleware(['check.saledate']);
    });
});

// Ponds routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('ponds')->group(function() {
        //obtain all the ponds, paginated
        Route::get('/all', [PondsController::class, 'getAllPonds']);
        //allows to create a pond based on PondCreateRequest
        Route::post('store', [PondsController::class, 'storePond']);
        //obtains the pond info
        Route::get('{pondId}/view', [PondsController::class, 'getPond']);
        //update a pond using it id and PondCreateRequest
        Route::post('{pondId}/update', [PondsController::class, 'updatePond']);
        //soft delete of the pond based on the pondId
        Route::delete('{pondId}', [PondsController::class, 'destroyPond']);
    });
});

// Actuators routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('actuators')->group(function() {
        Route::get('/', [ActuatorsController::class, 'getAllActuators']);
        //permite obtener la informacion necesaria par acrear un actuador
        Route::get('getInfoToCreateActuator', [ActuatorsController::class, 'getInfoToCreateActuator']);
        //permite almacenar un actuador nuevo en la base de datos
        Route::post('store', [ActuatorsController::class, 'storeActuator']);
        Route::get('{actuatorId}/view', [ActuatorsController::class, 'getActuatorDetails']);
        Route::post('{actuatorId}/update', [ActuatorsController::class, 'updateActuator']);
        Route::delete('{actuatorId}', [ActuatorsController::class, 'destroyActuator']);
    });
});


// Biomasses routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('biomasses')->group(function() {
        //TODO: revisar si es necesario el middleware o si se puede omitir
        //Route::middleware(['check.saledate'])->group(function () {
            Route::post('store', [BiomassesController::class, 'storeBiomasse']);
            Route::get('{biomasseId}/view', [BiomassesController::class, 'getBiomasseInfo']);
            Route::post('{biomasseId}/update', [BiomassesController::class, 'updateBiomasse']);
            Route::delete('{biomasseId}', [BiomassesController::class, 'destroyBiomasse']);
        //});
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [BiomassesController::class, 'getBiomasseReadings']);
        Route::get('sowing/{sowingId}', [BiomassesController::class, 'getIndexInfo']);
        Route::get('all/sowing/{sowingId}', [BiomassesController::class, 'getAllBySowing']);
    });
});

// Expenses routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('expenses')->group(function() {
        //Route::middleware(['check.saledate'])->group(function () {
            Route::get('categories', [ExpensesController::class, 'getExpensesCategories']);
            Route::post('store/{sowingId?}', [ExpensesController::class, 'storeExpense']);
            Route::get('{expenseId}/view', [ExpensesController::class, 'getExpenseInfo']);
            Route::post('{expenseId}/update', [ExpensesController::class, 'updateExpense']);
        //});
        Route::get('all/{sowingId?}', [ExpensesController::class, 'getAllExpenses']);
        Route::delete('{expenseId}', [ExpensesController::class, 'destroyExpense']);
    });
});

// Supplies routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('supplies')->group(function() {
        Route::get('/', [SuppliesController::class, 'getAllSupplies']);
        Route::get('measurements', [SuppliesController::class, 'getMeasurements']);
        Route::post('store', [SuppliesController::class, 'storeSupply']);
        Route::delete('{supplyId}', [SuppliesController::class, 'destroySupply']);
        Route::get('{supplyId}/view', [SuppliesController::class, 'viewSupply']);
        Route::post('{supplyId}/update', [SuppliesController::class, 'updateSupply']);

        // Stock routes
        Route::prefix('purchases')->group(function() {
            Route::post('store', [SupplyPurchasesController::class, 'store']);
            Route::get('{supplyPurchaseId}/view', [SupplyPurchasesController::class, 'view']);
            Route::post('update/{supplyPurchaseId}', [SupplyPurchasesController::class, 'update']);
            Route::delete('{supplyPurchaseId}', [SupplyPurchasesController::class, 'destroy']);
        });

    });
});

// SupplyUse Feeding routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('feeding')->group(function() {
        //Route::middleware(['check.saledate'])->group(function () {
            Route::get('sowing/{sowingId}/infoToCreate', [FeedingController::class, 'infoToCreate']);
            Route::post('store', [FeedingController::class, 'store']);
            Route::get('{feedingId}/view', [FeedingController::class, 'view']);
            Route::post('{feedingId}/update', [FeedingController::class, 'update']);
            Route::delete('{feedingId}', [FeedingController::class, 'destroy']);
        //});
        Route::get('sowing/{sowingId}', [FeedingController::class, 'index']);
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [FeedingController::class, 'readings'])->name('feeding.readings.compare');
    });
});
// SupplyUse Medicate routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('medicate')->group(function() {
        //Route::middleware(['check.saledate'])->group(function () {
            Route::get('sowing/{sowingId}/infoToCreate', [MedicateController::class, 'infoToCreate']);
            Route::post('store', [MedicateController::class, 'store']);
            Route::get('{feedingId}/view', [MedicateController::class, 'view']);
            Route::post('{feedingId}/update', [MedicateController::class, 'update']);
            Route::delete('{feedingId}', [MedicateController::class, 'destroy']);
        //});
        Route::get('sowing/{sowingId}', [MedicateController::class, 'index']);
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [MedicateController::class, 'readings']);
    });
});

// Mortalities routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('mortalities')->group(function() {
        //Route::middleware(['check.saledate'])->group(function () {
            Route::get('sowing/{sowingId}/biomasseId', [MortalitiesController::class, 'biomasseId']);
            Route::post('{sowingId}/store', [MortalitiesController::class, 'store']);
            Route::get('{mortalityId}/view', [MortalitiesController::class, 'view']);
            Route::post('{mortalityId}/update', [MortalitiesController::class, 'update']);
            Route::delete('{mortalityId}', [MortalitiesController::class, 'destroy']);
        //});
        Route::get('sowing/{sowingId}', [MortalitiesController::class, 'index']);
        Route::get('sowing/{sowingId?}/readings/{biomasseIdOne?}/{biomasseIdTwo?}', [MortalitiesController::class, 'readings']);
    });
});

// Associations routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('associations')->group(function() {
        Route::get('/', [AssociationsController::class, 'index']);
        Route::post('store', [AssociationsController::class, 'store']);
        Route::get('{associationId}/view', [AssociationsController::class, 'view']);
        Route::post('{associationId}/update', [AssociationsController::class, 'update']);
        Route::delete('{associationId}', [AssociationsController::class, 'destroy']);
    });
});

// Steps routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('steps')->group(function() {
        Route::get('/', [StepsController::class, 'index']);
        Route::post('store', [StepsController::class, 'store']);
        Route::post('{stepId}/update', [StepsController::class, 'update']);
        Route::delete('{stepId}', [StepsController::class, 'destroy']);
    });
});

// Step stats routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('step_stats')->group(function() {
        Route::get('/all/{stepId?}', [StepStatsController::class, 'index']);
        Route::get('create/{stepId?}', [StepStatsController::class, 'create']);
        Route::post('store', [StepStatsController::class, 'store']);
        Route::get('{stepStatId}/edit/{stepId?}', [StepStatsController::class, 'edit']);
        Route::post('{stepStatId}/update', [StepStatsController::class, 'update']);
        Route::delete('{stepStatId}', [StepStatsController::class, 'destroy']);
    });
});

// Productive units routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('productive_units')->group(function() {
        Route::get('/', [ProductiveUnitsController::class, 'index']);
        //route equivalent to web /create
        Route::get('allAssociations', [ProductiveUnitsController::class, 'allAssociations']);
        Route::post('store', [ProductiveUnitsController::class, 'store']);
        //route equivalent to web /edit
        Route::get('{productiveUnitId}/view', [ProductiveUnitsController::class, 'view']);
        Route::post('{productiveUnitId}/update', [ProductiveUnitsController::class, 'update']);
        Route::delete('{productiveUnitId}', [ProductiveUnitsController::class, 'destroy']);
    });
});

/*
// Sales routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('sales')->group(function() {
        Route::get('/', [SalesController::class, 'index'])->name('sales');
        Route::get('create/{sowingId}', [SalesController::class, 'create'])->name('sale.create');
        Route::post('store/{sowingId}', [SalesController::class, 'store'])->name('sale.store');
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
*/