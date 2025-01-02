import AdminHeader from "../../components/Layout/AdminHeader";
import AdminSidebar from "../../components/Admin/Layout/AdminSidebar";
import OrderDetails from "../../components/Admin/OrderDetails";

const AdminDashboardAllOrderDetailsPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[80px] 800px:w-[16rem]">
          <AdminSidebar active={4} />
        </div>
        <div className="w-full justify-center flex">
          <OrderDetails />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardAllOrderDetailsPage;
