import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader2, MoreVertical, Star } from "lucide-react";
import { backend_url, server } from "../../server";
import moment from "moment-timezone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Ratings from "../Products/Ratings";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const DashboardRatingsManage = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { products, isLoading } = useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  useEffect(() => {
    if (seller._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller._id]);

  const handleReportClick = (review) => {
    setSelectedReview(review);
    setIsReportDialogOpen(true);
  };

  const handleReportSubmit = async () => {
    try {
      
      const productId = selectedReview.productId; 

      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `${server}/reviewReport/report-review`,
        {
          productId: productId, 
          reviewId: selectedReview._id,
          reporterId: seller._id,
          reporterModel: "Seller",
          reason: reportReason === "Khác" ? otherReason : reportReason,
          description: reportReason === "Khác" ? otherReason : reportReason,
        }
      );
      toast.success("Báo cáo đã được gửi thành công");
      setIsReportDialogOpen(false);
      setReportReason("");
      setOtherReason("");
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo:", error);
      toast.error("Có lỗi xảy ra khi gửi báo cáo");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  const getAvatarSrc = (avatar) => {
    if (avatar && avatar.startsWith("data:image")) {
      return avatar;
    } else if (avatar) {
      return `${backend_url}${avatar}`;
    }
    return "";
  };

  const allReviews = products?.flatMap((product) => product.reviews) || [];

  const filterReviews = (reviews, rating) => {
    if (rating === "all") return reviews;
    return reviews.filter((review) => review.rating === parseInt(rating));
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderReviewsTable = (reviews) => {
    if (reviews.length === 0) {
      return <div className="text-center py-4">Chưa có đánh giá nào</div>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Khách hàng</TableHead>
            <TableHead className="text-center">Đánh giá</TableHead>
            <TableHead className="text-center">Ngày</TableHead>
            <TableHead className="text-center">Bình luận</TableHead>
            <TableHead className="text-center">Sản phẩm</TableHead>
            <TableHead className="text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts?.flatMap((product) =>
            product.reviews.map((review, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          getAvatarSrc(review.user.avatar) ||
                          `${backend_url}/${review.user.avatar}`
                        }
                        alt={review.user.name}
                      />
                      <AvatarFallback>
                        {review.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {review.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                        size={16}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {moment(review.createdAt)
                    .tz("Asia/Ho_Chi_Minh")
                    .format("DD-MM-YYYY | HH:mm")}
                </TableCell>
                <TableCell className="text-center">{review.comment}</TableCell>
                <TableCell className="text-center max-w-[300px] text-ellipsis">
                  <div className="flex items-center justify-center space-x-3">
                    <img
                      src={`${backend_url}${
                        product.images[0] && product.images[0]
                      }`}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <p className="font-medium">{product.name}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleReportClick(review)}
                      >
                        Báo cáo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  const totalReviewsLength =
    filteredProducts &&
    filteredProducts.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    filteredProducts &&
    filteredProducts.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(1);

  return (
    <Card className="w-full h-[calc(100vh-6rem)] mx-auto m-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quản lý đánh giá</CardTitle>
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
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full min-h-[6rem] border p-4 mb-4 bg-[#fffbf8]">
            <div className="w-full mx-2 h-[80px] flex flex-col items-center justify-center mr-6 ">
              <div className="flex items-center text-[#27b3e2] font-[450] mb-1">
                <p className="text-[22px] mr-1 ">{averageRating}</p>
                <p>trên 5</p>
              </div>
              <div className="text-[22px]">
                <Ratings rating={parseFloat(averageRating)} />
              </div>
            </div>
            <TabsTrigger
              value="all"
              className="w-full border mx-2 h-[40px] data-[state=active]:text-[#27b3e2] data-[state=active]:border-[#27b3e2]"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="5"
              className="w-full border mx-2 h-[40px] data-[state=active]:text-[#27b3e2] data-[state=active]:border-[#27b3e2]"
            >
              5 sao
            </TabsTrigger>
            <TabsTrigger
              value="4"
              className="w-full border mx-2 h-[40px] data-[state=active]:text-[#27b3e2] data-[state=active]:border-[#27b3e2]"
            >
              4 sao
            </TabsTrigger>
            <TabsTrigger
              value="3"
              className="w-full border mx-2 h-[40px] data-[state=active]:text-[#27b3e2] data-[state=active]:border-[#27b3e2]"
            >
              3 sao
            </TabsTrigger>
            <TabsTrigger
              value="2"
              className="w-full border mx-2 h-[40px] data-[state=active]:text-[#27b3e2] data-[state=active]:border-[#27b3e2]"
            >
              2 sao
            </TabsTrigger>
            <TabsTrigger
              value="1"
              className="w-full border mx-2 h-[40px] data-[state=active]:text-[#27b3e2] data-[state=active]:border-[#27b3e2]"
            >
              1 sao
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {renderReviewsTable(allReviews)}
          </TabsContent>
          <TabsContent value="5">
            {renderReviewsTable(filterReviews(allReviews, "5"))}
          </TabsContent>
          <TabsContent value="4">
            {renderReviewsTable(filterReviews(allReviews, "4"))}
          </TabsContent>
          <TabsContent value="3">
            {renderReviewsTable(filterReviews(allReviews, "3"))}
          </TabsContent>
          <TabsContent value="2">
            {renderReviewsTable(filterReviews(allReviews, "2"))}
          </TabsContent>
          <TabsContent value="1">
            {renderReviewsTable(filterReviews(allReviews, "1"))}
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Báo cáo đánh giá</DialogTitle>
            <DialogDescription>
              Chọn lý do báo cáo đánh giá này
            </DialogDescription>
          </DialogHeader>
          <RadioGroup
            value={reportReason}
            onValueChange={setReportReason}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Đánh giá thô tục phản cảm" id="r1" />
              <Label htmlFor="r1">Đánh giá thô tục phản cảm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="Đánh giá trùng lặp(thông tin rác)"
                id="r2"
              />
              <Label htmlFor="r2">Đánh giá trùng lặp(thông tin rác)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Chứa thông tin cá nhân" id="r3" />
              <Label htmlFor="r3">Chứa thông tin cá nhân</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Quảng cáo trái phép" id="r4" />
              <Label htmlFor="r4">Quảng cáo trái phép</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="Đánh giá không chính xác/ gây hiểu lầm"
                id="r5"
              />
              <Label htmlFor="r5">Đánh giá không chính xác/ gây hiểu lầm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Khác" id="r6" />
              <Label htmlFor="r6">Vi phạm khác</Label>
            </div>
          </RadioGroup>
          {reportReason === "Khác" && (
            <Textarea
              placeholder="Nhập lý do vi phạm khác"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            />
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleReportSubmit}
              disabled={
                !reportReason || (reportReason === "Khác" && !otherReason)
              }
            >
              Gửi báo cáo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DashboardRatingsManage;
