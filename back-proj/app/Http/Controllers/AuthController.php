<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate the request - now accepts email_or_username instead of email
        $request->validate([
            'email_or_username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Determine if input is email or username
        $loginField = filter_var($request->email_or_username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        
        // Find user by email or username
        $user = User::where($loginField, $request->email_or_username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Convert storage path to full URL for profile image
        $profileImageUrl = $user->profile_image
            ? asset('storage/' . $user->profile_image)
            : null;

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username, // Include username in response
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'dob' => $user->dob,
                'address' => $user->address,
                'gender' => $user->gender,
                'phone_number' => $user->phone_number,
                'is_seller' => $user->is_seller,
                'profile_image' => $profileImageUrl,
            ],
            'token' => $token,
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users,username|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|confirmed|min:6',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dob' => 'required|date',
            'address' => 'required|string|max:500',
            'gender' => 'required|string|in:Male,Female,Other',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'message' => 'User registered successfully.',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
            ]
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        
        // Convert storage path to full URL for profile image
        $profileImageUrl = $user->profile_image
            ? asset('storage/' . $user->profile_image)
            : null;

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'dob' => $user->dob,
            'address' => $user->address,
            'gender' => $user->gender,
            'phone_number' => $user->phone_number,
            'is_seller' => $user->is_seller,
            'profile_image' => $profileImageUrl,
        ]);
    }
}