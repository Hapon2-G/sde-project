<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PurchaseController extends Controller
{
    // Get authenticated user's purchase history with filtering & pagination
    public function index(Request $request)
    {
        $status = $request->query('status', 'purchased'); // 'purchased', 'cancelled', 'returned'
        
        $purchases = Purchase::where('user_id', Auth::id())
            ->when($status !== 'purchased', fn($q) => $q->where('status', ucfirst($status)))
            ->when($status === 'purchased', fn($q) => $q->where('status', 'Delivered'))
            ->latest()
            ->paginate(5); // Adjust per page count as needed

        return response()->json($purchases);
    }

    // Store a purchase (e.g., simulating a purchase from cart/checkout)
    public function store(Request $request)
    {
        $request->validate([
            'product_name' => 'required|string',
            'product_image' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'status' => 'required|string|in:Delivered,Cancelled,Returned',
        ]);

        $purchase = Purchase::create([
            'user_id' => Auth::id(),
            'product_name' => $request->product_name,
            'product_image' => $request->product_image,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'status' => $request->status,
        ]);

        return response()->json($purchase, 201);
    }

    // Cancel a purchase
    public function cancel($id)
    {
        $purchase = Purchase::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $purchase->status = 'Cancelled';
        $purchase->save();

        return response()->json(['message' => 'Purchase cancelled.']);
    }

    // Return a purchase
    public function return($id)
    {
        $purchase = Purchase::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $purchase->status = 'Returned';
        $purchase->save();

        return response()->json(['message' => 'Purchase returned.']);
    }
}
