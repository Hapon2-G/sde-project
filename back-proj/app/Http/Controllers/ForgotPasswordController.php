<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordRecoveryMail; // You need to create this mail

class ForgotPasswordController extends Controller
{
    public function sendRecoveryEmail(Request $request)
    {
        // Validate email
        $request->validate([
            'email' => 'required|email|exists:users,email', // Assuming 'users' table has emails
        ]);

        // Send recovery email
        // Assuming you have a PasswordRecoveryMail to handle the email logic
        Mail::to($request->email)->send(new PasswordRecoveryMail($request->email));

        return response()->json(['message' => 'Recovery email sent!'], 200);
    }
}
