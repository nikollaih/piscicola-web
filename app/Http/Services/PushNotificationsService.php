<?php

namespace App\Http\Services;

use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Laravel\Firebase\Facades\Firebase;

class PushNotificationsService
{

    private \Kreait\Firebase\Contract\Messaging $notification;

    public function __construct()
    {
        $this->notification = Firebase::messaging();
    }

    // Send a push notification to the provided token
    public function sendNotification(string $fcm_token, string $title, string $body) {

        $message = CloudMessage::fromArray([
            'token' => $fcm_token,
            'notification' => [
                'title' => $title,
                'body' => $body
            ],
        ]);

        $this->notification->send($message);
    }

}
