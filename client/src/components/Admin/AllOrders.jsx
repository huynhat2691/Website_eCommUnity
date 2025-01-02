import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersAdmin } from "../../redux/actions/order";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

const AdminDashboardOrdersPage = () => {
  const dispatch = useDispatch();
  const { adminOrders } = useSelector((state) => state.order);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(getAllOrdersAdmin());
  }, [dispatch]);

  const getStatusInVietnamese = (status) => {
    const statusMap = {
      Processing: "Đang xử lý",
      "Transferred to delivery partner": "Đã chuyển cho đối tác vận chuyển",
      Shipping: "Đang giao hàng",
      "On the way": "Đang trên đường giao",
      Delivered: "Đã giao hàng",
      Cancelled: "Đã hủy",
      "Processing Refund": "Đang xử lý hoàn tiền",
      "Refund Success": "Hoàn tiền thành công",
    };
    return statusMap[status] || status;
  };

  const filteredOrders = adminOrders?.filter((order) => {
    const statusMatch = filterStatus === "all" || order.status === filterStatus;
    const searchMatch = order.cart.some((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return statusMatch && searchMatch;
  });

  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders?.slice(startIndex, endIndex) || [];

  return (
    <Card className="w-full mx-auto m-4 flex flex-col h-[calc(100vh-6rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quản lý đơn hàng</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Tìm kiếm đơn hàng theo tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Mã đơn hàng</TableHead>
              <TableHead className="max-w-[200px] truncate">Tên sản phẩm</TableHead>
              <TableHead className="w-[200px]">Tên Shop</TableHead>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <span>Trạng thái</span>
                  <Select onValueChange={(value) => setFilterStatus(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Lọc trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả đơn hàng</SelectItem>
                      <SelectItem value="Processing">Đang xử lý</SelectItem>
                      <SelectItem value="Shipping">Đang giao hàng</SelectItem>
                      <SelectItem value="Delivered">Đã giao hàng</SelectItem>
                      <SelectItem value="Refund Success">
                        Hoàn tiền thành công
                      </SelectItem>
                      <SelectItem value="Cancelled">Đã huỷ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead className="text-center">Số lượng</TableHead>
              <TableHead className="text-center">Tổng cộng</TableHead>
              <TableHead className="text-center">Ngày đặt hàng</TableHead>
              <TableHead className="text-center">Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không có đơn hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item._id}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.cart.map((cartItem, index) => (
                      <div key={index}>
                        {cartItem.name}
                        {index < item.cart.length - 1 && <br />}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {item.cart.map((cartItem, index) => (
                      <div key={index}>
                        {cartItem.shop.name}
                        {index < item.cart.length - 1 && <br />}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        item.status === "Delivered" ||
                        item.status === "Refund Success" ||
                        item.status === "Cancelled"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {getStatusInVietnamese(item.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.totalPrice + "₫"}
                  </TableCell>
                  <TableCell className="text-center">
                    {moment(item.createdAt)
                      .tz("Asia/Ho_Chi_Minh")
                      .format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link to={`/admin/order/${item._id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {totalPages > 0 && (
        <div className="mt-auto p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};

export default AdminDashboardOrdersPage;
