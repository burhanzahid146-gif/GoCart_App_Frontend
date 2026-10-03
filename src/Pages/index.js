import AdminDashboard from "./adminDashboard/AdminDashboard";
import AdminProfile from "./adminProfile/AdminProfile";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import  authenticationSlice  from "./features/authenticationSlice/authenticationSlice";
import HelpCentre from "./HelpCenter/hlpCenter";
import Homepage from "./Home/Homepage";
import OrdersPage from "./OrdersPage/OrderPage";
import PaymentPage from "./Paymentpage/Paymentpage";
import Productlist from "./Productlists/Productlist"
import OrderDetail from "./Orderdetail.jsx/Orderdetail"
import Profile from "./Profile/Profile";

export { Login , Register, Homepage , AdminDashboard ,
    AdminProfile , authenticationSlice , HelpCentre , 
    OrdersPage , PaymentPage , Productlist , OrderDetail , Profile
}