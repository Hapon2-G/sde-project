<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Address;

class AddressController extends Controller
{
    // Fetch addresses for authenticated user
    public function index(Request $request)
    {
        return Address::where('user_id', $request->user()->id)->get();
    }

    // Store new address
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'house_ward' => 'required|string|max:255',
            'district_province' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        $validated['user_id'] = $request->user()->id;

        $address = Address::create($validated);

        return response()->json(['message' => 'Address added successfully', 'address' => $address], 201);
    }

    // Update address
    public function update(Request $request, $id)
    {
        $address = Address::find($id);

        if (!$address || $address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Address not found or unauthorized'], 404);
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'house_ward' => 'required|string|max:255',
            'district_province' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        $address->update($validated);

        return response()->json(['message' => 'Address updated successfully', 'address' => $address]);
    }

    // Delete address
    public function destroy(Request $request, $id)
    {
        $address = Address::find($id);

        if (!$address || $address->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Address not found or unauthorized'], 404);
        }

        $address->delete();

        return response()->json(['message' => 'Address deleted successfully']);
    }
}
