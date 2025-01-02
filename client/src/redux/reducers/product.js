import { createAction, createReducer } from "@reduxjs/toolkit";

const clearErrors = createAction("clearErrors");

const initialState = {
  isLoading: true,
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("AddProductRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("AddProductSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase("AddProductFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // reset add product success
    .addCase("resetAddProductSuccess", (state) => {
      state.success = false;
    })

    // get all products shop
    .addCase("getAllProductsShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllProductsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase("getAllProductsShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get approved products shop
    .addCase("getApprovedProductsShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getApprovedProductsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.approvedProducts = action.payload;
    })
    .addCase("getApprovedProductsShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get a single approved product shop
    .addCase("getApprovedProductShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getApprovedProductShopSuccess", (state, action) => {
      state.isLoading = false;
      state.approvedProduct = action.payload;
    })
    .addCase("getApprovedProductShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // shop delete product
    .addCase("shopDeleteProductRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("shopDeleteProductSuccess", (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message;
      state.products = state.products.filter(
        (product) => product._id !== action.payload.id
      );
    })
    .addCase("shopDeleteProductFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // admin delete product
    .addCase("deleteProductRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteProductSuccess", (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message;
      state.allProducts = state.allProducts.filter(
        (product) => product._id !== action.payload.id
      );
    })
    .addCase("deleteProductFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all products
    .addCase("getAllProductsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllProductsSuccess", (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload;
    })
    .addCase("getAllProductsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all used products
    .addCase("getAllUsedProductsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllUsedProductsSuccess", (state, action) => {
      state.isLoading = false;
      state.usedProducts = action.payload;
    })
    .addCase("getAllUsedProductsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // admin get all products
    .addCase("adminGetAllProductsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("adminGetAllProductsSuccess", (state, action) => {
      state.isLoading = false;
      state.adminAllProducts = action.payload;
    })
    .addCase("adminGetAllProductsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // update product status
    .addCase("updateProductStatusRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("updateProductStatusSuccess", (state, action) => {
      state.isLoading = false;
      const updatedProduct = action.payload;
      const index = state.adminAllProducts.findIndex(
        (product) => product._id === updatedProduct._id
      );

      if (index !== -1) {
        state.adminAllProducts.splice(index, 1);

        if (updatedProduct.status === "pending") {
          state.adminAllProducts.unshift(updatedProduct);
        } else {
          state.adminAllProducts.push(updatedProduct);
        }
      }
    })

    // admin update product status
    .addCase("adminUpdateProductStatus", (state, action) => {
      state.adminAllProducts = state.adminAllProducts.map((product) =>
        product._id === action.payload.productId
          ? { ...product, status: action.payload.newStatus }
          : product
      );
    })

    // update product
    .addCase("updateProductRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("updateProductSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase("updateProductFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // admin add product
    .addCase("AdminAddProductRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("AdminAddProductSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase("AdminAddProductFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // reset admin add product success
    .addCase("resetAdminAddProductSuccess", (state) => {
      state.success = false;
    })

    .addCase("updateProductStatusFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all products admin
    .addCase("getAllProductsAdminRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllProductsAdminSuccess", (state, action) => {
      state.isLoading = false;
      state.adminProducts = action.payload;
    })
    .addCase("getAllProductsAdminFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // clear errors
    .addCase(clearErrors, (state) => {
      state.error = null;
    });
});
