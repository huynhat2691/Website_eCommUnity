/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import {
  BookUser,
  ClipboardList,
  CreditCard,
  Flag,
  Images,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Store,
  Tag,
  TicketPercent,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { adminGetAllProducts } from "../../../redux/actions/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";

const AdminSidebar = ({ active }) => {
  const dispatch = useDispatch();
  const { adminAllProducts } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(adminGetAllProducts());
  }, [dispatch]);

  const pendingProductsCount = adminAllProducts?.filter(
    (product) => product.status === "pending"
  ).length;

  return (
    <div className="w-[16rem] font-medium flex flex-col justify-start bg-white shadow-sm overflow-y-auto sticky top-0 left-0 z-10 h-[calc(100vh-60px)] custom-scrollbar ">
      {/* single item */}
      <div className="w-full flex items-center p-4">
        <Link
          to="/admin/dashboard"
          className="w-full flex items-center font-[600]"
        >
          <LayoutDashboard
            size={20}
            color={`${active === 1 ? "red" : "gray"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 font-[600] text-[gray] ${
              active === 1 ? "text-[red]" : "text-[gray]"
            }`}
          >
            Bảng điều khiển
          </h5>
        </Link>
      </div>

      <Accordion
        defaultValue={[
          "product-management",
          "order-management",
          "sale-management",
          "settings-management",
          "reports-management",
        ]}
        type="multiple"
        className="w-full"
      >
        <AccordionItem value="product-management" className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline ">
            <div className="flex items-center text-[gray] font-[600] ">
              <ShoppingBag size={20} />
              <h5 className="pl-2">Quản lý sản phẩm</h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link
              to="/admin/products"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <div className="flex items-center">
                <h5
                  className={`hidden 800px:block text-[14px] ${
                    active === 7 ? "text-[red]" : "text-black"
                  }`}
                >
                  Danh sách sản phẩm
                </h5>
              </div>
              <div>
                {pendingProductsCount > 0 && (
                  <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {pendingProductsCount}
                  </span>
                )}
              </div>
            </Link>

            <Link
              to="/admin/admin-products"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <div className="flex items-center">
                <h5
                  className={`hidden 800px:block text-[14px] ${
                    active === 13 ? "text-[red]" : "text-black"
                  }`}
                >
                  Danh sách sản phẩm (admin)
                </h5>
              </div>
            </Link>

            <Link
              to="/admin/add-product"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 12 ? "text-[red]" : "text-black"
                }`}
              >
                Thêm sản phẩm (admin)
              </h5>
            </Link>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sale-management" className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center text-[gray] font-[600] ">
              <Tag size={20} />
              <h5 className="pl-2">Quản lý flash sale</h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link
              to="/admin/events"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 8 ? "text-[red]" : "text-black"
                }`}
              >
                Danh sách flash sale
              </h5>
            </Link>

            <Link
              to="/admin/admin-events"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 16 ? "text-[red]" : "text-black"
                }`}
              >
                Danh sách flash sale (admin)
              </h5>
            </Link>

            <Link
              to="/admin/add-event"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 15 ? "text-[red]" : "text-black"
                }`}
              >
                Thêm flash sale (admin)
              </h5>
            </Link>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="order-management" className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center text-[gray] font-[600] ">
              <ClipboardList size={20} />
              <h5 className="pl-2">Quản lý đơn hàng</h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link
              to="/admin/orders"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 4 ? "text-[red]" : "text-black"
                }`}
              >
                Danh sách đơn hàng
              </h5>
            </Link>

            <Link
              to="/admin/admin-orders"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 14 ? "text-[red]" : "text-black"
                }`}
              >
                Danh sách đơn hàng (admin)
              </h5>
            </Link>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="reports-management" className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center text-[gray] font-[600] ">
              <Flag size={20} />
              <h5 className="pl-2">Quản lý báo cáo</h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link
              to="/admin/reports"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 11 ? "text-[red]" : "text-black"
                }`}
              >
                Báo cáo sản phẩm
              </h5>
            </Link>

            <Link
              to="/admin/reports-review"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 18 ? "text-[red]" : "text-black"
                }`}
              >
                Báo cáo đánh giá
              </h5>
            </Link>
          </AccordionContent>
        </AccordionItem>

        {/* <div className="w-full flex items-center p-4">
          <Link to="/admin/reports" className="w-full flex items-center">
            <Flag size={20} color={`${active === 11 ? "red" : "gray"}`} />
            <h5
              className={`hidden 800px:block pl-2 font-[600] text-[gray] ${
                active === 11 ? "text-[red]" : "text-[gray]"
              }`}
            >
              Quản lý báo cáo
            </h5>
          </Link>
        </div> */}

        <div className="w-full flex items-center p-4">
          <Link to="/admin/add-banners" className="w-full flex items-center">
            <Images size={20} color={`${active === 2 ? "red" : "gray"}`} />
            <h5
              className={`hidden 800px:block pl-2 font-[600] text-[gray] ${
                active === 2 ? "text-[red]" : "text-[gray]"
              }`}
            >
              Quản lý banner
            </h5>
          </Link>
        </div>

        <div className="w-full flex items-center p-4">
          <Link
            to="/admin/add-coupons-and-preview"
            className="w-full flex items-center"
          >
            <TicketPercent
              size={20}
              color={`${active === 3 ? "red" : "gray"}`}
            />
            <h5
              className={`hidden 800px:block pl-2 font-[600] text-[gray] ${
                active === 3 ? "text-[red]" : "text-[gray]"
              }`}
            >
              Quản lý vouchers
            </h5>
          </Link>
        </div>

        <div className="w-full flex items-center p-4">
          <Link to="/admin/sellers" className="w-full flex items-center">
            <Store size={20} color={`${active === 5 ? "red" : "gray"}`} />
            <h5
              className={`hidden 800px:block pl-2 font-[600] text-[gray] ${
                active === 5 ? "text-[red]" : "text-[gray]"
              }`}
            >
              Quản lý shop
            </h5>
          </Link>
        </div>

        <div className="w-full flex items-center p-4">
          <Link to="/admin/users" className="w-full flex items-center">
            <BookUser size={20} color={`${active === 6 ? "red" : "gray"}`} />
            <h5
              className={`hidden 800px:block pl-2 font-[600] text-[gray] ${
                active === 6 ? "text-[red]" : "text-[gray]"
              }`}
            >
              Quản lý người dùng
            </h5>
          </Link>
        </div>

        <div className="w-full flex items-center p-4">
          <Link
            to="/admin/withdraw-request"
            className="w-full flex items-center"
          >
            <CreditCard size={20} color={`${active === 9 ? "red" : "gray"}`} />
            <h5
              className={`hidden 800px:block pl-2 font-[600] text-[gray] ${
                active === 9 ? "text-[red]" : "text-[gray]"
              }`}
            >
              Quản lý thanh toán
            </h5>
          </Link>
        </div>

        <AccordionItem value="settings-management" className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center text-[gray] font-[600] ">
              <Settings size={20} />
              <h5 className="pl-2">Cài đặt</h5>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <Link
              to="/admin/shop-settings"
              className="w-full flex items-center p-2 pl-11"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 10 ? "text-[red]" : "text-black"
                }`}
              >
                Cài đặt
              </h5>
            </Link>

            <Link
              to="/admin/shop/66e47c9b81cc1412b8c9edca"
              className="w-full flex items-center p-2 pl-11"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 17 ? "text-[red]" : "text-black"
                }`}
              >
                Cài đặt shop (admin)
              </h5>
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AdminSidebar;
