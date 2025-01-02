import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Loader2, ChevronRight } from "lucide-react";
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
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

const AllCancelledOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch, seller._id]);

  const refundOrders =
    orders && orders.filter((item) => item.status === "Cancelled");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!refundOrders || refundOrders.length === 0) {
    return (
      <Card className="w-full mx-auto m-4">
        <CardHeader>
          <CardTitle>Quản lý đơn huỷ</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Không có đơn hàng bị huỷ nào.</p>
        </CardContent>
      </Card>
    );
  }

  const filteredOrders = refundOrders?.filter((order) =>
    order.cart.some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRefundOrders = filteredOrders.slice(startIndex, endIndex);
  return (
    <Card className="w-full mx-auto m-4 flex flex-col h-[calc(100vh-6rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quản lý đơn huỷ</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm"
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
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Số lượng</TableHead>
              <TableHead className="text-center">Tổng cộng</TableHead>
              <TableHead className="text-center">Chi tiết đơn hàng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRefundOrders.map((order) => (
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
                      order.status === "Cancelled"
                        ? "text-green-500"
                        : "text-orange-500"
                    }
                  >
                    {order.status}
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
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

export default AllCancelledOrders;
