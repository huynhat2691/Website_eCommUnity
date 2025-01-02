/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../Route/ProductCard/ProductCard";
import { Separator } from "../ui/separator";

const SimilarProducts = ({ currentProduct, scrollToTop }) => {
  const { allProducts } = useSelector((state) => state.product);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    if (allProducts && currentProduct) {
      const findSimilarProducts = () => {
        // Exclude current product
        const otherProducts = allProducts.filter(
          (p) => p._id !== currentProduct._id
        );

        // Helper function to calculate Jaccard similarity
        const calculateJaccardSimilarity = (str1, str2) => {
          const set1 = new Set(str1.toLowerCase().split(" "));
          const set2 = new Set(str2.toLowerCase().split(" "));
          const intersection = new Set([...set1].filter((x) => set2.has(x)));
          const union = new Set([...set1, ...set2]);
          return intersection.size / union.size;
        };

        // Find products with same subclassification
        const sameSubclassification = otherProducts.filter(
          (p) => p.subclassification === currentProduct.subclassification
        );

        // Find products with same subcategory
        const sameSubcategory = otherProducts.filter(
          (p) =>
            p.subcategory === currentProduct.subcategory &&
            !sameSubclassification.includes(p)
        );

        // Find products with similar names (at least 3 words in common)
        const similarNames = otherProducts.filter((p) => {
          const words1 = currentProduct.name.toLowerCase().split(" ");
          const words2 = p.name.toLowerCase().split(" ");
          const commonWords = words1.filter((word) => words2.includes(word));
          return (
            commonWords.length >= 3 &&
            !sameSubclassification.includes(p) &&
            !sameSubcategory.includes(p)
          );
        });

        // Find products with common keywords
        const keywords = currentProduct.name.toLowerCase().split(" ");
        const commonKeywordMatch = otherProducts.filter(
          (p) =>
            keywords.some((keyword) =>
              p.name.toLowerCase().includes(keyword)
            ) &&
            !sameSubclassification.includes(p) &&
            !sameSubcategory.includes(p) &&
            !similarNames.includes(p)
        );

        // Combine all results
        let combined = [
          ...sameSubclassification,
          ...sameSubcategory,
          ...similarNames,
          ...commonKeywordMatch,
        ];

        // Sort by Jaccard similarity
        combined.sort(
          (a, b) =>
            calculateJaccardSimilarity(b.name, currentProduct.name) -
            calculateJaccardSimilarity(a.name, currentProduct.name)
        );

        // Deduplicate and limit to 6 similar products
        return Array.from(new Set(combined)).slice(0, 6);
      };

      setSimilarProducts(findSimilarProducts());
    }
  }, [allProducts, currentProduct]);

  if (!currentProduct || similarProducts.length === 0) return null;

  const handleProductClick = () => {
    scrollToTop();
  };

  return (
    <div className="w-[1300px] mx-auto">
      <h2 className="text-[20px] font-[400]">Sản phẩm tương tự</h2>
      <Separator className="my-5" />
      <div className="grid grid-cols-6 gap-3 justify-items-center mb-12">
        {similarProducts.map((product, index) => (
          <div key={index} onClick={handleProductClick}>
            <ProductCard data={product} isBigger={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
