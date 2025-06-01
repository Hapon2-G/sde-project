@extends('layouts.app')

@section('content')
    <div class="flex flex-col overflow-clip w-screen h-screen font-sans">
        <x-navbar /> <!-- Include your Navbar component -->

        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar or Ads Section -->
            <div class="w-[200px] h-[208px] mt-4 p-4">
                <img src="/src/assets/ad.jpg" alt="Ad" class="object-cover w-full h-full bg-amber-200 rounded-lg" />
            </div>

            <!-- Product Grid -->
            <div style="max-height: calc(96vh - 70px)" class="flex-1 grid grid-cols-2 overflow-auto mt-4 ml-2 mr-4 p-4 no-scrollbar gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                @foreach ($products as $product)
                    <div class="p-2 text-center text-sm bg-white rounded-lg shadow hover:shadow-lg transition">
                        <div class="overflow-hidden w-full aspect-square rounded">
                            <img src="{{ $product->image }}" alt="{{ $product->name }}" class="object-cover w-full h-full" />
                        </div>
                        <h3 class="mt-2">{{ $product->name }}</h3>
                        <p class="text-orange-600 font-bold">{{ $product->price }}</p>
                        <button 
                            onclick="addToCart({{ $product->id }})" 
                            class="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Add to Cart
                        </button>
                    </div>
                @endforeach
            </div>
        </div>

        <button class="flex w-[125px] p-4 bg-[#F6B24D] rounded-xl shadow-lg fixed bottom-10 right-10 items-center justify-center">
            <x-fa-shopping-cart size="30" color="black" />
        </button>
    </div>

    <script>
        function addToCart(productId) {
            // Add to cart functionality using AJAX
            fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                body: JSON.stringify({ product_id: productId })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message); // You can handle the cart update here
            });
        }
    </script>
@endsection
