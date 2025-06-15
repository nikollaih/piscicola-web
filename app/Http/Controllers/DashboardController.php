<?php


namespace App\Http\Controllers;

use App\Services\ReconnectionService;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ProductiveUnit;
use App\Models\Sowing;
use App\Models\StatsReading;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        return \inertia('Dashboard', [
            'csrfToken' => csrf_token()
        ]);
    }
}
