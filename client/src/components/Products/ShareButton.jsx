// const ShareButton = () => {
//   const handleShare = () => {
//     const url = encodeURIComponent("http://localhost:5173");
//     const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
//     window.open(facebookShareUrl, '_blank');
//   };

import { Share2 } from "lucide-react";
import { Button } from "../ui/button";

//   return <button onClick={handleShare}>Chia sẻ lên Facebook</button>;
// };

// export default ShareButton;

// const ShareButton = () => {
//   const handleShare = () => {
//     const url = encodeURIComponent("http://localhost:5173");
//     const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

//     alert(
//       "Lưu ý: Chia sẻ localhost có thể không hoạt động chính xác trên Facebook. Chỉ những người có quyền truy cập vào máy của bạn mới có thể xem được nội dung."
//     );

//     window.open(facebookShareUrl, "_blank");
//   };

//   return <button onClick={handleShare}>Chia sẻ lên Facebook (Dev)</button>;
// };

// export default ShareButton;

// const ShareButton = () => {
//   const handleShare = () => {
//     const shareData = {
//       title: "Sản phẩm",
//       text: "Sản phẩm",
//       url: "http://localhost:5173"
//     };

//     console.log("Đang giả lập chia sẻ lên Facebook với dữ liệu:", shareData);
//     alert("Trong môi trường production, đây sẽ chia sẻ lên Facebook:\n\n" + JSON.stringify(shareData, null, 2));
//   };

//   return <button onClick={handleShare}>Giả lập chia sẻ (Dev)</button>;
// };

// export default ShareButton;

// const ShareButton = () => {
//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: "Sản phẩm",
//           text: "Sản phẩm",
//           url: "http://localhost:5173",
//         });
//         console.log("Chia sẻ thành công");
//       } catch (error) {
//         console.error("Lỗi khi chia sẻ:", error);
//         alert("Không thể chia sẻ trong môi trường dev. Trong production, URL sẽ được thay thế bằng URL thực của trang web.");
//       }
//     } else {
//       alert("Trình duyệt của bạn không hỗ trợ Web Share API. Trong môi trường production, chúng tôi sẽ sử dụng phương thức chia sẻ thay thế.");
//     }
//   };

//   return <button onClick={handleShare}>Chia sẻ (Dev)</button>;
// };

// export default ShareButton;

const ShareButton = () => {
  const handleShare = async () => {
    // const ngrokUrl = "https://1234abcd.ngrok.io"; // Thay bằng URL ngrok thực tế của bạn
    const ngrokUrl = "https://00b0-123-16-158-169.ngrok-free.app/"; // Thay bằng URL ngrok thực tế của bạn
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Sản phẩm",
          text: "Sản phẩm",
          url: ngrokUrl,
        });
        console.log("Chia sẻ thành công");
      } else {
        // Fallback cho trình duyệt không hỗ trợ Web Share API
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          ngrokUrl
        )}`;
        window.open(facebookShareUrl, "_blank");
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
      // Xử lý lỗi ở đây
    }
  };

  return (
    <Button onClick={handleShare} variant="outline">
      <Share2 size={16} className="mr-2"/>
      Chia sẻ
    </Button>
  );
};

export default ShareButton;
