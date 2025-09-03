<?php

namespace App\Mail;

use App\Models\ProductiveUnit;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MaintenanceDigestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ProductiveUnit $productiveUnit,
        public array $items,
        public int $daysAhead
    ) {}

    public function build()
    {
        return $this->subject("Mantenimientos próximos - {$this->productiveUnit->name}")
            ->view('emails.maintenance_digest');
    }
}
