import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./layouts/GuestLayout";
import DefaultLayout from "./layouts/DefaultLayout";
import Login from "./pages/login";
import Welcome from "./pages/WelcomePage";
import CreateAccount from "./pages/CreateAccount";
import ThankYouPage from "./pages/ThankYouPage";
import BuyerDashboard from "./pages/buyerDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProfilePage from "./pages/ProfilePage";
import ProductInfoPage from "./pages/ProductInfoPage";  
import AddressPage from "./pages/AddressPage"; 
import PurchaseHistory from "./pages/PurchaseHistory";
import ShoppingCart from "./pages/ShoppingCart";  
import SellerRegistration from "./pages/SellerRegistration";       
import SellerReg from "./pages/SellerReg";
import ShopInfo from "./pages/ShopInfo";
import MyShopInfo from "./pages/MyShopInfo";
import ProductDetails from "./pages/ProductDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/", element: <Welcome /> },
      { path: "/login", element: <Login /> },
      { path: "/create-account", element: <CreateAccount /> },
      { path: "/thank-you", element: <ThankYouPage /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
    ],
  },
  {
    element: <DefaultLayout />,
    children: [
      { path: "/buyer-dashboard", element: <BuyerDashboard /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/add-product", element: <ProductInfoPage /> },
      { path: "/profile-page-address", element: <AddressPage /> },
      { path: "/purchase-history", element: <PurchaseHistory /> },
      { path: "/my-cart", element: <ShoppingCart /> },
      { path: "/reg", element: <SellerRegistration /> },
      { path: "/seller-registration", element: <SellerReg /> },
      { path: "/shop-info", element: <ShopInfo /> },
      { path: "/myshop-info", element: <MyShopInfo /> },
      { path: "/product/:id", element: <ProductDetails /> },
    ],
  },
]);

export default router;
