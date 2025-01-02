import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { Eye, Trash, ImageIcon, Loader2 } from "lucide-react";
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
  adminGetAllProducts,
  updateProductStatus,
  deleteProduct,
  adminUpdateProductStatus,
} from "../../redux/actions/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { backend_url } from "../../server";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminAllProducts, isLoading } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(adminGetAllProducts());
  }, [dispatch]);

  const handleDelete = (_id) => {
    dispatch(deleteProduct(_id))
      .then(() => {
        toast.success("Xóa sản phẩm thành công");
        if (currentProducts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      })
      .catch((error) => {
        toast.error("Xóa sản phẩm thất bại: " + error.message);
      });
  };

  const statusToVietnamese = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
  };

  const statusColors = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
    approved: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
  };

  const handleViewProduct = (item) => {
    if (item.status === "approved") {
      navigate(`/product/${item._id}`);
    }
  };

  const handleStatusChange = (_id, status) => {
    dispatch(updateProductStatus(_id, status))
      .then(() => {
        dispatch(adminUpdateProductStatus(_id, status));
        toast.success(
          `Trạng thái sản phẩm đã được cập nhật thành ${statusToVietnamese[status]}`
        );
      })
      .catch((error) =>
        toast.error("Cập nhật trạng thái sản phẩm thất bại: " + error.message)
      );
  };

  // Thêm hàm này để xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Cập nhật logic lọc sản phẩm
  const filteredProducts = adminAllProducts?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts?.slice(startIndex, endIndex);

  const getPrice = (item) => {
    if (item.hasClassifications) {
      return item.classifications[0]?.price || 0;
    }
    return item.price || 0;
  };

  const getDiscountPrice = (item) => {
    if (item.hasClassifications) {
      return item.classifications[0]?.discountPrice || 0;
    }
    return item.discountPrice || 0;
  };

  const getStock = (item) => {
    if (item.hasClassifications) {
      return item.classifications.reduce(
        (total, classification) => total + (classification.stock || 0),
        0
      );
    }
    return item.stock || 0;
  };

  const renderStatusSelect = (item) => {
    const options = [
      { value: "pending", label: "Chờ duyệt" },
      { value: "approved", label: "Đã duyệt" },
      { value: "rejected", label: "Từ chối" },
    ];

    const filteredOptions =
      item.status === "pending"
        ? options
        : options.filter((option) => option.value !== "pending");

    const currentColors = statusColors[item.status];

    return (
      <Select
        onValueChange={(value) => handleStatusChange(item._id, value)}
        value={item.status}
      >
        <SelectTrigger
          className={`w-[180px] ${currentColors.bg} ${currentColors.text} ${currentColors.border} border-2`}
        >
          <SelectValue>{statusToVietnamese[item.status]}</SelectValue>
        </SelectTrigger>
        <SelectContent className={`${currentColors.border} border-2`}>
          {filteredOptions.map((option) => {
            const optionColors = statusColors[option.value];
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                className={`${optionColors.bg} ${optionColors.text} my-1 rounded cursor-pointer`}
              >
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  };

  const handlePreviewProduct = (product) => {
    setPreviewProduct(product);
    setIsPreviewOpen(true);
  };

  const renderPreviewContent = () => {
    if (!previewProduct) return null;

    const images = previewProduct.images.map((image) => ({
      original: `${backend_url}${image}`,
      thumbnail: `${backend_url}${image}`,
    }));

    const getMinMaxPrice = () => {
      if (previewProduct.hasClassifications) {
        const prices = previewProduct.classifications.map(
          (c) => c.discountPrice
        );
        return `${Math.min(...prices).toLocaleString()}₫ - ${Math.max(
          ...prices
        ).toLocaleString()}₫`;
      }
      return `${previewProduct.discountPrice.toLocaleString()}₫`;
    };

    const getClassificationGroups = () => {
      if (!previewProduct.hasClassifications) return null;
      return (
        <div className="space-y-2">
          <h4 className="font-bold text-[16px]">Phân loại:</h4>
          <p>
            {previewProduct.group1.name}:{" "}
            {previewProduct.group1.values.join(", ")}
          </p>
          {previewProduct.group2.name && (
            <p>
              {previewProduct.group2.name}:{" "}
              {previewProduct.group2.values.join(", ")}
            </p>
          )}
        </div>
      );
    };

    const getAvatarSrc = (avatar) => {
      if (avatar && avatar.startsWith("data:image")) {
        return avatar;
      } else if (avatar) {
        return `${backend_url}${avatar}`;
      }
      return "";
    };

    const getStockInfo = () => {
      if (previewProduct.hasClassifications) {
        return previewProduct.classifications.map((c, index) => (
          <div key={index} className="flex items-center ">
            <p className="min-w-[80px]">
              {`${c.group1}${c.group2 ? ` - ${c.group2}` : ""}:`}
            </p>
            <p>{`${c.stock}`}</p>
          </div>
        ));
      }
      return <p>{previewProduct.stock}</p>;
    };

    return (
      <div className="flex items-start">
        <div>
          <ImageGallery
            items={images}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={true}
            lazyLoad={true}
            thumbnailPosition="right"
            useBrowserFullscreen={false}
            slideOnThumbnailOver={true}
          />
        </div>

        <div className="mx-4 space-y-4">
          <div className="flex items-center space-x-2">
            <p className="text-[16px] font-bold mr-2">Shop:</p>
            <Avatar>
              <AvatarImage
                src={getAvatarSrc(previewProduct.shop.avatar)}
                alt={previewProduct.shop.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <AvatarFallback>
                {previewProduct.shop.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p>{previewProduct.shop.name}</p>
          </div>
          <Separator />
          <div className="flex items-center">
            {previewProduct.isUsed && (
              <div className="mr-1">
                <p className=" text-xs border-[red] border font-semibold text-[red] mt-[2px] px-[2px]">
                  Hàng cũ
                </p>
              </div>
            )}
          </div>
          <Separator />
          <div className="flex items-center">
            <p className="text-[16px] font-bold mr-2 max-w-[200px] break-words">
              Tên sản phẩm:
            </p>
            <p>{previewProduct.name}</p>
          </div>
          <Separator />
          <div className="flex items-center">
            <p className="text-[16px] font-bold mr-2">Giá:</p>
            <p>{getMinMaxPrice()}</p>
          </div>
          {previewProduct.hasClassifications && (
            <>
              <Separator />
              <div>{getClassificationGroups()}</div>
            </>
          )}
          <Separator />
          <div className="space-y-2">
            <h4 className="font-bold">Số lượng:</h4>
            {getStockInfo()}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <Card className="w-full mx-auto m-4 flex flex-col h-[calc(100vh-6rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quản lý sản phẩm</CardTitle>
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã sản phẩm</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead className="text-center">Giá gốc</TableHead>
              <TableHead className="text-center">Giảm giá</TableHead>
              <TableHead className="text-center">Giá khuyến mãi</TableHead>
              <TableHead className="text-center">Phân loại</TableHead>
              <TableHead className="text-center">Số lượng</TableHead>
              <TableHead className="text-center">Đã bán</TableHead>
              <TableHead className="text-center">
                Xem/Xem trước sản phẩm
              </TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Xoá sản phẩm</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts?.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item._id}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {item.name}
                </TableCell>
                <TableCell className="text-center">
                  {getPrice(item).toLocaleString()}
                  <sup>₫</sup>
                </TableCell>
                <TableCell className="text-center">
                  {item.hasClassifications
                    ? `${item.classifications[0].percentageDiscount}%`
                    : `${item.percentageDiscount}%`}
                </TableCell>
                <TableCell className="text-center">
                  {getDiscountPrice(item).toLocaleString()}
                  <sup>₫</sup>
                </TableCell>
                <TableCell className="text-center">
                  {item.hasClassifications ? (
                    <span className="text-green-500">Có</span>
                  ) : (
                    <span className="text-red-500">Không</span>
                  )}
                </TableCell>
                <TableCell className="text-center">{getStock(item)}</TableCell>
                <TableCell className="text-center">{item.sold_out}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewProduct(item)}
                    disabled={item.status !== "approved"}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviewProduct(item)}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center flex items-center justify-center">
                  {renderStatusSelect(item)}
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

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl !h-[600px]">
          <DialogHeader>
            <DialogTitle>Xem trước sản phẩm</DialogTitle>
          </DialogHeader>
          {renderPreviewContent()}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AllProducts;
