// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import ProductCard from "../ProductCard/ProductCard";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "../../ui/carousel";
// import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
// import { Link } from "react-router-dom";
// import { ChevronRight } from "lucide-react";

// const BestDeals = () => {
//   const [data, setData] = useState([]);
//   const { allProducts } = useSelector((state) => state.product);

//   useEffect(() => {
//     const allProductsData = allProducts ? [...allProducts] : [];
//     const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
//     const firstFifteen = sortedData && sortedData.slice(0, 15);
//     setData(firstFifteen);
//   }, [allProducts]);

//   const chunkedData = data.reduce((resultArray, item, index) => {
//     const chunkIndex = Math.floor(index / 5);
//     if (!resultArray[chunkIndex]) {
//       resultArray[chunkIndex] = [];
//     }
//     resultArray[chunkIndex].push(item);
//     return resultArray;
//   }, []);

//   return (
//     <Card className="mt-2 py-2 px-4">
//       <CardHeader className="!p-0 !py-2 !flex-row !items-center justify-between">
//         <CardTitle className="text-[20px] font-[600]">Bán chạy nhất</CardTitle>
//         <Link to="/best-selling">
//           <CardTitle className="text-[14px] font-[500] !m-0 text-[#27b3e2] flex items-center">
//             Xem tất cả
//           <ChevronRight size={15} className="ml-1"/>
//           </CardTitle>
//         </Link>
//       </CardHeader>
//       <CardContent className="!px-0 ">
//         <Carousel className="w-full">
//           <CarouselContent>
//             {chunkedData.map((chunk, chunkIndex) => (
//               <CarouselItem key={chunkIndex}>
//                 <div className="grid grid-cols-5 gap-3 justify-items-center">
//                   {chunk.map((product, productIndex) => (
//                     <ProductCard key={productIndex} data={product} />
//                   ))}
//                 </div>
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//           <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
//             <CarouselPrevious className="relative left-2 translate-y-0" />
//             <CarouselNext className="relative right-2 translate-y-0" />
//           </div>
//         </Carousel>
//       </CardContent>
//     </Card>
//   );
// };

// export default BestDeals;

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import ProductCard from "../ProductCard/ProductCard";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "../../ui/carousel";
// import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
// import { Link } from "react-router-dom";
// import { ChevronRight } from "lucide-react";

// const BestDeals = () => {
//   const [data, setData] = useState([]);
//   const { allProducts } = useSelector((state) => state.product);

//   useEffect(() => {
//     const allProductsData = allProducts ? [...allProducts] : [];
//     const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
//     const firstFifteen = sortedData && sortedData.slice(0, 15);
//     setData(firstFifteen);
//   }, [allProducts]);

//   const chunkedData = data.reduce((resultArray, item, index) => {
//     const chunkIndex = Math.floor(index / 5);
//     if (!resultArray[chunkIndex]) {
//       resultArray[chunkIndex] = [];
//     }
//     resultArray[chunkIndex].push(item);
//     return resultArray;
//   }, []);

//   return (
//     <Card className="mt-2 py-2 px-4">
//       <CardHeader className="!p-0 !py-2 !flex-row !items-center justify-between">
//         <CardTitle className="text-[20px] font-[600]">Bán chạy nhất</CardTitle>
//         <Link to="/best-selling">
//           <CardTitle className="text-[14px] font-[500] !m-0 text-[#27b3e2] flex items-center">
//             Xem tất cả
//             <ChevronRight size={15} className="ml-1" />
//           </CardTitle>
//         </Link>
//       </CardHeader>
//       <CardContent className="!px-0 ">
//         {data.length > 5 ? (
//           <Carousel className="w-full">
//             <CarouselContent>
//               {chunkedData.map((chunk, chunkIndex) => (
//                 <CarouselItem key={chunkIndex}>
//                   <div className="grid grid-cols-5 gap-3 justify-items-center">
//                     {chunk.map((product, productIndex) => (
//                       <ProductCard key={productIndex} data={product} />
//                     ))}
//                   </div>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//             <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
//               <CarouselPrevious className="relative left-2 translate-y-0" />
//               <CarouselNext className="relative right-2 translate-y-0" />
//             </div>
//           </Carousel>
//         ) : (
//           <div className="grid grid-cols-5 gap-3 justify-items-center">
//             {data.map((product, index) => (
//               <ProductCard key={index} data={product} />
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default BestDeals;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import like from "../../../assets/navbar/like.png";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.product);

  useEffect(() => {
    if (allProducts) {
      const sortedData = [...allProducts].sort((a, b) => {
        // Ưu tiên sản phẩm có sold_out cao và ratings > 4
        if (a.sold_out > b.sold_out && a.ratings > 4 && b.ratings <= 4)
          return -1;
        if (b.sold_out > a.sold_out && b.ratings > 4 && a.ratings <= 4)
          return 1;

        // Nếu cả hai đều có ratings > 4 hoặc cả hai đều có ratings <= 4, so sánh sold_out
        if (
          (a.ratings > 4 && b.ratings > 4) ||
          (a.ratings <= 4 && b.ratings <= 4)
        ) {
          return b.sold_out - a.sold_out;
        }

        // Nếu sold_out bằng nhau, so sánh ratings
        if (a.sold_out === b.sold_out) {
          return b.ratings - a.ratings;
        }

        // Mặc định sắp xếp theo sold_out
        return b.sold_out - a.sold_out;
      });

      const firstFifteen = sortedData.slice(0, 15);
      setData(firstFifteen);
    }
  }, [allProducts]);

  const chunkedData = data.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 5);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  return (
    <Card className="mt-3 py-2 px-4 !border-none ">
      <CardHeader className="!p-0 !py-2 !flex-row !items-center justify-between">
        <CardTitle className="text-[18px] font-[600] text-[#FF5733]">
          <div className="flex items-center">
            <img src={like} alt="" className="w-[18px] mr-2" />
            <p>Bán chạy nhất</p>
          </div>
        </CardTitle>
        <Link to="/best-selling" className="!m-0">
          <CardTitle className="text-[14px] font-[500] text-[#27b3e2] flex items-center">
            Xem tất cả
            <ChevronRight size={15} className="ml-1" />
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="!px-0 ">
        {data.length > 5 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {chunkedData.map((chunk, chunkIndex) => (
                <CarouselItem key={chunkIndex}>
                  <div className="grid grid-cols-5 gap-3 justify-items-center">
                    {chunk.map((product, productIndex) => (
                      <ProductCard key={productIndex} data={product} />
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
              <CarouselPrevious className="relative left-2 translate-y-0" />
              <CarouselNext className="relative right-2 translate-y-0" />
            </div>
          </Carousel>
        ) : (
          <div className="grid grid-cols-5 gap-3 justify-items-center">
            {data.map((product, index) => (
              <ProductCard key={index} data={product}  isBigger={false}/>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BestDeals;
