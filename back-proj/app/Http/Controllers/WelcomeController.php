<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WelcomeController extends Controller
{
    public function index()
    {
        return response()->json([
        'message' => 'Welcome to the USTP Marketplace!',
    ]);
  }
}
