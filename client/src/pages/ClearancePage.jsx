import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { categoriesData } from "../static/data";
import { Button } from "../components/ui/button";

const ClearancePage = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [visibleProducts, setVisibleProducts] = useState({});
  const [hasClearanceProducts, setHasClearanceProducts] = useState(false);
  const { allProducts, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    if (allProducts) {
      const clearanceProducts = allProducts.filter(
        (product) => product.percentageDiscount >= 50
      );
      const grouped = categoriesData.reduce((acc, category) => {
        acc[category.id] = clearanceProducts.filter(
          (product) => product.category === category.id.toString()
        );
        return acc;
      }, {});
      setProductsByCategory(grouped);

      const initialVisible = Object.keys(grouped).reduce((acc, categoryId) => {
        acc[categoryId] = 8;
        return acc;
      }, {});
      setVisibleProducts(initialVisible);

      setHasClearanceProducts(clearanceProducts.length > 0);
    }
  }, [allProducts]);

  const loadMore = (categoryId) => {
    setVisibleProducts((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] + 8,
    }));
  };

  console.log(allProducts);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Header />
      <div className="w-[1100px] mx-auto">
        {hasClearanceProducts ? (
          <div>
            {categoriesData.map((category) => {
              const hasProducts = productsByCategory[category.id]?.length > 0;

              if (!hasProducts) return null;

              return (
                <div key={category.id} className="mb-6 p-4">
                  <div className="flex justify-center">
                    <div className="w-[800px] border-white border-[2px] mb-6 rounded-full bg-[#27b3e2] text-white">
                      <h2 className="text-4xl font-bold my-4 text-center">
                        {category.title.toUpperCase()} CLEARANCE
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-3 mb-6 justify-items-center">
                    {productsByCategory[category.id]
                      ?.slice(0, visibleProducts[category.id])
                      .map((product, index) => (
                        <ProductCard data={product} key={index} isBigger={true} />
                      ))}
                  </div>
                  {productsByCategory[category.id]?.length >
                    visibleProducts[category.id] && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => loadMore(category.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Xem thêm
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full flex flex-col h-[29rem] items-center justify-evenly bg-white border rounded-lg my-8">
            <h2 className="text-[20px] !select-none">
              Tạm thời chưa có sản phẩm nào
            </h2>
            <Link to="/">
              <Button className="!select-none">Tiếp tục mua sắm</Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ClearancePage;
