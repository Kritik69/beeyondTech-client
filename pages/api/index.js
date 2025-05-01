// export const baseUrl = "http://localhost:5001/api/";
export const baseUrl =
  "https://beeyondtech-server-562780667822.us-central1.run.app/api/";

// Authentication APIs
export const loginAPI = baseUrl + "auth/login";
export const registerAPI = baseUrl + "auth/register";

// Product APIs
export const getProductsAPI = baseUrl + "products";
export const getProductByIdAPI = (id) => baseUrl + `products/${id}`;
export const createProductAPI = baseUrl + "products";
export const updateProductAPI = (id) => baseUrl + `products/${id}`;
export const deleteProductAPI = (id) => baseUrl + `products/${id}`;

// Order APIs
export const createOrderAPI = baseUrl + "orders";
export const getOrdersAPI = baseUrl + "orders";
export const getOrderByIdAPI = (id) => baseUrl + `orders/${id}`;
export const updateOrderAPI = (id) => baseUrl + `orders/${id}`;
export const deleteOrderAPI = (id) => baseUrl + `orders/${id}`;
export const getMyOrdersAPI = (id) => baseUrl + `orders/myorders/${id}`;
export const getMyOrderByIdAPI = (id) => baseUrl + `orders/myorders/${id}`;
