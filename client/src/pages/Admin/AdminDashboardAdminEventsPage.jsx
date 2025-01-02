import AdminSidebar from "../../components/Admin/Layout/AdminSidebar";
import AdminHeader from "../../components/Layout/AdminHeader";
import AdminEvents from "../../components/Admin/AdminEvents";

const AdminDashboardAdminEventsPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[80px] 800px:w-[16rem] ">
          <AdminSidebar active={16} />
        </div>
        <div className="w-full justify-center flex">
          <AdminEvents />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardAdminEventsPage;
