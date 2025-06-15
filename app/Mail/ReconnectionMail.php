<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReconnectionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reconnection;

    public function __construct($reconnection)
    {
        $this->reconnection = $reconnection;
    }

    public function build()
    {
        return $this->subject('✅ Conexión restablecida después de '.$this->reconnection['duration']. ' minutos')
            ->view('emails.reconnection_alert');
    }
}
