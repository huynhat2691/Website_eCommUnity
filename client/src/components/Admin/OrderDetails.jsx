import { getAllOrdersOfShop } from "../../redux/actions/order";
import { backend_url } from "../../server";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ClipboardList } from "lucide-react";
import { Button } from "../ui/button";
import moment from "moment-timezone";
import { NumericFormat } from "react-number-format";
import { Separator } from "../ui/separator";

const OrderDetails = () => {
  const {
    adminOrders,
    // isLoading
  } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const data = adminOrders && adminOrders.find((item) => item._id === id);

  const getStatusInVietnamese = (status) => {
    const statusMap = {
      Processing: "Đang xử lý",
      "Transferred to delivery partner": "Đã chuyển cho đối tác vận chuyển",
      Shipping: "Đang giao hàng",
      "On the way": "Đang trên đường giao đến khách hàng",
      Delivered: "Đã giao hàng",
      Cancelled: "Đã hủy",
      "Processing Refund": "Đang xử lý hoàn tiền",
      "Refund Success": "Hoàn tiền thành công",
    };
    return statusMap[status] || status;
  };

  return (
    <Card className="w-full mx-auto m-4 flex flex-col h-[calc(100vh-6rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ClipboardList size={25} color="red" />
            <CardTitle className="pl-2 text-2xl">Chi tiết đơn hàng</CardTitle>
          </div>
          <Link to="/admin/orders">
            <Button variant="outline">Danh sách đơn hàng</Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col !justify-between h-full">
        <div className="flex items-center justify-between pt-6">
          <p className="text-muted-foreground">
            Mã đơn hàng: <span>#{data?._id?.slice(0, 8)}</span>
          </p>
          <p className="text-muted-foreground">
            Ngày đặt hàng:{" "}
            <span>
              {moment(data?.createdAt)
                .tz("Asia/Ho_Chi_Minh")
                .format("DD-MM-YYYY | HH:mm")}
            </span>
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {data &&
            data?.cart.map((item, index) => (
              <div key={index} className="flex items-start">
                <img
                  src={`${backend_url}/${item.images[0]}`}
                  alt=""
                  className="size-20 object-cover"
                />
                <div className="ml-3">
                <div className="flex items-center">
                    {item.isUsed && (
                      <div className="mr-1">
                        <p className="text-xs border-[red] border font-semibold text-[red] mt-[2px] px-[2px]">
                          Hàng cũ
                        </p>
                      </div>
                    )}
                    <p className="text-lg font-medium">{item.name}</p>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <NumericFormat
                      value={
                        item.hasClassifications
                          ? item.selectedClassification.discountPrice
                          : item.discountPrice
                      }
                      displayType={"text"}
                      thousandSeparator={"."}
                      decimalSeparator={","}
                      decimalScale={0}
                      renderText={(value) => (
                        <p>
                          {value}
                          <sup>₫</sup>
                        </p>
                      )}
                    />
                    <p className="mx-1">x</p>
                    {item.quantity}
                  </div>
                  {item.hasClassifications ? (
                    <p className="text-sm text-muted-foreground">
                      {item.selectedClassification.group1} -{" "}
                      {item.selectedClassification.group2}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Không có phân loại
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div className="mt-8 border-t p-4 flex items-center justify-end text-[18px]">
          <p className="mr-2 font-[500]">Tổng cộng:</p>
          {data?.totalPrice}
          <sup>₫</sup>
        </div>

        <div className="m-10 flex-col md:flex-row ">
          <div className="flex items-center text-[18px] ">
            <p className="font-semibold mr-2">Người đặt hàng:</p>
            <p>{data?.user?.name}</p>
            <Separator className="mx-2" orientation="vertical" />
            <p>
              0
              {data?.user?.phoneNumber
                ? data?.user?.phoneNumber
                : data?.shippingAddress?.phoneNumber}
            </p>
          </div>
          <div className="mt-6 w-full md:w-3/5 flex items-start text-[18px] ">
            <h4 className="font-semibold mr-2">Địa chỉ giao hàng:</h4>
            <div className="flex flex-col items-start">
              <p>{data?.shippingAddress?.address1},</p>
              <p>
                {data?.shippingAddress?.ward}, {data?.shippingAddress?.district}
                , {data?.shippingAddress?.province}
              </p>
            </div>
          </div>
          <div className="!mt-6 md:mt-0 w-full md:w-2/5 flex items-center text-[18px]">
            <h4 className="font-semibold mr-2 ">Thông tin thanh toán:</h4>
            <p className="">{data?.paymentInfo?.type}</p>
          </div>

          <div className="flex items-center mt-6">
            <h4 className="text-[18px] font-semibold">Trạng thái đơn hàng: </h4>
            <p className="ml-2 text-[18px] font-[500]">
              <span
                className={
                  data?.status === "Delivered" || data?.status === "Refund Success" || data?.status === "Cancelled"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {getStatusInVietnamese(data?.status)}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
