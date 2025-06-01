import { useState, useEffect } from "react";
import { Home, ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductInfoPage() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [itemVariation, setItemVariation] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");

  const [productImages, setProductImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "N/A"];
  const availableCategories = ["Clothes", "Foods", "End Devices", "Foot Wear", "Jewelry"];

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (productImages.length === 0) {
      setPreviewImages([]);
      return;
    }
    const newPreviews = productImages.map((file) => URL.createObjectURL(file));
    setPreviewImages(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [productImages]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages((prevImages) => [...prevImages, ...files]);
  };

const toggleSize = (size) => {
  if (size === "N/A") {
    setSelectedSizes(["N/A"]);
  } else {
    setSelectedSizes((prev) => {
      const withoutNA = prev.filter((s) => s !== "N/A");
      return prev.includes(size)
        ? withoutNA.filter((s) => s !== size)
        : [...withoutNA, size];
    });
  }
};


  const toggleCategory = (category) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const validateForm = () => {
    const errors = {};
    if (!productName.trim()) errors.productName = "Product name is required";
    if (!productDescription.trim()) errors.productDescription = "Product description is required";
    if (categories.length === 0) errors.categories = "Please select at least one category";
    if (productImages.length === 0) errors.images = "At least one product image is required";
    if (!price.trim()) errors.price = "Price is required";
    if (parseFloat(price) <= 0) errors.price = "Price must be greater than 0";
    if (parseInt(stock) < 0) errors.stock = "Stock cannot be negative";
    return errors;
  };

  const handlePublish = async () => {
    setFormSubmitted(true);
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const formData = new FormData();
        formData.append("name", productName);
        formData.append("description", productDescription);
        formData.append("variation", itemVariation);
        formData.append("color", color);
        formData.append("price", price);
        formData.append("stock", stock);

        categories.forEach((cat, index) => formData.append(`categories[${index}]`, cat));
        selectedSizes.forEach((size, index) => formData.append(`sizes[${index}]`, size));
        productImages.forEach((file) => formData.append("images[]", file));

        await axios.post("http://localhost:8000/api/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        alert("Product published successfully!");
        navigate("/buyer-dashboard");
      } catch (err) {
        console.error(err);
        alert("Failed to publish product");
      }
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      setFormErrors(validateForm());
    }
  }, [productName, productDescription, categories, productImages, price, stock, formSubmitted]);

  return (
    <div className="flex flex-col overflow-hidden w-screen h-screen font-sans">
      {/* Top Navbar */}
      <header className="bg-[#1a2f5d] text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <h1 className="text-lg font-medium">User's Shop Information</h1>
        </div>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/buyer-dashboard")}>
          <Home size={20} />
          <span className="text-sm">Home</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#FAEBD7]">
        <div className="max-w-4xl mx-auto bg-[#FAEBD7] p-4">
          <button
            onClick={handleGoBack}
            className="mb-4 flex items-center text-[#1a2f5d] hover:underline pl-0 -ml-2"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Back</span>
          </button>

          <div className="bg-white p-6 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Product Information</h2>

            {/* Images */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <h3 className="font-medium text-gray-700">Product Images</h3>
                {formErrors.images && (
                  <span className="ml-2 text-red-500 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" /> {formErrors.images}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="w-36 h-36 border border-gray-300 rounded relative">
                    <img src={image} alt={`Product ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setProductImages((imgs) => imgs.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      title="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <label
                  htmlFor="imageUpload"
                  className={`w-36 h-36 border-2 border-dashed ${
                    formErrors.images ? "border-red-500" : "border-gray-300"
                  } rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50`}
                >
                  <Upload size={24} className="mb-1 text-gray-500" />
                  <span className="text-sm text-gray-600">Add Images</span>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-left">
                Upload high-quality product images
              </p>
            </div>

            {/* Product Name */}
            <div className="form-group">
              <label className="font-medium text-gray-700">Product Name</label>
              {formErrors.productName && (
                <span className="ml-2 text-red-500 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-1" /> {formErrors.productName}
                </span>
              )}
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className={`w-full mt-2 border ${
                  formErrors.productName ? "border-red-500" : "border-gray"
                } rounded px-3 py-2 text-black placeholder-black bg-white`}
                placeholder="Enter product name"
              />
            </div>

            {/* Product Description */}
            <div className="form-group mt-4">
              <label className="font-medium text-gray-700">Product Description</label>
              {formErrors.productDescription && (
                <span className="ml-2 text-red-500 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-1" /> {formErrors.productDescription}
                </span>
              )}
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className={`w-full mt-2 border ${
                  formErrors.productDescription ? "border-red-500" : "border-gray-300"
                } rounded px-3 py-2 text-black placeholder-black bg-white`}
                rows={3}
                placeholder="Enter product description"
              />
            </div>

            {/* Other Fields */}
            <div className="form-group mt-4">
              <label className="font-medium text-gray-700">Item Variation</label>
              <input
                type="text"
                value={itemVariation}
                onChange={(e) => setItemVariation(e.target.value)}
                className="w-full mt-2 border border-gray-300 rounded px-3 py-2 text-black placeholder-black bg-white`"
                placeholder="e.g. Long Sleeve"
              />
            </div>

            <div className="form-group mt-4">
  <label className="font-medium text-gray-700">Color</label>
  <input
    type="text"
    value={color}
    onChange={(e) => setColor(e.target.value)}
    className="w-full mt-2 border border-gray-300 rounded px-3 py-2 text-black placeholder-black bg-white"
    placeholder="e.g. Red"
  />
  <div className="mt-2">
    <button
      type="button"
      onClick={() => setColor("N/A")}
      className={`mt-1 px-3 py-1 rounded text-sm ${
        color === "N/A"
          ? "bg-[#1a2f5d] text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      Not Applicable
    </button>
  </div>
</div>


            {/* Categories */}
            <div className="form-group mt-4">
              <label className="font-medium text-gray-700">Categories</label>
              {formErrors.categories && (
                <span className="ml-2 text-red-500 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-1" /> {formErrors.categories}
                </span>
              )}
              <div className="flex flex-wrap gap-3 mt-2">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded ${
                      categories.includes(cat)
                        ? "bg-[#1a2f5d] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="form-group mt-4">
              <label className="font-medium text-gray-700">Sizes</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 rounded ${
                      selectedSizes.includes(size)
                        ? "bg-[#1a2f5d] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Stock */}
            <div className="form-group mt-4">
              <label className="font-medium text-gray-700">Price (₱)</label>
              {formErrors.price && (
                <span className="ml-2 text-red-500 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-1" /> {formErrors.price}
                </span>
              )}
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full mt-2 border ${
                  formErrors.price ? "border-red-500" : "border-gray-300"
                } rounded px-3 py-2 text-black placeholder-black bg-white`}
                placeholder="Enter price"
              />
            </div>

            <div className="form-group mt-4">
              <label className="font-medium text-gray-700">Stock</label>
              {formErrors.stock && (
                <span className="ml-2 text-red-500 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-1" /> {formErrors.stock}
                </span>
              )}
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`w-full mt-2 border ${
                  formErrors.stock ? "border-red-500" : "border-gray-300"
                } rounded px-3 py-2 text-black placeholder-black bg-white`}
                placeholder="Enter stock quantity"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                onClick={handlePublish}
                className="bg-[#1a2f5d] text-white px-6 py-2 rounded hover:bg-[#132347] transition-colors"
              >
                Publish Product
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
