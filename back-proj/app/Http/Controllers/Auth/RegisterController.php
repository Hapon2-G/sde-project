<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|confirmed',
            'first_name' => 'nullable|string',
            'last_name' => 'nullable|string',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
            'gender' => 'nullable|string',
        ]);
        $validated['name'] = $validated['first_name'] . ' ' . $validated['last_name'];


        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
    }
}
