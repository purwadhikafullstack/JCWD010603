import HomePage from "../pages/homepage";
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
import NewOrder from "../pages/neworder_page";
import Upload from "../pages/upload_page";
import Report from "../pages/report";
import RecordStock from "../pages/record_stock";
import AllBranchTrans from "../pages/all_branch_transactions";
import UserTrans from "../pages/user_transactions";

const routes = [
  {
    path: "/login",
    element: (
      <ProtectedPageUser userGuest={true}>
        <PageLogin />
      </ProtectedPageUser>
    ),
  },
   {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/record-stock",
    element: (
      <ProtectedPage adminLogin={true} adminGuest={false}>
        <RecordStock />
      </ProtectedPage>
    ),
  },
  {
    path: "/user-transactions",
    element: <UserTrans />,
  },
  {
    path: "/all-branch-transactions",
    element: (
      <ProtectedPage adminLogin={true} adminGuest={false}>
        <AllBranchTrans />
      </ProtectedPage>
    ),
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
    element: (
      <ProtectedPageUser userLogin={true}>
        <ConfirmDeliverPage />
      </ProtectedPageUser>
    ),
  },
  {
    path: "/setup-password",
    element: <ResetPassSetPage />,
  },
  {
    path: "/checkout",
    element: (
      <ProtectedPageUser userLogin={true}>
        <NewOrder />
      </ProtectedPageUser>
    ),
  },
  {
    path: "/upload-payment/:id",
    element: (
      <ProtectedPageUser userLogin={true}>
        <Upload />
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
    path: "/password-change",
    element: (
      <ProtectedPageUser userLogin={true}>
        <Reset />
      </ProtectedPageUser>
    ),
  },
  {
    path: "/detail-product/:id",
    element: (
      <ProtectedPageUser userLogin={true}>
        <DetailProduct />
      </ProtectedPageUser>
    ),
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
    path: "/product-list",
    element: <ListProdukUser />,
  },
  {
    path: "/cart",
    element: (
      <ProtectedPageUser userLogin={true}>
        <Cart />
      </ProtectedPageUser>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedPageUser userLogin={true}>
        <UpdateProfile />
      </ProtectedPageUser>
    ),
  },
  {
    path: "/admin-login",
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
    path: "/admin-setting",
    element: (
      <ProtectedPage adminLogin={true} adminGuest={false} superAdmin={true}>
        <AdminSetting />
      </ProtectedPage>
    ),
  },
  {
    path: "/category",
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
    path: "/sales-report",
    element: (
      <ProtectedPage adminLogin={true} adminGuest={false}>
        <Report />
      </ProtectedPage>
    ),
  },
];

export default routes;
