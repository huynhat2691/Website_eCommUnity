import Lottie from "react-lottie";
import animationData from "../../assets/animations/Loader - 1725254717969.json";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Lottie options={defaultOptions} width={150} height={150} />
    </div>
  );
};

export default Loader;
