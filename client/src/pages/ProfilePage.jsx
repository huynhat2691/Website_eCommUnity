/* eslint-disable react/prop-types */
import ProfileContent from "../components/Profile/ProfileContent";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import { useState, useEffect } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useLocation } from "react-router-dom";
import CategoriesList from "../components/Layout/CategoriesList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

const routeTranslations = {
  home: "Trang chủ",
  profile: "Hồ sơ",
  account: "Tài khoản",
  orders: "Đơn hàng",
  refunds: "Hoàn tiền",
  inbox: "Hộp thư",
  "track-orders": "Theo dõi đơn hàng",
  "change-password": "Đổi mật khẩu",
  addresses: "Địa chỉ",
  admin: "Quản trị",
  dashboard: "Bảng điều khiển",
};

const Breadcrumbs = ({ path }) => {
  const pathSegments = path.split("/").filter((segment) => segment !== "");

  const getTranslation = (segment) => {
    return routeTranslations[segment] || segment;
  };

  return (
    <Breadcrumb className="flex items-center  mt-4 font-[500]">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{getTranslation("home")}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathSegments.map((segment, index) => (
          <BreadcrumbItem key={index}>
            {index === pathSegments.length - 1 ? (
              <BreadcrumbPage>{getTranslation(segment)}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink
                  href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                >
                  {getTranslation(segment)}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const ProfilePage = () => {
  const [active, setActive] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/profile/account")) setActive(1);
    else if (path.includes("/profile/orders")) setActive(2);
    else if (path.includes("/profile/refunds")) setActive(3);
    else if (path.includes("/profile/inbox")) setActive(4);
    else if (path.includes("/profile/track-orders")) setActive(5);
    else if (path.includes("/profile/change-password")) setActive(6);
    else if (path.includes("/profile/addresses")) setActive(7);
    else if (path.includes("/admin/dashboard")) setActive(8);
  }, [location]);

  return (
    <div>
      <Header />
      <div className="w-[1300px] mx-auto">
        <Breadcrumbs path={location.pathname} />
      </div>
      <div className="w-[1300px] min-h-[700px] flex mx-auto justify-between">
        <div className="w-[250px] sticky top-0">
          <ProfileSidebar active={active} setActive={setActive} />
        </div>
        <div className="w-[1030px] min-h-[700px] flex justify-center my-4 mb-6 bg-white border rounded-lg">
          <div className="w-full h-full p-4 mx-2">
            <ProfileContent active={active} />
          </div>
        </div>
      </div>
      <CategoriesList />
      <Footer />
    </div>
  );
};

export default ProfilePage;
