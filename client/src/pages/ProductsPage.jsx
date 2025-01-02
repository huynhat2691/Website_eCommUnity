import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import { Separator } from "../components/ui/separator";
import { ChevronRight, ChevronUp, List } from "lucide-react";
import { getAllSellersAdmin } from "../redux/actions/seller";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.product);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const subcategoryData = searchParams.get("subcategory");
  const [data, setData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000000]);
  const [rating, setRating] = useState(-1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState(null);
  const [activeSubclassification, setActiveSubclassification] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  const category = location.state?.category;

  useEffect(() => {
    dispatch(getAllSellersAdmin());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state) {
      if (location.state.activeCategory) {
        setActiveCategory(location.state.activeCategory);
      }
      if (location.state.activeSubcategory) {
        setActiveSubcategory(location.state.activeSubcategory);
        setOpenSubcategory(location.state.activeSubcategory);
      }
      if (location.state.activeSubclassification) {
        setActiveSubclassification(location.state.activeSubclassification);
      }
    }
  }, [location.state]);

  useEffect(() => {
    let filteredData = allProducts;

    if (categoryData) {
      filteredData = filteredData?.filter((i) => i.category === categoryData);
    }

    if (subcategoryData) {
      filteredData = filteredData.filter(
        (i) => i.subcategory === subcategoryData
      );
    }

    const subclassificationData = searchParams.get("subclassification");
    if (subclassificationData) {
      filteredData = filteredData.filter(
        (i) => i.subclassification === subclassificationData
      );
    }

    filteredData = filteredData.filter((i) => i.hasClassifications || i.price);
    setData(filteredData);

    // Get unique cities from shops that have products in the filtered data
    const cities = [
      ...new Set(filteredData.map((product) => product.shop.city)),
    ];
    setAvailableCities(cities);
  }, [allProducts, categoryData, subcategoryData, searchParams]);

  useEffect(() => {
    let filtered = data?.filter((product) => {
      let price;
      if (product.hasClassifications) {
        price = Math.min(
          ...product.classifications.map((c) => parseInt(c.price, 10))
        );
      } else {
        price = parseInt(product.price, 10);
      }
      const priceMatch = price >= priceRange[0] && price <= priceRange[1];
      const ratingMatch = rating === -1 || product.ratings >= rating;

      // Lọc theo thành phố
      const cityMatch =
        selectedCities.length === 0 ||
        selectedCities.includes(product.shop.city);

      return priceMatch && ratingMatch && cityMatch;
    });

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "bestSelling":
        filtered.sort((a, b) => b.sold_out - a.sold_out);
        break;
      case "priceLowToHigh":
        filtered.sort((a, b) => {
          const priceA = a.hasClassifications
            ? Math.min(...a.classifications.map((c) => parseInt(c.price, 10)))
            : parseInt(a.price, 10);
          const priceB = b.hasClassifications
            ? Math.min(...b.classifications.map((c) => parseInt(c.price, 10)))
            : parseInt(b.price, 10);
          return priceA - priceB;
        });
        break;
      case "priceHighToLow":
        filtered.sort((a, b) => {
          const priceA = a.hasClassifications
            ? Math.max(...a.classifications.map((c) => parseInt(c.price, 10)))
            : parseInt(a.price, 10);
          const priceB = b.hasClassifications
            ? Math.max(...b.classifications.map((c) => parseInt(c.price, 10)))
            : parseInt(b.price, 10);
          return priceB - priceA;
        });
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [data, priceRange, rating, sortBy, selectedCities]);

  const handlePriceFilter = () => {
    const min = minPrice === "" ? 0 : parseInt(minPrice, 10);
    const max = maxPrice === "" ? 1000000000 : parseInt(maxPrice, 10);

    if (!isNaN(min) && !isNaN(max) && min <= max) {
      setPriceRange([min, max]);
    } else {
      alert("Vui lòng nhập khoảng giá hợp lệ.");
    }
  };

  const setPriceRangePreset = (min, max) => {
    setMinPrice(min.toString());
    setMaxPrice(max.toString());
    setPriceRange([min, max]);
  };

  const handleCategoryClick = () => {
    if (activeCategory === category.id) {
      setActiveCategory(null);
      setData(allProducts);
      const cities = [
        ...new Set(allProducts.map((product) => product.shop.city)),
      ];
      setAvailableCities(cities);
    } else {
      setActiveCategory(category.id);
      const filteredProducts = allProducts.filter(
        (product) => product.category === category?.id?.toString()
      );
      setData(filteredProducts);
      const cities = [
        ...new Set(filteredProducts.map((product) => product.shop.city)),
      ];
      setAvailableCities(cities);
    }
    setActiveSubcategory(null);
    setOpenSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory) => {
    if (activeSubcategory === subcategory.id) {
      setActiveSubcategory(null);
      setOpenSubcategory(null);
      const filteredProducts = allProducts.filter(
        (product) => product.category === category?.id?.toString()
      );
      setData(filteredProducts);
      const cities = [
        ...new Set(filteredProducts.map((product) => product.shop.city)),
      ];
      setAvailableCities(cities);
    } else {
      setActiveSubcategory(subcategory.id);
      setOpenSubcategory(subcategory.id);
      const filteredProducts = allProducts.filter(
        (product) => product.subcategory === subcategory.id.toString()
      );
      setData(filteredProducts);
      const cities = [
        ...new Set(filteredProducts.map((product) => product.shop.city)),
      ];
      setAvailableCities(cities);
    }
    setActiveCategory(null);
    setActiveSubclassification(null);
  };

  const handleSubclassificationClick = (subclassification) => {
    setActiveSubclassification(subclassification.id);
    const filteredProducts = allProducts.filter(
      (product) => product.subclassification === subclassification.id.toString()
    );
    setData(filteredProducts);
    const cities = [
      ...new Set(filteredProducts.map((product) => product.shop.city)),
    ];
    setAvailableCities(cities);
  };

  useEffect(() => {
    setSelectedCities((prevSelected) =>
      prevSelected.filter((city) => availableCities.includes(city))
    );
  }, [availableCities]);

  const handleCityChange = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  return (
    <div className="w-full">
      <Header />
      <div className="w-[1300px] mx-auto flex bg-white border rounded-lg m-4">
        <div className="w-1/5 p-4">
          <div className="flex items-center m-4">
            <List />
            <Link to="/">
              <h3 className="font-semibold ml-4">Tất Cả Danh Mục</h3>
            </Link>
          </div>
          <Separator />
          {category && (
            <div className="py-2 text-[15px]">
              <div
                className={`flex flex-row items-center cursor-pointer p-2 hover:bg-[#dadada] hover:rounded-lg hover:transition hover:ease-in-out hover:duration-200 ${
                  activeCategory === category.id ? "text-[#27b3e2]" : ""
                }`}
                onClick={handleCategoryClick}
              >
                {activeCategory === category.id ? (
                  <ChevronRight size={15} className="mr-2 flex-shrink-0" />
                ) : (
                  <div className="w-[15px] mr-2 flex-shrink-0"></div>
                )}
                <h3 className="font-[600] ">{category.title}</h3>
              </div>
              {category.subcategories &&
                category.subcategories.map((subcategory) => (
                  <div key={subcategory.id}>
                    <div
                      className={`flex flex-row border-t items-center justify-between cursor-pointer p-2 hover:bg-[#dadada] hover:rounded-lg hover:transition hover:ease-in-out hover:duration-200  
                      ${
                        activeSubcategory === subcategory.id
                          ? "text-[#27b3e2]"
                          : ""
                      }`}
                      onClick={() => handleSubcategoryClick(subcategory)}
                    >
                      <div className="flex flex-row items-center">
                        {activeSubcategory === subcategory.id ? (
                          <ChevronRight
                            size={15}
                            className="mr-2 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-[15px] mr-2 flex-shrink-0"></div>
                        )}
                        <div className="!w-[160px]">
                          <h3 className="font-normal ">{subcategory.title}</h3>
                        </div>
                      </div>
                      {subcategory.subclassifications && (
                        <ChevronUp
                          size={15}
                          className={`flex-shrink-0 transition-transform duration-300 ${
                            openSubcategory === subcategory.id
                              ? "transform rotate-180"
                              : ""
                          }`}
                        />
                      )}
                    </div>
                    {openSubcategory === subcategory.id &&
                      subcategory.subclassifications && (
                        <div className="ml-4">
                          {subcategory.subclassifications.map(
                            (subclassification) => (
                              <div
                                key={subclassification.id}
                                className={`flex flex-row items-center cursor-pointer p-2 hover:bg-[#dadada] hover:rounded-lg hover:transition hover:ease-in-out hover:duration-200 ${
                                  activeSubclassification ===
                                  subclassification.id
                                    ? "text-[#27b3e2]"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSubclassificationClick(
                                    subclassification
                                  )
                                }
                              >
                                {activeSubclassification ===
                                subclassification.id ? (
                                  <ChevronRight
                                    size={15}
                                    className="mr-2 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-[15px] mr-2 flex-shrink-0"></div>
                                )}
                                <h3 className="font-[300]">
                                  {subclassification.title}
                                </h3>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                ))}
            </div>
          )}
          <Separator />
          <h3 className="text-lg font-semibold my-4 ">Bộ lọc</h3>

          {/* Filter nơi bán */}
          <div className="mb-4">
            <Label className="block font-semibold my-4">Nơi bán</Label>
            <div className="flex flex-col max-h-60 overflow-y-auto">
              {availableCities.map((city) => (
                <Label key={city} className="flex items-center p-2">
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(city)}
                    onChange={() => handleCityChange(city)}
                    className="mr-2"
                  />
                  {city}
                </Label>
              ))}
            </div>
          </div>

          {/* Filter khoảng giá */}
          <div className="mb-4">
            <Label className="block font-semibold my-4">Khoảng giá</Label>
            <div className="flex items-center mb-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Giá từ"
                className="w-1/2 p-2 border rounded mr-2"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Đến giá"
                className="w-1/2 p-2 border rounded"
              />
            </div>
            <Button
              onClick={handlePriceFilter}
              className="w-full p-2 bg-[#27b3e2] text-white rounded"
            >
              Áp dụng
            </Button>
          </div>

          {/* Các nút khoảng giá */}
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setPriceRangePreset(0, 100000)}
              className="m-1 p-2 border rounded"
            >
              Dưới 100k
            </Button>
            <Button
              variant="outline"
              onClick={() => setPriceRangePreset(100000, 500000)}
              className="m-1 p-2 border rounded"
            >
              100k - 500k
            </Button>
            <Button
              variant="outline"
              onClick={() => setPriceRangePreset(500000, 1000000)}
              className="m-1 p-2 border rounded"
            >
              500k - 1tr
            </Button>
            <Button
              variant="outline"
              onClick={() => setPriceRangePreset(1000000, 1000000000)}
              className="m-1 p-2 border rounded"
            >
              Trên 1tr
            </Button>
          </div>
          <Separator />

          {/* Filter đánh giá */}
          <div className="mb-4">
            <Label className="block font-semibold my-4">Đánh giá</Label>
            <div className="flex flex-col">
              {[5, 4, 3, 2, 1].map((star) => (
                <Button
                  variant="outlined"
                  key={star}
                  onClick={() => setRating(star)}
                  className={` my-1 items-center p-2 ${
                    rating === star ? "bg-[#27b3e2] text-white" : ""
                  }`}
                >
                  <div className="flex items-center justify-between w-[120px]">
                    <div>
                      {[...Array(star)].map((_, index) => (
                        <span key={index} className="text-yellow-400">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2">trở lên</span>
                  </div>
                </Button>
              ))}
              <Button
                variant="outlined"
                onClick={() => setRating(-1)}
                className={`p-2 ${
                  rating === -1 ? "bg-[#27b3e2] text-white" : ""
                }`}
              >
                Tất cả đánh giá
              </Button>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="w-4/5 p-4">
          {/* Nút sắp xếp */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <p className="mr-2">Sắp xếp theo</p>
              <div>
                <Button
                  variant="outline"
                  onClick={() => setSortBy("newest")}
                  className={`mr-2 p-2 border rounded ${
                    sortBy === "newest" ? "bg-[#27b3e2] text-white" : ""
                  }`}
                >
                  Mới nhất
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSortBy("bestSelling")}
                  className={`mr-2 p-2 border rounded ${
                    sortBy === "bestSelling" ? "bg-[#27b3e2] text-white" : ""
                  }`}
                >
                  Bán chạy
                </Button>
              </div>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Giá</option>
              <option value="priceLowToHigh">Giá từ thấp đến cao</option>
              <option value="priceHighToLow">Giá từ cao đến thấp</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-4">
            {filteredProducts &&
              filteredProducts.map((i, index) => (
                <ProductCard data={i} key={index} isProductPage={true} />
              ))}
          </div>
          {filteredProducts && filteredProducts.length === 0 ? (
            <h1 className="text-center w-full pb-[100px] text-[20px]">
              Không tìm thấy sản phẩm nào!
            </h1>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
