<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class PasswordRecoveryMail extends Mailable
{
    use Queueable, SerializesModels;

    public $email;
    public $resetUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($email)
    {
        $this->email = $email;
        
        // Generate a signed URL that expires in 60 minutes
        $this->resetUrl = URL::temporarySignedRoute(
            'password.reset.form',
            Carbon::now()->addMinutes(60),
            ['email' => $email]
        );
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Password Reset Request',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.password_recovery',
            with: [
                'email' => $this->email,
                'resetUrl' => $this->resetUrl,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}