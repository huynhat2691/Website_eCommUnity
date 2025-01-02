import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import ShopCouponData from "../../components/Shop/ShopCouponData";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import { useEffect } from "react";

const ShopHomePage = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <DashboardHeader />
      <div className="w-full mx-auto">
        <div className="">
          <div className="w-full">
            <ShopInfo isOwner={true} />
          </div>
          <div className="w-[1100px] mx-auto bg-white border my-4 p-3 800px:mt-['unset'] rounded-lg">
            <ShopCouponData isOwner={true} />
          </div>
          <div className="w-[1100px] min-h-screen mx-auto bg-white border my-4 p-3 800px:mt-['unset'] rounded-lg">
            <ShopProfileData isOwner={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;
