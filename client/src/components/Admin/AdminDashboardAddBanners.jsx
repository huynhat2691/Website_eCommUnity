import { backend_url, server } from "../../server";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "react-toastify";

const AdminDashboardAddBanners = () => {
  const [banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    link: "",
    image: null,
    order: 1,
    isActive: true,
    type: "carousel",
    popupFrequency: "always",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `${server}/banner/admin-get-all-banners`,
        {
          withCredentials: true,
        }
      );
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleInputChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setNewBanner({ ...newBanner, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    setNewBanner({ ...newBanner, image: e.target.files[0] });
  };

  const getNextOrder = () => {
    const usedOrders = banners.map((banner) => banner.order);
    for (let i = 1; i <= banners.length + 1; i++) {
      if (!usedOrders.includes(i)) {
        return i;
      }
    }
    return banners.length + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextOrder = getNextOrder();
    const updatedNewBanner = { ...newBanner, order: nextOrder };

    const formData = new FormData();
    Object.keys(updatedNewBanner).forEach((key) => {
      formData.append(key, updatedNewBanner[key]);
    });

    try {
      await axios.post(`${server}/banner/admin-add-banner`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      fetchBanners();
      setNewBanner({
        title: "",
        subtitle: "",
        link: "",
        image: null,
        order: nextOrder,
        isActive: true,
        type: "carousel",
        popupFrequency: "always",
      });
      toast.success("Banner đã thêm thành công");
    } catch (error) {
      console.error("Error adding banner:", error);
      toast.error("Có lỗi xảy ra khi thêm banner");
    }
  };

  const handleUpdate = async (id, updateData) => {
    if (!id) {
      console.error("Invalid banner ID");
      return;
    }
    try {
      await axios.put(
        `${server}/banner/admin-update-banner/${id}`,
        updateData,
        {
          withCredentials: true,
        }
      );
      fetchBanners();
      toast.success("Cập nhật banner thành công");
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Có lỗi xảy ra khi cập nhật banner");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Invalid banner ID");
      return;
    }
    try {
      await axios.delete(`${server}/banner/admin-delete-banner/${id}`, {
        withCredentials: true,
      });
      fetchBanners();
      toast.success("Xoá banner thành công");
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Có lỗi xảy ra khi xoá banner");
    }
  };

  const limitText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="w-full p-4 h-full">
      <h2 className="text-2xl font-bold mb-4">Quản lý banner</h2>
      <div className="flex flex-col md:flex-row gap-4 ">
        <Card className="w-full md:w-2/5 !h-min">
          <CardHeader>
            <CardTitle>Thêm banner mới</CardTitle>
          </CardHeader>
          <CardContent className="">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  value={newBanner.title}
                  onChange={handleInputChange}
                  placeholder="Tiêu đề (tuỳ chọn)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Tiêu đề phụ</Label>
                <Input
                  id="subtitle"
                  type="text"
                  name="subtitle"
                  value={newBanner.subtitle}
                  onChange={handleInputChange}
                  placeholder="Tiêu đề phụ (tuỳ chọn)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  type="text"
                  name="link"
                  value={newBanner.link}
                  onChange={handleInputChange}
                  placeholder="Link (tuỳ chọn)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Số thứ tự</Label>
                <Input
                  id="order"
                  type="number"
                  name="order"
                  value={newBanner.order}
                  onChange={handleInputChange}
                  placeholder="Số thứ tự (bắt đầu từ 1)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Hình ảnh</Label>
                <Input
                  id="image"
                  type="file"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Loại banner</Label>
                <Select
                  id="type"
                  name="type"
                  value={newBanner.type}
                  onValueChange={(value) =>
                    setNewBanner({ ...newBanner, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại banner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newBanner.type === "popup" && (
                <div className="space-y-2">
                  <Label htmlFor="popupFrequency">
                    Tần suất hiển thị popup
                  </Label>
                  <Select
                    id="popupFrequency"
                    name="popupFrequency"
                    value={newBanner.popupFrequency}
                    onValueChange={(value) =>
                      setNewBanner({ ...newBanner, popupFrequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tần suất hiển thị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Luôn hiển thị</SelectItem>
                      <SelectItem value="once_per_session">
                        Một lần mỗi phiên
                      </SelectItem>
                      <SelectItem value="once_per_day">
                        Một lần mỗi ngày
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  name="isActive"
                  checked={newBanner.isActive}
                  onCheckedChange={(checked) =>
                    setNewBanner({ ...newBanner, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Hoạt động</Label>
              </div>
              <Button type="submit" className="w-full">
                Thêm banner
              </Button>
            </form>
          </CardContent>
        </Card>

        <Separator className="hidden md:block" orientation="vertical" />

        <Card className="w-full md:w-3/5">
          <CardHeader>
            <CardTitle>Danh sách banner</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <h3 className="text-[16px] font-[500] mb-2 sticky top-0 bg-white z-10">Banner Carousel</h3>
              {banners
                .filter((banner) => banner.type === "carousel")
                .map((banner) => (
                  <div
                    key={banner._id}
                    className="flex items-center space-x-4 p-2 border-b"
                  >
                    <img
                      src={`${backend_url}${banner.image}`}
                      alt=""
                      className="w-[150px] h-auto object-cover flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">
                        {limitText(banner.title, 30) || "Không có tiêu đề"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {limitText(banner.subtitle, 30) || "Không có phụ đề"}
                      </p>
                      <p className="text-sm">Thứ tự: {banner.order}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`active-${banner._id}`}
                        checked={banner.isActive}
                        onCheckedChange={(checked) =>
                          handleUpdate(banner._id, { isActive: checked })
                        }
                      />
                      <Label htmlFor={`active-${banner._id}`}>Hoạt động</Label>
                    </div>
                    <Button
                      onClick={() => handleDelete(banner._id)}
                      variant="destructive"
                      size="sm"
                    >
                      Xoá
                    </Button>
                  </div>
                ))}

              <h3 className="text-[16px] font-[500] my-2 sticky top-0 bg-white z-10">Banner Popup</h3>
              {banners
                .filter((banner) => banner.type === "popup")
                .map((banner) => (
                  <div
                    key={banner._id}
                    className="flex items-center space-x-4 p-2 border-b"
                  >
                    <img
                      src={`${backend_url}${banner.image}`}
                      alt=""
                      className="w-[80px] h-auto object-cover flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">
                        {limitText(banner.title, 30) || "Không có tiêu đề"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {limitText(banner.subtitle, 30) || "Không có phụ đề"}
                      </p>
                      <p className="text-sm">
                        Tần suất: {banner.popupFrequency}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`active-${banner._id}`}
                        checked={banner.isActive}
                        onCheckedChange={(checked) =>
                          handleUpdate(banner._id, { isActive: checked })
                        }
                      />
                      <Label htmlFor={`active-${banner._id}`}>Hoạt động</Label>
                    </div>
                    <Button
                      onClick={() => handleDelete(banner._id)}
                      variant="destructive"
                      size="sm"
                    >
                      Xoá
                    </Button>
                  </div>
                ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardAddBanners;
