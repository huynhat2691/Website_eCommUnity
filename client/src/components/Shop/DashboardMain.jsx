import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  AlertCircle,
  ArrowRight,
  ClipboardList,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { NumericFormat } from "react-number-format";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardMain = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.product);
  const [timeRange, setTimeRange] = useState("monthly");

  const availableBalance = seller?.availableBalance
    ? parseFloat(seller.availableBalance.toString().replace(".", ""))
    : 0;

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  // Xử lý dữ liệu cho biểu đồ doanh thu
  const processRevenueData = () => {
    // Kiểm tra nếu orders không tồn tại hoặc không phải là mảng
    if (!Array.isArray(orders)) {
      return {
        labels: [],
        datasets: [
          {
            label: "Doanh thu",
            data: [],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      };
    }

    // Chỉ tính doanh thu cho các đơn hàng có trạng thái "Delivered"
    const revenueByMonth = orders.reduce((acc, order) => {
      if (order.status === "Delivered") {
        const month = new Date(order.createdAt).getMonth();
        acc[month] = (acc[month] || 0) + order.totalPrice;
      }
      return acc;
    }, {});

    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = labels.map((_, index) => revenueByMonth[index] || 0);

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu",
          data,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  // Xử lý dữ liệu cho biểu đồ sản phẩm bán chạy
  const processTopProductsData = () => {
    if (!products || products.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };
    }
    const productSales = products
      ?.filter((product) => product.sold_out > 0) // Chỉ lấy sản phẩm có sold_out > 0
      .map((product) => ({
        name: product.name,
        sold: product.sold_out,
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return {
      labels: productSales?.map((p) => p.name),
      datasets: [
        {
          data: productSales?.map((p) => p.sold),
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
          ],
        },
      ],
    };
  };

  // Xử lý dữ liệu cho biểu đồ hàng tồn kho
  const processInventoryData = () => {
    const inventory = products
      ?.map((product) => {
        if (product.hasClassifications) {
          // Nếu sản phẩm có classifications, tính tổng stock từ tất cả classifications
          const totalStock = product.classifications.reduce(
            (sum, classification) => sum + classification.stock,
            0
          );
          return {
            name: product.name,
            stock: totalStock,
          };
        } else {
          // Nếu sản phẩm không có classifications, sử dụng trường stock trực tiếp
          return {
            name: product.name,
            stock: product.stock,
          };
        }
      })
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5);

    return {
      labels: inventory?.map((p) => p.name),
      datasets: [
        {
          label: "Số lượng tồn kho",
          data: inventory?.map((p) => p.stock),
          backgroundColor: "rgba(75, 192, 192, 0.8)",
        },
      ],
    };
  };

  // Xử lý dữ liệu cho biểu đồ trạng thái đơn hàng
  const processOrderStatusData = () => {
    // Kiểm tra nếu orders không tồn tại hoặc không phải là mảng
    if (!Array.isArray(orders)) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };
    }

    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusCount);
    const data = labels.map((label) => statusCount[label]);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "rgba(75, 192, 192, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
        },
      ],
    };
  };

  const processProductStatusData = () => {
    if (!Array.isArray(orders) || !Array.isArray(products)) {
      return {
        processing: 0,
        cancelled: 0,
        refunding: 0,
        outOfStock: 0,
      };
    }

    const processingOrders = orders.filter(
      (order) => order.status === "Processing"
    ).length;
    const cancelledOrders = orders.filter(
      (order) => order.status === "Cancelled"
    ).length;
    const refundingOrders = orders.filter(
      (order) => order.status === "Processing Refund"
    ).length;

    const outOfStockProducts = products.reduce((count, product) => {
      if (product.hasClassifications) {
        return (
          count + product.classifications.filter((c) => c.stock === 0).length
        );
      } else {
        return count + (product.stock === 0 ? 1 : 0);
      }
    }, 0);

    return {
      processing: processingOrders,
      cancelled: cancelledOrders,
      refunding: refundingOrders,
      outOfStock: outOfStockProducts,
    };
  };

  const productStatusData = processProductStatusData();

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

  // Đảm bảo rằng các hàm xử lý dữ liệu được gọi an toàn
  const revenueData = orders ? processRevenueData() : null;
  const topProductsData = products ? processTopProductsData() : null;
  const inventoryData = products ? processInventoryData() : null;
  const orderStatusData = orders ? processOrderStatusData() : null;

  return (
    <div className="w-full p-4 bg-gray-50">
      <h3 className="text-3xl font-bold mb-6">Tổng quan</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-500">
              <NumericFormat
                value={availableBalance}
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
            </div>
            <p className="text-xs text-gray-500">(với 4% phí)</p>
            <Link to="/dashboard/withdraw-money">
              <Button variant="outline" className="mt-2">
                Thanh toán
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quản lý đơn hàng
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-500">
              {orders && orders.length}
            </div>
            <Link to="/dashboard/orders">
              <Button variant="outline" className="mt-2">
                Xem đơn hàng
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quản lý sản phẩm
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-500">
              {products && products.length}
            </div>
            <Link to="/dashboard/products">
              <Button variant="outline" className="mt-2">
                Xem sản phẩm
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trạng thái sản phẩm
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold my-2 text-[#27b3e2]">
                  {productStatusData.processing}
                </p>
                <p className="text-sm text-gray-500">Đang xử lý</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold my-2 text-[#27b3e2]">
                  {productStatusData.cancelled}
                </p>
                <p className="text-sm text-gray-500">Đơn hủy</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold my-2 text-[#27b3e2]">
                  {productStatusData.refunding}
                </p>
                <p className="text-sm text-gray-500">
                  Trả hàng/Hoàn tiền chờ xử lý
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold my-2 text-[#27b3e2]">
                  {productStatusData.outOfStock}
                </p>
                <p className="text-sm text-gray-500">Sản phẩm hết hàng</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Doanh thu theo thời gian
            </CardTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Hàng ngày</SelectItem>
                <SelectItem value="weekly">Hàng tuần</SelectItem>
                <SelectItem value="monthly">Hàng tháng</SelectItem>
                <SelectItem value="yearly">Hàng năm</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {revenueData && (
              <Line
                data={revenueData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Sản phẩm bán chạy nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProductsData && (
              <Pie
                data={topProductsData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Lượng hàng tồn kho
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inventoryData && (
              <Bar
                data={inventoryData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Đơn hàng theo trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orderStatusData && (
              <Pie
                data={orderStatusData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Đơn hàng mới nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-center">Số lượng</TableHead>
                <TableHead className="text-center">Tổng cộng</TableHead>
                <TableHead className="text-center">Chi tiết đơn hàng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders &&
                orders.slice(0, 5).map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={
                          order.status === "Delivered"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {getStatusInVietnamese(order.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {order.cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {order.totalPrice}
                      <sup>₫</sup>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link to={`/order/${order._id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMain;
