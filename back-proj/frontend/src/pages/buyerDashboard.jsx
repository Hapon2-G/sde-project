import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const { user, refreshUser } = useAuth();
  const { addToCart, getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const fetchProducts = () => {
    axios
      .get("http://localhost:8000/api/products")
      .then((res) => {
        console.log("Products data:", res.data); // Debug: Check the structure
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  };

  useEffect(() => {
    refreshUser();
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, '', 1);
    
    // Show success message
    const productName = product.name.length > 30 
      ? product.name.substring(0, 30) + '...' 
      : product.name;
    alert(`"${productName}" has been added to your cart!`);
    
    console.log("Product added to cart:", product);
  };

  // Function to handle image URL - handles both single image and image arrays
  const getImageUrl = (productImages) => {
    // Handle case where product has image_urls array (from Laravel API)
    if (Array.isArray(productImages) && productImages.length > 0) {
      return productImages[0]; // Laravel already provides full URLs
    }
    
    // Handle case where product has images array
    if (Array.isArray(productImages) && productImages.length > 0) {
      const firstImage = productImages[0];
      return getImagePath(firstImage);
    }
    
    // Handle case where product has single image (string)
    if (typeof productImages === 'string' && productImages) {
      return getImagePath(productImages);
    }
    
    // Fallback for no image
    return "/src/assets/placeholder.jpg";
  };

  // Helper function to construct proper image path
  const getImagePath = (imagePath) => {
    if (!imagePath) {
      return "/src/assets/placeholder.jpg";
    }
    
    // If it's already a full URL (starts with http), return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, prepend the backend URL
    if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
      return `http://localhost:8000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    }
    
    // Default case - assume it's a filename in uploads folder
    return `http://localhost:8000/uploads/${imagePath}`;
  };

  // Handle image load errors
  const handleImageError = (e) => {
    e.target.src = "/src/assets/placeholder.jpg"; // fallback image
    console.log("Image failed to load, using placeholder");
  };

  // Calculate discount price (20% off like in ProductDetails)
  const getDiscountPrice = (originalPrice) => {
    return Math.round(originalPrice * 0.8); // 20% discount
  };

  const getOriginalPrice = (currentPrice) => {
    return Math.round(currentPrice * 1.2); // Reverse calculation to get original price
  };

  return (
    <div className="flex flex-col overflow-clip w-screen h-screen font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[200px] h-208 mt-4 p-4">
          <img
            src="/src/assets/ad.jpg"
            alt="Ad"
            className="object-cover w-full h-full bg-amber-200 rounded-lg"
          />
        </div>

        <div className="flex-1 flex flex-col mt-4 ml-2 mr-4 p-4 overflow-hidden">
          {user?.is_seller && (
            <div className="mb-4">
              <button
                onClick={() => navigate("/add-product")}
                className="px-4 py-2 bg-[#1a2f5d] text-white rounded hover:bg-[#152548]"
              >
                Add Product
              </button>
            </div>
          )}

          <div
            style={{ maxHeight: "calc(96vh - 150px)" }}
            className="grid grid-cols-2 overflow-auto no-scrollbar gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          >
            {products.map((product, index) => (
              <div
                key={product.id || product.product_id || index}
                className="p-2 text-center text-sm bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => {
                  const productId = product.id || product.product_id || index;
                  console.log("Navigating to product:", productId, product);
                  navigate(`/product/${productId}`);
                }}
              >
                <div className="overflow-hidden w-full aspect-square rounded bg-gray-200 flex items-center justify-center relative">
                  <img
                    src={getImageUrl(product.image_urls || product.images || product.image)}
                    alt={product.name || "Product"}
                    className="object-cover w-full h-full"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    20% OFF
                  </div>
                </div>
                <h3 className="mt-2 text-black line-clamp-2">{product.name}</h3>
                
                {/* Price section with discount */}
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-blue-600 font-bold text-base">₱{product.price?.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs line-through">₱{getOriginalPrice(product.price)?.toLocaleString()}</p>
                  </div>
                  <p className="text-green-600 text-xs font-medium">You save ₱{(getOriginalPrice(product.price) - product.price)?.toLocaleString()}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click when clicking button
                    handleAddToCart(product);
                  }}
                  className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shopping Cart Button with Item Count */}
      <button 
        className="flex w-[125px] p-4 bg-[#F6B24D] rounded-xl shadow-lg fixed bottom-10 right-10 items-center justify-center relative hover:bg-[#E5A043] transition-colors"
        onClick={() => navigate('/shopping-cart')}
      >
        <FaShoppingCart size={30} color="black" />
        {getCartItemsCount() > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {getCartItemsCount()}
          </div>
        )}
      </button>

      {user ? (
        <div className="text-center text-lg mt-4">
          <h2
            className="text-blue-700 font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/profile")}
          >
            Welcome, {user.first_name}!
          </h2>
        </div>
      ) : null}
    </div>
  );
}

export default BuyerDashboard;