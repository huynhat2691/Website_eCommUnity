import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { getAdminShop } from "../../redux/actions/seller";

const AdminShopSettings = () => {
  const { adminShop } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [description, setDescription] = useState(
    adminShop && adminShop.description ? adminShop.description : ""
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminShop());
  }, [dispatch]);

  const handleImage = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    setAvatar(file);

    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2) {
        try {
          // eslint-disable-next-line no-unused-vars
          const response = await axios.put(
            `${server}/shop/update-admin-shop-avatar`,
            { image: reader.result },
            {
              withCredentials: true,
            }
          );
          dispatch(getAdminShop());
          toast.success("Ảnh đại diện cập nhật thành công");
        } catch (err) {
          toast.error(
            err.response?.data?.message ||
              "Có lỗi xảy ra khi cập nhật ảnh đại diện"
          );
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${server}/shop/update-admin-shop-info`,
        {
          description,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Thông tin shop cập nhật thành công");
      dispatch(getAdminShop());
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <Card className="w-full m-4 rounded-lg border">
      <CardHeader>
        <CardTitle>Thông tin shop</CardTitle>
        <CardDescription>Cập nhật thông tin shop tại đây</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6 ">
          <div className="flex items-center">
            <Avatar className="w-32 h-32 border">
              <AvatarImage
                src={avatar ? URL.createObjectURL(avatar) : adminShop?.avatar}
                alt="Shop Avatar"
                className="object-cover"
              />
              <AvatarFallback>{adminShop?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="w-full ml-5 flex items-center justify-center cursor-pointer ">
              <div className="h-[40px] font-[600] min-w-[110px] flex items-center justify-center text-[14px] rounded cursor-pointer border bg-[#f5f5f0] hover:bg-[#e6e6e6] transition-all duration-300">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                />
                <Label htmlFor="image">
                  <p className="cursor-pointer">Chọn ảnh</p>
                </Label>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={updateHandler} className="space-y-5">
          <div>
            <Label htmlFor="description">Tên</Label>
            <Input
              id="description"
              value="eCommUnity"
              className="cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả"
            />
          </div>

          <Button type="submit" >
            Cập nhật
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminShopSettings;
