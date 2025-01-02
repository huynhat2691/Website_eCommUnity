import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEventsAdmin } from "../../redux/actions/event";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Loader from "../Layout/Loader";
import { Eye, Trash } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import { Input } from "../ui/input";

const AdminEvents = () => {
  const { adminEvents, isLoading } = useSelector((state) => state.event);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [eventCount, setEventCount] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(getAllEventsAdmin());
  }, [dispatch, seller?._id]);

  useEffect(() => {
    if (adminEvents) {
      setEventCount(adminEvents.length);
    }
  }, [adminEvents]);

  const handleDelete = (_id) => {
    dispatch(deleteEvent(_id))
      .then(() => {
        toast.success("Xóa sản phẩm thành công");
        if (currentEvents.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      })
      .catch((error) => {
        toast.error("Xóa sản phẩm thất bại: " + error.message);
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!adminEvents || adminEvents.length === 0) {
    return (
      <Card className="w-full mx-auto m-4">
        <CardHeader>
          <CardTitle>Quản lý flash sale</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Không có sự kiện sale nào.</p>
        </CardContent>
      </Card>
    );
  }

  const filteredEvents = adminEvents.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  return (
    <Card className="w-full mx-auto m-4 flex flex-col h-[calc(100vh-6rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quản lý flash sale</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
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
              <TableHead>Mã sản phẩm</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Giá sản phẩm</TableHead>
              <TableHead className="text-center">Số lượng</TableHead>
              <TableHead className="text-center">Đã bán</TableHead>
              <TableHead className="text-center">Xem sản phẩm</TableHead>
              <TableHead className="text-center">Xoá sản phẩm</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEvents.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item._id}</TableCell>
                <TableCell className="max-w-[200px] truncate">{item.name}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-center">{item.stock}</TableCell>
                <TableCell className="text-center">{item.sold_out}</TableCell>
                <TableCell className="text-center">
                  <Link to={`/product/${item._id}?isEvent=true`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
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

export default AdminEvents;
