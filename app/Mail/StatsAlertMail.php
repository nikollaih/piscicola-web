<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StatsAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public $stat;

    public function __construct($stat)
    {
        $this->stat = $stat;
    }

    public function build()
    {
        return $this->subject('⚠️ No se han detectado lecturas: '.$this->stat->Sowing->Pond->name)
            ->view('emails.stats_alert');
    }
}
