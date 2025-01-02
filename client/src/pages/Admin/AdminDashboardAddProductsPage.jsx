import AdminSidebar from "../../components/Admin/Layout/AdminSidebar";
import AdminHeader from "../../components/Layout/AdminHeader";
import AdminAddProducts from "../../components/Admin/AdminAddProducts";

const AdminDashboardAddProductsPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[80px] 800px:w-[16rem] ">
          <AdminSidebar active={12} />
        </div>
        <div className="w-full justify-center flex">
          <AdminAddProducts />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardAddProductsPage;
