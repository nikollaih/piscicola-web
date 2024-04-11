<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class CronJobs extends Controller
{
    //
    public function index() {
        Artisan::call('mqtt:listen');
        return true;
    }
}
