// import Footer from "../../components/Layout/Footer";
// import AdminShopInfo from "./AdminShopInfo";
// import AdminShopCouponData from "./AdminShopCouponData";
// import AdminShopProfileData from "./AdminShopProfileData";
// import AdminHeader from "../../components/Layout/AdminHeader";

// const AdminShopHomePage = () => {
//   const adminShopId = "66e47c9b81cc1412b8c9edca";

//   return (
//     <div>
//       <AdminHeader />
//       <div className="w-full mx-auto">
//         <div className="">
//           <div className="w-full">
//             <AdminShopInfo isOwner={true} id={adminShopId} />
//           </div>
//           <div className="w-[1100px] mx-auto bg-white border my-4 p-3 800px:mt-['unset'] rounded-lg">
//             <AdminShopCouponData id={adminShopId} />
//           </div>
//           <div className="w-[1100px] min-h-screen mx-auto bg-white border my-4 p-3 800px:mt-['unset'] rounded-lg">
//             <AdminShopProfileData isOwner={true} id={adminShopId} />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default AdminShopHomePage;

import AdminShopInfo from "./AdminShopInfo";
import AdminShopCouponData from "./AdminShopCouponData";
import AdminShopProfileData from "./AdminShopProfileData";
import AdminHeader from "../../components/Layout/AdminHeader";
import AdminSidebar from "../../components/Admin/Layout/AdminSidebar";
import { useEffect } from "react";

const AdminShopHomePage = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[80px] 800px:w-[16rem]">
          <AdminSidebar active={17} />
        </div>
        <div className="w-full justify-center scroll-y-auto">
          <div className="w-full">
            <AdminShopInfo isOwner={true} />
          </div>
          <div className="w-[1100px] mx-auto bg-white border my-4 p-3 800px:mt-['unset'] rounded-lg">
            <AdminShopCouponData />
          </div>
          <div className="w-[1100px] min-h-screen mx-auto bg-white border my-4 p-3 800px:mt-['unset'] rounded-lg">
            <AdminShopProfileData isOwner={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminShopHomePage;
