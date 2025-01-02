// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Layout/Header";
// import Footer from "../components/Layout/Footer";
// import Lottie from "react-lottie";
// import animationData from "../assets/animations/107043-success.json";
// import CategoriesList from "../components/Layout/CategoriesList";

// const OrderSuccessPage = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate("/"); // Chuyển hướng về trang chủ sau 3 giây
//     }, 3000);

//     // Cleanup function
//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <div>
//       <Header />
//       <Success />
//       <CategoriesList />
//       <Footer />
//     </div>
//   );
// };

// const Success = () => {
//   const defaultOptions = {
//     loop: false,
//     autoplay: true,
//     animationData: animationData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };

//   return (
//     <div>
//       <Lottie options={defaultOptions} width={300} height={300} />
//       <h5 className="text-center mb-14 text-[25px] text-[black]">
//         Đặt hàng thành công
//       </h5>
//       <p className="text-center text-[16px] text-[gray]">
//         Về trang chủ sau 3 giây...
//       </p>
//       <br />
//     </div>
//   );
// };

// export default OrderSuccessPage;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Lottie from "react-lottie";
import animationData from "../assets/animations/107043-success.json";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // Chuyển hướng về trang chủ sau 3 giây
    }, 3000);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <Success />
      </main>
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="text-center">
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="mb-4 text-2xl font-bold text-black">
        Đặt hàng thành công
      </h5>
      <p className="text-base text-gray-600">
        Về trang chủ sau 3 giây...
      </p>
    </div>
  );
};

export default OrderSuccessPage;