import { getAllUsedProducts } from "../redux/actions/product";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import { categoriesData } from "../static/data";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const SecondhandPage = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [visibleProducts, setVisibleProducts] = useState({});
  const { usedProducts, isLoading, allProducts } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  const [hasSecondHandProducts, setHasSecondHandProducts] = useState(false);

  useEffect(() => {
    dispatch(getAllUsedProducts());
  }, [dispatch]);

  useEffect(() => {
    if (usedProducts) {
      const sortedProducts = [...usedProducts].sort(
        (a, b) => b.sold_out - a.sold_out
      );
      const grouped = categoriesData.reduce((acc, category) => {
        acc[category.id] = sortedProducts.filter(
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

      setHasSecondHandProducts(usedProducts.length > 0);
    }
  }, [usedProducts]);

  console.log(allProducts);

  const loadMore = (categoryId) => {
    setVisibleProducts((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] + 8,
    }));
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header />
          <div className="w-[1100px] mx-auto">
          {
            hasSecondHandProducts ? (
            <div>
              {categoriesData.map((category) => {
                // Kiểm tra xem category có sản phẩm hay không
                const hasProducts = productsByCategory[category.id]?.length > 0;

                // Nếu không có sản phẩm, không render category này
                if (!hasProducts) return null;

                return (
                  <div key={category.id} className="mb-6 p-4">
                    <div className="flex justify-center">
                      <div className="w-[800px] border-white border-[2px] mb-6 rounded-full bg-[#27b3e2] text-white">
                        <h2 className="text-4xl font-bold my-4 text-center">
                          {category.title.toUpperCase()}
                        </h2>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-3 mb-6 justify-items-center">
                      {productsByCategory[category.id]
                        ?.slice(0, visibleProducts[category.id])
                        .map((product, index) => (
                          <ProductCard data={product} key={index} isBigger={true}/>
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
          )
          }
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default SecondhandPage;
