import HomePage from "../pages/homepage";
import UserPage from "../pages/userpage";
import PageLogin from "../pages/loginpage";
import Reset from "../pages/resetpage";
import UpdateProfile from "../pages/updateprofilepage";
import Dashboard from "../pages/dashboard";
import LoginAdmin from "../pages/login_admin";
import AdminSetting from "../pages/adminSetting";
import ProtectedPage from "./protected";
import ProtectedPageUser from "./protected_user";
import Page404 from "../pages/page404";
import AdminCategory from "../pages/adminCategory";
import ListProdukUser from "../pages/listproduct_pageuser";
import RegisterPage from "../pages/register_user";
import AdressPage from "../pages/updateadress_page";
import ListAddressPage from "../pages/listaddress_page";
import ListProduk from "../pages/listproduct_page";
import AddAddressPage from "../pages/addadress_page";
import VerifyEmail from "../pages/verify_email.jsx";
import ResetPassReqPage from "../pages/reset_password_request";
import ResetPassSetPage from "../pages/reset_password_set";
import ConfirmDeliverPage from "../pages/confirmdeliver_page";
import Cart from "../pages/cart";
import Discount from "../pages/discount";
import DetailProduct from "../pages/detail_product";
import AddProductPage from "../pages/addproduct";
import NewOrder from "../pages/neworder_page";
import Upload from "../pages/upload_page";
import Report from "../pages/report";
import RecordStock from "../pages/record_stock"
import AllBranchTrans from "../pages/all_branch_transactions"
import UserTrans from "../pages/user_transactions"

const routes = [
  {
    path: "/userlogin",
    element: (
      <ProtectedPageUser userGuest={true}>
        <PageLogin />
      </ProtectedPageUser>
    ),
  },
  // {
  //   path: "/",
  //   element: <HomePage />,
  // },
  // {
  //   path: "/add-product",
  //   element: <AddProductPage />,
  // },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/record-stock",
    element: <RecordStock />,
  },
  {
    path: "/user-transactions",
    element: <UserTrans />,
  },
  {
    path: "/all-branch-transactions",
    element: <AllBranchTrans />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/reset-password",
    element: <ResetPassReqPage />,
  },
  {
    path: "/confirm-deliver/:noTrans",
    element: <ConfirmDeliverPage />,
  },
  {
    path: "/setup-password",
    element: <ResetPassSetPage />,
  },
  {
    path: "/new-order",
    element: <NewOrder />,
  },
  {
    path: "/upload-payment/:noTrans",
    element: <Upload />,
  },
  {
    path: "/userpage",
    element: (
      <ProtectedPageUser userLogin={true}>
        <UserPage />
      </ProtectedPageUser>
    ),
  },
  {
    path: "/update-address/:id",
    element: (
      <ProtectedPageUser userLogin={true}>
        <AdressPage />
      </ProtectedPageUser>
    ),
  },
  {
    path: "/add-address/:UserId",
    element: (
      <ProtectedPageUser userLogin={true}>
        <AddAddressPage />
      </ProtectedPageUser>
    ),
  },
  {
    path: "/list-address",
    element: (
      <ProtectedPageUser userLogin={true}>
        <ListAddressPage />
      </ProtectedPageUser>
    ),
  },
  {
    path: "/reset",
    element: <Reset />,
  },
  {
    path: "/detail-product/:id",
    element: <DetailProduct />,
  },

  {
    path: "/list-product",
    element: (
      <ProtectedPage adminLogin={true} adminGuest={false}>
        <ListProduk />
      </ProtectedPage>
    ),
  },
  {
    path: "/product-list-user",
    element: <ListProdukUser />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/update-profile",
    element: (
      <ProtectedPageUser userLogin={true}>
        <UpdateProfile />
      </ProtectedPageUser>
    ),
  },
  {
    path: "/admin_login",
    element: (
      <ProtectedPage adminGuest={true}>
        <LoginAdmin />
      </ProtectedPage>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedPage adminLogin={true} adminGuest={false}>
        <Dashboard />
      </ProtectedPage>
    ),
  },
  {
    path: "/admin_setting",
    element: (
      <ProtectedPage adminLogin={true} adminGuest={false} superAdmin={true}>
        <AdminSetting />
      </ProtectedPage>
    ),
  },
  {
    path: "/admin_category",
    element: (
      <ProtectedPage adminLogin={true} adminGuest={false}>
        <AdminCategory />
      </ProtectedPage>
    ),
  },
  {
    path: "/discount_voucher",
    element: (
      <ProtectedPage adminLogin={true} adminGuest={false}>
        <Discount />
      </ProtectedPage>
    ),
  },
  {
    path: "*",
    element: <Page404 />,
  },
  {
    path: "/sales_report",
    element: (
      <ProtectedPage adminLogin={true} adminGuest={false}>
        <Report />
      </ProtectedPage>
    ),
  },
];

export default routes;
