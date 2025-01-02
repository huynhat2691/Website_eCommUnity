import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";
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
import { ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="w-full mx-auto m-4">
        <CardHeader>
          <CardTitle>Quản lý đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Không có đơn hàng nào.</p>
        </CardContent>
      </Card>
    );
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const filterOrders = (status, searchTerm) => {
    let filtered = orders;
    if (status !== "all") {
      filtered = filtered.filter((order) => order.status === status);
    }
    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.cart.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return filtered;
  };

  const filteredOrders = filterOrders(activeTab, searchTerm);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const renderOrderCards = (filteredOrders) => {
    if (!filteredOrders || filteredOrders.length === 0) {
      return (
        <div className="w-full mx-auto m-4">
          <CardContent>
            <p>Không có đơn hàng nào.</p>
          </CardContent>
        </div>
      );
    }
  };

  return (
    <Card className="w-full mx-auto m-4 flex flex-col h-[calc(100vh-6rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quản lý đơn hàng</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm"
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow !py-0">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="w-1/6">
              Tất cả đơn hàng
            </TabsTrigger>
            <TabsTrigger value="Processing" className="w-1/6">
              Đang xử lý
            </TabsTrigger>
            <TabsTrigger value="Shipping" className="w-1/6">
              Đang giao hàng
            </TabsTrigger>
            <TabsTrigger value="Delivered" className="w-1/6">
              Đã giao hàng
            </TabsTrigger>
            <TabsTrigger value="Cancelled" className="w-1/6">
              Đã hủy
            </TabsTrigger>
            <TabsTrigger value="Refund Success" className="w-1/6">
              Trả hàng/Hoàn tiền
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-center">Số lượng</TableHead>
                  <TableHead className="text-center">Tổng cộng</TableHead>
                  <TableHead className="text-center">
                    Chi tiết đơn hàng
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderOrderCards(filterOrders(activeTab))}
                {currentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      {order.cart.map((cartItem, index) => (
                        <div key={index}>
                          {cartItem.name}
                          {index < order.cart.length - 1 && <br />}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          order.status === "Delivered" ||
                          order.status === "Refund Success"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {getStatusInVietnamese(order.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {order.cart.length}
                    </TableCell>
                    <TableCell className="text-center">
                      {order.totalPrice}
                      <sup>₫</sup>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link to={`/order/${order._id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight size={20} />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
      <div className="mt-auto p-4 border-t">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
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
    </Card>
  );
};

export default AllOrders;
