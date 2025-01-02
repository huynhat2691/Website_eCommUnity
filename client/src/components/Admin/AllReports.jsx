import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../server";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../redux/actions/product";
import { Label } from "../ui/label";

const AllReports = () => {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;
  const dispatch = useDispatch();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${server}/report/admin/reports`);
      setReports(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách báo cáo:", error);
      toast.error("Không thể tải danh sách báo cáo");
    }
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await axios.put(`${server}/report/report-product/${reportId}`, {
        status: newStatus,
      });
      fetchReports();
      toast.success("Cập nhật trạng thái báo cáo thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái báo cáo:", error);
      toast.error("Cập nhật trạng thái báo cáo thất bại");
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await axios.delete(`${server}/report/report-product/${reportId}`);
      fetchReports();
      toast.success("Xóa báo cáo thành công");
    } catch (error) {
      console.error("Lỗi khi xóa báo cáo:", error);
      toast.error("Xóa báo cáo thất bại");
    }
  };

  const handleDeleteProduct = (productId) => {
    dispatch(deleteProduct(productId))
      .then(() => {
        toast.success("Xóa sản phẩm thành công");
        fetchReports();
      })
      .catch((error) => {
        toast.error("Xóa sản phẩm thất bại: " + error.message);
      });
  };

  if (!reports || reports.length === 0) {
    return (
      <Card className="w-full mx-auto m-4">
        <CardHeader>
          <CardTitle>Quản lý báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Không có báo cáo vi phạm nào.</p>
        </CardContent>
      </Card>
    );
  }

  const filteredReports = reports.filter((report) => {
    if (report.productId && report.productId._id && report.productId.name) {
      return (
        report.productId._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.productId.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return false;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  return (
    <Card className="w-full mx-auto m-4 flex flex-col h-[calc(100vh-6rem)]">
      <CardHeader>
        <CardTitle>Quản lý báo cáo sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className="flex-growpt-4">
        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm theo ID hoặc tên sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Sản phẩm</TableHead>
              <TableHead className="text-center">Tên sản phẩm</TableHead>
              <TableHead className="text-center">Tên shop</TableHead>
              <TableHead className="text-center">Xem sản phẩm</TableHead>
              <TableHead className="text-center">Lý do</TableHead>
              <TableHead className="text-center">Mô tả</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentReports.map((report) => (
              <TableRow key={report._id}>
                <TableCell>{report.productId._id}</TableCell>
                <TableCell className="text-center truncate max-w-[250px]">
                  {report.productId.name}
                </TableCell>
                <TableCell className="text-center ">
                  {report.productId.shop.name}
                </TableCell>
                <TableCell className="text-center">
                  <Link to={`/product/${report.productId._id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
                <TableCell className="text-center">{report.reason}</TableCell>
                <TableCell className="text-center">
                  {report.description}
                </TableCell>
                <TableCell className="text-center flex items-center justify-center">
                  <Select
                    defaultValue={report.status}
                    onValueChange={(value) =>
                      handleUpdateStatus(report._id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chưa giải quyết</SelectItem>
                      <SelectItem value="resolved">Đã giải quyết</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center w-[180px]">
                  {report.status === "pending" && (
                    <Label variant="outline" size="sm">
                      Chọn trạng thái
                    </Label>
                  )}
                  {report.status === "resolved" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(report.productId._id)}
                      className="w-full"
                    >
                      Xóa sản phẩm
                    </Button>
                  )}
                  {report.status === "rejected" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteReport(report._id)}
                      className="w-full"
                    >
                      Xóa báo cáo
                    </Button>
                  )}
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
    </Card>
  );
};

export default AllReports;
