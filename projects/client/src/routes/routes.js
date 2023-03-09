import UserPage from "../pages/userpage";
import PageLogin from "../pages/loginpage";
import Reset from "../pages/resetpage";
import UpdateProfile from "../pages/updateprofilepage";
// import PageCashier from "../pages/pagecashier";
// import PageAddProducts from "../pages/pageaddproduct";
// import ChartComponent from "../components/chart";
// import PageRegister from "../components/register_cashier";
// import PageEdit from "../pages/pageeditproduct";
// import PageEditProduct from "../components/edit_product_per_unit";
// import PageTransaction from "../pages/pagetransaction";
import Dashboard from "../pages/dashboard";
import LoginAdmin from "../pages/login_admin";
import AdminSetting from "../pages/adminSetting";

const routes = [
  {
    path: "/login",
    element: <PageLogin />,
  },
  {

    path: "/userpage",
    element: <UserPage />,
  },
  {
    path: "/reset",
    element: <Reset />,
  },
  {
    path: "/update-profile",
    element: <UpdateProfile />,
  },
  
    path: "/admin",
    element: <Dashboard/>,
  },
  {
    path: "/admin_login",
    element: <LoginAdmin/>,
  },
  {
    path: "/admin_setting",
    element: <AdminSetting/>,
  }
  //   {
  //     path: "/",
  //     element: <ProtectedPage needLogin={true}></ProtectedPage>,
  //   },
];

export default routes;
