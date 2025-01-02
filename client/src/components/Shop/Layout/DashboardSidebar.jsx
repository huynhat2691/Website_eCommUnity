/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShoppingBag,
  Tag,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { useSelector, useDispatch } from "react-redux";
import { markCancelledOrdersAsViewed } from "../../../redux/actions/order";

const DashboardSidebar = ({ active }) => {
  const { seller } = useSelector((state) => state.seller);
  const { orders, viewedCancelledOrders } = useSelector((state) => state.order);
  const [newOrders, setNewOrders] = useState(0);
  const [refundOrders, setRefundOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (orders) {
      const countOrders = () => {
        let newCount = 0;
        let refundCount = 0;
        let cancelCount = 0;

        // Sắp xếp đơn hàng theo thời gian tạo, mới nhất lên đầu
        const sortedOrders = [...orders].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        sortedOrders.forEach((order) => {
          if (
            order.status === "Processing" ||
            order.status === "Processing Refund"
          ) {
            newCount++;
          }
          if (order.status === "Processing Refund") {
            refundCount++;
          }
          if (
            order.status === "Cancelled" &&
            !viewedCancelledOrders.includes(order._id)
          ) {
            cancelCount++;
          }
        });

        setNewOrders(newCount);
        setRefundOrders(refundCount);
        setCancelledOrders(cancelCount);
      };

      countOrders();
    }
  }, [orders, viewedCancelledOrders]);

  useEffect(() => {
    if (location.pathname === "/dashboard/cancelled-orders") {
      const cancelledOrders = orders
        ?.filter((order) => order.status === "Cancelled")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (cancelledOrders.length > 0) {
        dispatch(markCancelledOrdersAsViewed([cancelledOrders[0]._id]));
      }
    }
  }, [location.pathname, orders, dispatch]);

  const handleOrderView = (orderId, status) => {
    if (status === "Cancelled") {
      dispatch(markCancelledOrdersAsViewed([orderId]));
    }
  };

  const NotificationDot = ({ count }) =>
    count > 0 && (
      <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
        {count}
      </span>
    );

  return (
    <div className="w-[16rem] font-medium flex flex-col justify-start bg-white shadow-sm overflow-y-auto sticky top-0 left-0 z-10 h-[calc(100vh-60px)] custom-scrollbar ">
      {/* single item */}
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard" className="w-full flex items-center font-[600]">
          <LayoutDashboard
            size={20}
            color={`${active === 1 ? "red" : "gray"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 ${
              active === 1 ? "text-[red]" : "text-[gray]"
            }`}
          >
            Bảng điều khiển
          </h5>
        </Link>
      </div>

      <Accordion
        defaultValue={[
          "order-management",
          "product-management",
          "sales-management",
          "settings-management",
          "customers-management",
        ]}
        type="multiple"
        className="w-full"
      >
        <AccordionItem value="order-management" className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline ">
            <div className="flex items-center text-[gray] font-[600] ">
              <ClipboardList size={20} />
              <h5 className="pl-2">Quản Lý Đơn Hàng</h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link
              to="/dashboard/orders"
              className="w-full flex items-center p-2 pl-11 justify-between"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 2 ? "text-[red]" : "text-black"
                }`}
              >
                Danh Sách Đơn Hàng
              </h5>
              <NotificationDot count={newOrders} />
            </Link>

            <Link
              to="/dashboard/refunds"
              className="w-full flex items-center p-2 pl-11"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 3 ? "text-[red]" : "text-black"
                }`}
              >
                Trả Hàng/Hoàn Tiền
              </h5>
              <NotificationDot count={refundOrders} />
            </Link>

            <Link
              to="/dashboard/cancelled-orders"
              className="w-full flex items-center p-2 pl-11"
              onClick={() => handleOrderView(null, "Cancelled")}
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 13 ? "text-[red]" : "text-black"
                }`}
              >
                Đơn huỷ
              </h5>
              <NotificationDot count={cancelledOrders} />
            </Link>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="product-management" className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center text-[gray] font-[600] ">
              <ShoppingBag size={20} />
              <h5 className="pl-2">Quản Lý Sản Phẩm</h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link
              to="/dashboard/products"
              className="w-full flex items-center p-2 pl-11"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 4 ? "text-[red]" : "text-black"
                }`}
              >
                Danh Sách Sản Phẩm
              </h5>
            </Link>
            <Link
              to="/dashboard/add-product"
              className="w-full flex items-center p-2 pl-11"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 5 ? "text-[red]" : "text-black"
                }`}
              >
                Thêm Sản Phẩm
              </h5>
            </Link>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sales-management" className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center text-[gray] font-[600] ">
              <Tag size={20} />
              <h5 className="pl-2">Kênh Marketing</h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link
              to="/dashboard/events"
              className="w-full flex items-center p-2 pl-11"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 6 ? "text-[red]" : "text-black"
                }`}
              >
                Flash Sale Của Shop
              </h5>
            </Link>
            <Link
              to="/dashboard/add-event"
              className="w-full flex items-center p-2 pl-11"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 7 ? "text-[red]" : "text-black"
                }`}
              >
                Thêm Flash Sale
              </h5>
            </Link>
            <Link
              to="/dashboard/coupons"
              className="w-full flex items-center p-2 pl-11"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 8 ? "text-[red]" : "text-black"
                }`}
              >
                Mã Giảm Giá Của Shop
              </h5>
            </Link>
          </AccordionContent>
        </AccordionItem>

        <div className="w-full flex items-center p-4 font-[600]">
          <Link
            to="/dashboard/withdraw-money"
            className="w-full flex items-center "
          >
            <CreditCard size={20} color={`${active === 9 ? "red" : "gray"}`} />
            <h5
              className={`hidden 800px:block pl-2 ${
                active === 9 ? "text-[red]" : "text-[gray]"
              }`}
            >
              Thanh toán
            </h5>
          </Link>
        </div>

        <AccordionItem value="customers-management" className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center text-[gray] font-[600] ">
              <MessageSquare size={20} />
              <h5 className="pl-2">Chăm sóc khách hàng</h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link
              to="/dashboard/messages"
              className="w-full flex items-center p-2 pl-11"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 10 ? "text-[red]" : "text-black"
                }`}
              >
                Quản Lý Tin Nhắn
              </h5>
            </Link>
            <Link
              to="/dashboard/ratings"
              className="w-full flex items-center p-2 pl-11"
            >
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 11 ? "text-[red]" : "text-black"
                }`}
              >
                Quản Lý Đánh Giá
              </h5>
            </Link>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="settings-management" className="border-none">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center text-[gray] font-[600] ">
              <Settings size={20} />
              <h5 className="pl-2">Quản Lý Shop</h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Link to="/settings" className="w-full flex items-center p-2 pl-11">
              <h5
                className={`hidden 800px:block text-[14px] ${
                  active === 12 ? "text-[red]" : "text-black"
                }`}
              >
                Hồ Sơ Shop
              </h5>
            </Link>
            <Link
              to={`/shop/${seller?._id}`}
              className="w-full flex items-center p-2 pl-11"
            >
              <h5 className="text-black">Tổng Quan Shop</h5>
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DashboardSidebar;
