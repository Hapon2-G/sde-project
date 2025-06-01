<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('images')->get();

        $products->transform(function ($product) {
            $product->image_urls = $product->images->map(function ($image) {
                return asset('storage/' . $image->path);
            });
            unset($product->images);
            return $product;
        });

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Transform the product to include image URLs
        $product->image_urls = $product->images->map(function ($image) {
            return asset('storage/' . $image->path);
        });

        // Decode JSON fields for better frontend handling
        $product->categories = json_decode($product->categories, true) ?? [];
        $product->sizes = json_decode($product->sizes, true) ?? [];

        // Remove the images relationship to avoid duplication
        unset($product->images);

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'categories' => 'required|array',
            'variation' => 'nullable|string',
            'sizes' => 'nullable|array',
            'color' => 'nullable|string',
            'price' => 'required|numeric|min:0.01',
            'stock' => 'required|integer|min:0',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $product = Product::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'description' => $validated['description'],
            'categories' => json_encode($validated['categories']),
            'variation' => $validated['variation'] ?? null,
            'sizes' => isset($validated['sizes']) ? json_encode($validated['sizes']) : null,
            'color' => $validated['color'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('product_images', 'public');
                $product->images()->create([
                    'path' => $path,
                ]);
            }
        }

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load('images'),
        ]);
    }
}