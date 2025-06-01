<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Models\Seller;

class SellerController extends Controller
{
    public function register(Request $request)
    {
        $user = auth()->user();

        // Check if user is already registered as a seller
        if ($user->seller) {
            return response()->json([
                'message' => 'You are already registered as a seller.'
            ], 409);
        }

        $validated = $request->validate([
            'shopName' => 'required|string|max:255',
            'email' => 'required|email|unique:sellers,email',
            'idType' => 'required|string|max:255',
            'idNumber' => 'required|string|max:255',
            'houseAndWard' => 'required|string',
            'districtAndProvince' => 'required|string',
            'photoId' => 'required|image|mimes:jpeg,png,jpg|max:10240',
            'phoneNumber' => 'required|string|max:20',
        ]);

        $user->is_seller = true;
        $user->save();

        $photoPath = $request->file('photoId')->store('ids', 'public');

        $seller = Seller::create([
            'user_id' => $user->id,
            'shop_name' => $validated['shopName'],
            'email' => $validated['email'],
            'id_type' => $validated['idType'],
            'id_number' => $validated['idNumber'],
            'house_and_ward' => $validated['houseAndWard'],
            'district_and_province' => $validated['districtAndProvince'],
            'photo_id' => $photoPath,
            'phone_number' => $validated['phoneNumber'],
        ]);

        return response()->json([
            'message' => 'Seller registered successfully',
            'seller' => $seller
        ]);
    }

    public function getInfo()
    {
        $user = Auth::user();

        if (!$user->seller) {
            return response()->json(['message' => 'Seller info not found.'], 404);
        }

        $seller = $user->seller;

        return response()->json([
            'shop_name' => $seller->shop_name,
            'email' => $seller->email,
            'id_type' => $seller->id_type,
            'house_and_ward' => $seller->house_and_ward,
            'id_number' => $seller->id_number,
            'district_and_province' => $seller->district_and_province,
            'phone_number' => $seller->phone_number,
            'photo_id' => $seller->photo_id,
            'photo_id_url' => $seller->photo_id ? asset('storage/' . $seller->photo_id) : null,
            'last_updated_at' => $seller->last_updated_at,
        ]);
    }

    public function updateInfo(Request $request)
    {
        $user = Auth::user();

        if (!$user->seller) {
            return response()->json(['message' => 'Seller info not found.'], 404);
        }

        $validated = $request->validate([
            'shopName' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('sellers')->ignore($user->seller->id),
            ],
            'idType' => 'sometimes|string|max:255',
            'idNumber' => 'sometimes|string|max:255',
            'houseAndWard' => 'sometimes|string|max:255',
            'districtAndProvince' => 'sometimes|string|max:255',
            'phoneNumber' => 'sometimes|string|max:20',
            'photoId' => 'nullable|image|mimes:jpeg,png,jpg|max:10240',
        ]);

        $seller = $user->seller;

        $seller->shop_name = $validated['shopName'] ?? $seller->shop_name;
        $seller->email = $validated['email'] ?? $seller->email;
        $seller->id_type = $validated['idType'] ?? $seller->id_type;
        $seller->id_number = $validated['idNumber'] ?? $seller->id_number;
        $seller->house_and_ward = $validated['houseAndWard'] ?? $seller->house_and_ward;
        $seller->district_and_province = $validated['districtAndProvince'] ?? $seller->district_and_province;
        $seller->phone_number = $validated['phoneNumber'] ?? $seller->phone_number;

        if ($request->hasFile('photoId')) {
            $photoPath = $request->file('photoId')->store('ids', 'public');
            $seller->photo_id = $photoPath;
        }

        $seller->last_updated_at = now();
        $seller->save();

        return response()->json([
            'message' => 'Seller information updated successfully.',
            'photo_id_url' => $seller->photo_id ? asset('storage/' . $seller->photo_id) : null
        ]);
    }

    public function checkStatus()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated'
            ], 401);
        }

        $isSeller = (bool) $user->seller;
        if (!$isSeller) {
            return response()->json([
                'message' => 'User is not registered as a seller',
                'is_seller' => false
            ], 404);
        }

        return response()->json([
            'is_seller' => true,
            'seller_info' => [
                'shop_name' => $user->seller->shop_name,
                'email' => $user->seller->email,
                'status' => 'active'
            ] 
        ]);
    }

    // Add this method below
    public function publicInfoByUserId($userId)
    {
        $seller = Seller::where('user_id', $userId)->first();

        if (!$seller) {
            return response()->json(['message' => 'Seller not found.'], 404);
        }

        return response()->json([
            'shop_name' => $seller->shop_name,
            'email' => $seller->email,
            'phone_number' => $seller->phone_number,
            'house_and_ward' => $seller->house_and_ward,
            'district_and_province' => $seller->district_and_province,
            'id_type' => $seller->id_type,
            'id_number' => $seller->id_number,
            'photo_id_url' => $seller->photo_id ? asset('storage/' . $seller->photo_id) : null,
            'last_updated_at' => $seller->last_updated_at ? $seller->last_updated_at->toIso8601String() : null,
        ]);
    }
}
