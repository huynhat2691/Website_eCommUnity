import axios from "axios";
import { server } from "../../server";

// add product
export const addProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "AddProductRequest",
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(
      `${server}/product/add-product`,
      newForm,
      config
    );

    dispatch({
      type: "AddProductSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "AddProductFail",
      payload: error.response.data.message,
    });
  }
};

export const resetAddProductSuccess = () => ({
  type: "resetAddProductSuccess",
});

// get all products of shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });
    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// get approved products of shop
export const getApprovedProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getApprovedProductsShopRequest",
    });
    const { data } = await axios.get(
      `${server}/product/get-approved-products-shop/${id}`
    );
    dispatch({
      type: "getApprovedProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getApprovedProductsShopFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// get a single approved product of shop
export const getApprovedProductShop = (shopId, productId) => async (dispatch) => {
  try {
    dispatch({
      type: "getApprovedProductShopRequest",
    });
    const { data } = await axios.get(
      `${server}/product/get-approved-product-shop/${shopId}/${productId}`
    );
    dispatch({
      type: "getApprovedProductShopSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "getApprovedProductShopFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// shop delete product
export const shopDeleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "shopDeleteProductRequest",
    });
    const { data } = await axios.delete(
      `${server}/product/delete-product/${id}`,
      { withCredentials: true }
    );
    dispatch({
      type: "shopDeleteProductSuccess",
      payload: { message: data.message, id: id },
    });
    // Sau khi xóa thành công, gọi lại action để lấy danh sách sản phẩm mới
    dispatch(getAllProductsShop(data.shop._id));
  } catch (error) {
    dispatch({
      type: "shopDeleteProductFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// admin delete product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });
    const { data } = await axios.delete(
      `${server}/product/delete-product/${id}`,
      { withCredentials: true }
    );
    dispatch({
      type: "deleteProductSuccess",
      payload: { message: data.message, id: id },
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// get all used products
export const getAllUsedProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsedProductsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-used-products`);
    dispatch({
      type: "getAllUsedProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsedProductsFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// get all products
export const adminGetAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "adminGetAllProductsRequest",
    });

    const { data } = await axios.get(
      `${server}/product/admin-get-all-products`
    );
    dispatch({
      type: "adminGetAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "adminGetAllProductsFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// update product status
export const updateProductStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: "updateProductStatusRequest" });

    const { data } = await axios.put(`${server}/product/update-status/${id}`, {
      status,
    });

    dispatch({
      type: "updateProductStatusSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "updateProductStatusFail",
      payload: error.response.data.message,
    });
  }
};

export const adminUpdateProductStatus = (productId, newStatus) => ({
  type: "adminUpdateProductStatus",
  payload: { productId, newStatus },
});

// update product
export const updateProduct = (id, newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "updateProductRequest",
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    // Thêm trạng thái "pending" vào newForm
    newForm.append("status", "pending");

    const { data } = await axios.put(
      `${server}/product/update-product/${id}`,
      newForm,
      config
    );

    dispatch({
      type: "updateProductSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "updateProductFail",
      payload: error.response.data.message,
    });
  }
};

// admin add product
export const adminAddProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "AdminAddProductRequest",
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(
      `${server}/product/admin-add-product`,
      newForm,
      config,
    );

    dispatch({
      type: "AdminAddProductSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "AdminAddProductFail",
      payload: error.response.data.message,
    });
  }
};

export const resetAdminAddProductSuccess = () => ({
  type: "resetAdminAddProductSuccess",
});

// get all products of admin
export const getAllProductsAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsAdminRequest",
    });
    const { data } = await axios.get(
      `${server}/product/get-all-products-admin`
    );
    dispatch({
      type: "getAllProductsAdminSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsAdminFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};