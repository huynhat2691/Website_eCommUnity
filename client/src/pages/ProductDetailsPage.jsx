// import { useParams, useSearchParams } from "react-router-dom";
// import Footer from "../components/Layout/Footer";
// import Header from "../components/Layout/Header";
// import ProductDetails from "../components/Products/ProductDetails";
// import { useEffect, useState } from "react";
// import SuggestedProduct from "../components/Products/SuggestedProduct";
// import { useDispatch, useSelector } from "react-redux";
// import CategoriesList from "../components/Layout/CategoriesList";
// import SimilarProducts from "../components/Products/SimilarProducts";
// import { getAllUsedProducts } from "../redux/actions/product";

// const ProductDetailsPage = () => {
//   const { allProducts, usedProducts } = useSelector((state) => state.product);
//   const { allEvents } = useSelector((state) => state.event);
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [searchParams] = useSearchParams();
//   const eventData = searchParams.get("isEvent");
//   const [isEvent, setIsEvent] = useState(false);

//   const dispatch = useDispatch();

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   useEffect(() => {
//     dispatch(getAllUsedProducts());
//   }, [dispatch]);

//   console.log(usedProducts)

//   useEffect(() => {
//     if (eventData !== null) {
//       const data = allEvents && allEvents.find((i) => i._id === id);
//       setData(data);
//       setIsEvent(true);
//     } else {
//       const data = allProducts && allProducts.find((i) => i._id === id);
//       setData(data);
//       setIsEvent(false);
//     }
//   }, [allProducts, allEvents, id, eventData]);

//   return (
//     <div>
//       <Header />
//       <div className="min-h-[150vh]">
//         <ProductDetails data={data} isEvent={isEvent} />
//         {data && !isEvent && (
//           <SimilarProducts currentProduct={data} scrollToTop={scrollToTop} />
//         )}
//         {data && (
//           <SuggestedProduct
//             data={data}
//             isEvent={isEvent}
//             currentId={id}
//             scrollToTop={scrollToTop}
//           />
//         )}
//       </div>
//       <CategoriesList />
//       <Footer />
//     </div>
//   );
// };

// export default ProductDetailsPage;

import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import { useEffect, useState } from "react";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useDispatch, useSelector } from "react-redux";
import CategoriesList from "../components/Layout/CategoriesList";
import SimilarProducts from "../components/Products/SimilarProducts";
import { getAllUsedProducts } from "../redux/actions/product";

const ProductDetailsPage = () => {
  const { allProducts, usedProducts } = useSelector((state) => state.product);
  const { allEvents } = useSelector((state) => state.event);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  const [isEvent, setIsEvent] = useState(false);

  const dispatch = useDispatch();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    dispatch(getAllUsedProducts());
  }, [dispatch]);

  useEffect(() => {
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i) => i._id === id);
      setData(data);
      setIsEvent(true);
    } else {
      // Kiểm tra trong usedProducts trước
      let data = usedProducts && usedProducts.find((i) => i._id === id);

      // Nếu không tìm thấy trong usedProducts, tìm trong allProducts
      if (!data) {
        data = allProducts && allProducts.find((i) => i._id === id);
      }

      setData(data);
      setIsEvent(false);
    }
  }, [allProducts, usedProducts, allEvents, id, eventData]);

  return (
    <div>
      <Header />
      <div className="min-h-[150vh]">
        <ProductDetails data={data} isEvent={isEvent} />
        {data && !isEvent && (
          <SimilarProducts currentProduct={data} scrollToTop={scrollToTop} />
        )}
        {data && (
          <SuggestedProduct
            data={data}
            isEvent={isEvent}
            currentId={id}
            scrollToTop={scrollToTop}
          />
        )}
      </div>
      <CategoriesList />
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
