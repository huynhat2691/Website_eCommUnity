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

// const ProductsInterested = () => {
//   const [data, setData] = useState([]);
//   const { allProducts } = useSelector((state) => state.product);

//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

//     if (cartItems.length > 0 && allProducts) {
//       // Lấy tất cả subclassification từ các sản phẩm trong giỏ hàng
//       const cartSubclassifications = new Set(cartItems.map(item => item.subclassification));

//       // Lọc sản phẩm có cùng subclassification với sản phẩm trong giỏ hàng
//       const relatedProducts = allProducts.filter(product =>
//         cartSubclassifications.has(product.subclassification) &&
//         !cartItems.some(item => item._id === product._id)
//       );

//       // Sắp xếp ngẫu nhiên và lấy 10 sản phẩm đầu tiên
//       const shuffled = relatedProducts.sort(() => 0.5 - Math.random());
//       const selected = shuffled.slice(0, 10);

//       setData(selected);
//     } else {
//       setData([]);
//     }
//   }, [allProducts]);

//   const chunkedData = data.reduce((resultArray, item, index) => {
//     const chunkIndex = Math.floor(index / 5);
//     if (!resultArray[chunkIndex]) {
//       resultArray[chunkIndex] = [];
//     }
//     resultArray[chunkIndex].push(item);
//     return resultArray;
//   }, []);

//   if (data.length === 0) {
//     return null; // Không hiển thị gì nếu không có sản phẩm liên quan
//   }

//   return (
//     <Card className="mt-2 py-2 px-4">
//       <CardHeader className="!p-0 !py-2 !flex-row !items-center justify-between">
//         <CardTitle className="text-[20px] font-[600]">
//           Sản phẩm bạn quan tâm
//         </CardTitle>
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

// export default ProductsInterested;
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

// const ProductsInterested = () => {
//   const [data, setData] = useState([]);
//   const { allProducts } = useSelector((state) => state.product);

//   useEffect(() => {
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

//     if (cartItems.length > 0 && allProducts) {
//       // Đếm số lượng sản phẩm cho mỗi subclassification trong giỏ hàng
//       const subclassificationCount = cartItems.reduce((acc, item) => {
//         acc[item.subclassification] = (acc[item.subclassification] || 0) + 1;
//         return acc;
//       }, {});

//       // Sắp xếp subclassifications theo số lượng giảm dần
//       const sortedSubclassifications = Object.entries(subclassificationCount)
//         .sort((a, b) => b[1] - a[1])
//         .map(([subclass]) => subclass);

//       let relatedProducts = [];

//       if (cartItems.length === 1) {
//         // Trường hợp chỉ có 1 đơn hàng
//         relatedProducts = allProducts.filter(
//           (product) =>
//             product.subclassification === sortedSubclassifications[0] &&
//             !cartItems.some((item) => item._id === product._id)
//         );
//       } else if (cartItems.length <= 10) {
//         // Trường hợp có nhỏ hơn hoặc bằng 10 sản phẩm
//         sortedSubclassifications.forEach((subclass) => {
//           const productsInSubclass = allProducts.filter(
//             (product) =>
//               product.subclassification === subclass &&
//               !cartItems.some((item) => item._id === product._id)
//           );
//           relatedProducts = relatedProducts.concat(
//             productsInSubclass.slice(0, 2)
//           );
//         });
//       } else {
//         // Trường hợp có trên 10 sản phẩm
//         sortedSubclassifications.forEach((subclass) => {
//           const productsInSubclass = allProducts.filter(
//             (product) =>
//               product.subclassification === subclass &&
//               !cartItems.some((item) => item._id === product._id)
//           );
//           relatedProducts = relatedProducts.concat(
//             productsInSubclass.slice(0, 1)
//           );
//         });
//       }

//       // Sắp xếp ngẫu nhiên và lấy tối đa 10 sản phẩm
//       const shuffled = relatedProducts.sort(() => 0.5 - Math.random());
//       const selected = shuffled.slice(0, 10);

//       setData(selected);
//     } else {
//       setData([]);
//     }
//   }, [allProducts]);

//   const chunkedData = data.reduce((resultArray, item, index) => {
//     const chunkIndex = Math.floor(index / 5);
//     if (!resultArray[chunkIndex]) {
//       resultArray[chunkIndex] = [];
//     }
//     resultArray[chunkIndex].push(item);
//     return resultArray;
//   }, []);

//   if (data.length === 0) {
//     return null; // Không hiển thị gì nếu không có sản phẩm liên quan
//   }

//   return (
//     <Card className="mt-3 py-2 px-4 !border-none">
//       <CardHeader className="!p-0 !py-2 !flex-row !items-center justify-between">
//         <CardTitle className="text-[18px] font-[600]">
//           Sản phẩm bạn quan tâm
//         </CardTitle>
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

// export default ProductsInterested;

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

const ProductsInterested = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.product);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (cartItems.length > 0 && allProducts) {
      let relatedProducts = [];

      // Hàm để lấy sản phẩm liên quan dựa trên subclassification hoặc subcategory
      const getRelatedProducts = (item, count) => {
        let related = allProducts.filter(
          (product) =>
            product.subclassification === item.subclassification &&
            product._id !== item._id &&
            !cartItems.some((cartItem) => cartItem._id === product._id)
        );

        if (related.length < count) {
          related = related.concat(
            allProducts.filter(
              (product) =>
                product.subcategory === item.subcategory &&
                product.subclassification !== item.subclassification &&
                product._id !== item._id &&
                !cartItems.some((cartItem) => cartItem._id === product._id)
            )
          );
        }

        if (related.length < count) {
          related = related.concat(
            allProducts.filter(
              (product) =>
                product.category === item.category &&
                product.subcategory !== item.subcategory &&
                product._id !== item._id &&
                !cartItems.some((cartItem) => cartItem._id === product._id)
            )
          );
        }

        return related.slice(0, count);
      };

      if (cartItems.length === 1) {
        // Gợi ý 5 sản phẩm cho 1 sản phẩm trong giỏ hàng
        relatedProducts = getRelatedProducts(cartItems[0], 5);
      } else if (cartItems.length <= 5) {
        // Gợi ý 2 sản phẩm cho mỗi sản phẩm trong giỏ hàng
        cartItems.forEach((item) => {
          relatedProducts = relatedProducts.concat(getRelatedProducts(item, 2));
        });
      } else {
        // Gợi ý 1 sản phẩm cho mỗi sản phẩm trong giỏ hàng
        cartItems.forEach((item) => {
          relatedProducts = relatedProducts.concat(getRelatedProducts(item, 1));
        });
      }

      // Loại bỏ các sản phẩm trùng lặp
      relatedProducts = Array.from(new Set(relatedProducts.map(a => a._id)))
        .map(id => relatedProducts.find(a => a._id === id));

      // Sắp xếp ngẫu nhiên và lấy tối đa 10 sản phẩm
      const shuffled = relatedProducts.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);

      setData(selected);
    } else {
      setData([]);
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

  if (data.length === 0) {
    return null; // Không hiển thị gì nếu không có sản phẩm liên quan
  }

  return (
    <Card className="mt-3 py-2 px-4 !border-none">
      <CardHeader className="!p-0 !py-2 !flex-row !items-center justify-between">
        <CardTitle className="text-[18px] font-[600]">
          Sản phẩm bạn quan tâm
        </CardTitle>
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
              <ProductCard key={index} data={product} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsInterested;