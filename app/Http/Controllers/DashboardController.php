<?php


namespace App\Http\Controllers;

use App\Services\ExpoPushNotificationService;
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

        $this->enviarNotificacion();
        return \inertia('Dashboard', [
            'csrfToken' => csrf_token()
        ]);
    }

    public function enviarNotificacion(): void
    {
        $expoPush = app(ExpoPushNotificationService::class);

        $notifications = [
            [
                'to' => 'ExponentPushToken[3tGKLyEdjFNqlvgxIuUZBM]',
                'title' => 'Hola usuario!',
                'body' => 'Tienes una nueva actualización.',
                'sound' => 'default',
                'data' => ['tipo' => 'mensaje', 'id' => 123]
            ],
            [
                'to' => 'ExponentPushToken[ledRe9Eq9gUwgzCkInQ5YI]',
                'title' => 'Hola usuario!',
                'body' => 'Tienes una nueva actualización.',
                'sound' => 'default',
                'data' => ['tipo' => 'mensaje', 'id' => 123]
            ]
        ];

        $result = $expoPush->send($notifications);

    }
}
