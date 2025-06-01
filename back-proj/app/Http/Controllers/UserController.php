<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::all(); // Read all users
    }

    public function store(Request $request)
    {
        return User::create($request->all()); // Create new user
    }

    public function show($id)
    {
        return User::findOrFail($id); // Read one user
    }

    public function update(Request $request, $id)
{
    
    $user = User::findOrFail($id);

    // Validate the incoming request
    $validated = $request->validate([
        'first_name' => 'nullable|string|max:255',
        'last_name' => 'nullable|string|max:255',
        'email' => 'nullable|email|max:255|unique:users,email,' . $id,
        'dob' => 'nullable|date',
        'gender' => 'nullable|string',
        'phone_number' => 'nullable|string|max:20',
        'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',
    ]);

    // Handle profile image upload if present
    if ($request->hasFile('profile_image')) {
        $imagePath = $request->file('profile_image')->store('profile_images', 'public');
        $validated['profile_image'] = $imagePath;
    }

    // Update user record
    $user->update($validated);

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user
    ]);
}

    public function destroy($id)
    {
        return User::destroy($id); // Delete user
    }
}
