// components/PopupBanner.js
import { useState, useEffect } from "react";
import axios from "axios";
import { backend_url, server } from "../../../server";
import { X } from "lucide-react";

const PopupBanner = () => {
  const [popupBanner, setPopupBanner] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const lockScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const fetchPopupBanner = async () => {
      try {
        const { data } = await axios.get(
          `${server}/banner/active-popup-banner`,
          {
            withCredentials: true,
          }
        );
        // console.log("Fetched popup banner data:", data);
        if (data) {
          setPopupBanner(data);
          const shouldShowPopup = checkIfShouldShowPopup(data.popupFrequency);
          // console.log("Should show popup:", shouldShowPopup);
          setShowPopup(shouldShowPopup);
        }
      } catch (error) {
        console.error("Error fetching popup banner:", error);
      }
    };

    fetchPopupBanner();
  }, []);

  useEffect(() => {
    if (showPopup) {
      lockScroll();
    } else {
      unlockScroll();
    }

    return () => {
      unlockScroll();
    };
  }, [showPopup]);

  const checkIfShouldShowPopup = (frequency) => {
    if (frequency === "always") return true;
    if (frequency === "once_per_session") {
      if (!sessionStorage.getItem("popupShown")) {
        sessionStorage.setItem("popupShown", "true");
        return true;
      }
    }
    if (frequency === "once_per_day") {
      const lastShown = localStorage.getItem("popupLastShown");
      const today = new Date().toDateString();
      if (!lastShown || lastShown !== today) {
        localStorage.setItem("popupLastShown", today);
        return true;
      }
    }
    return false;
  };

  const closePopup = () => {
    setShowPopup(false);
    unlockScroll();
  };

  const handleBackgroundClick = (e) => {
    // Chỉ đóng popup nếu click vào phần nền, không phải nội dung banner
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  if (!showPopup || !popupBanner) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={handleBackgroundClick} // Thêm sự kiện click vào đây
    >
      <div className="p-5 rounded-lg max-w-md w-full relative">
        <div
          onClick={closePopup}
          className="w-7 h-7 text-white bg-[#efefef] absolute top-2 right-2 cursor-pointer flex items-center justify-center rounded"
        >
          <X color="#000000cc" />
        </div>
        <img
          src={`${backend_url}${popupBanner.image}`}
          alt={popupBanner.title}
          className="w-full h-auto rounded-lg"
        />
        <h2 className="text-xl font-bold mt-2">{popupBanner.title}</h2>
        <p>{popupBanner.subtitle}</p>
        {popupBanner.link && (
          <a href={popupBanner.link} className="text-blue-500 hover:underline">
            Tìm hiểu thêm
          </a>
        )}
      </div>
    </div>
  );
};

export default PopupBanner;
