<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class BuyerDashboardController extends Controller
{
    /**
     * Display the products for the buyer dashboard.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Fetch products from the database
        $products = Product::all();

        // Return the view with products
        return view('buyer.dashboard', compact('products'));
    }

    /**
     * Add product to cart.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addToCart(Request $request)
    {
        // Retrieve the product details from the request
        $productId = $request->input('product_id');
        $product = Product::findOrFail($productId);

        // You can implement cart logic here (e.g., storing in session, database, etc.)
        // Example:
        $cart = session()->get('cart', []);
        $cart[] = $product;

        session()->put('cart', $cart);

        // Return a response indicating success
        return response()->json(['message' => 'Product added to cart', 'cart' => $cart]);
    }
}
