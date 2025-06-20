<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ExpoPushNotificationService
{
    protected string $endpoint;

    public function __construct()
    {
        $this->endpoint = 'https://exp.host/--/api/v2/push/send';
    }

    /**
     * Envía una o varias notificaciones.
     *
     * @param array $notifications
     * @return array
     */
    public function send(array $notifications): array
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Accept-Encoding' => 'gzip, deflate',
            'Content-Type' => 'application/json',
        ])->post($this->endpoint, $notifications);

        return [
            'status' => $response->status(),
            'body' => $response->json(),
        ];
    }
}
