import axios from "axios";
import { BASE_URL } from "./baseUrl";
import { commonApi } from "./commonApi";

// admin login
export const adminLogin = async (reqBody) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/admin/login/`, reqBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to login', error);
    throw error;
  }
};
  
// add stores
export const addStore = async (reqBody) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("POST", `${BASE_URL}/vendors/store-types/`, reqBody, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to add store:", error);
    throw error;
  }
};

// view stores
export const viewStores = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/vendors/store-types/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view stores:", error);
    throw error;
  }
};

// delete stores
export const deleteStore = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("DELETE", `${BASE_URL}/vendors/store-types/${id}/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to delete store:", error);
    throw error;
  }
};

// edit stores
export const editStore = async (reqBody,id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("PATCH", `${BASE_URL}/vendors/store-types/${id}/`, reqBody, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to add store:", error);
    throw error;
  }
};

// Add Vendor
export const addVendor = async (formData) => {
  try {
    const response = await commonApi('POST', `${BASE_URL}/vendors/vendors/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to add vendor', error);
    throw error;
  }
};

// view vendors
export const viewVendors = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/vendors/vendors-view/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view vendors:", error);
    throw error;
  }
};

export const acceptRejectVendor = async (id, action) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const payload = JSON.stringify({ is_approved: action === "accept" ? true : false }); 
    console.log("Payload sent:", payload);
    const response = await commonApi("PUT",`${BASE_URL}/vendors/vendor-accept-reject/${id}/`,payload,{ headers });
    console.log("API response:", response);
    return response.data;
  } catch (error) {
    console.error("Error response:", error.response?.data || error.message);
    throw error;
  }
};

// view single vendor 
export const viewSingleVendor = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/vendors/vendors-admin-view/${id}/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view vendors:", error);
    throw error;
  }
};

export const enableDisableVendor = async (id, action) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const payload = JSON.stringify({ is_active: action === "enable" }); 
    console.log("Payload sent:", payload);
    const response = await commonApi(
      "PUT",
      `${BASE_URL}/vendors/vendor-enable-disable/${id}/`,
      payload,
      { headers }
    );
    console.log("API response:", response);
    return response.data;
  } catch (error) {
    console.error("Error response:", error.response?.data || error.message);
    throw error;
  }
};

// edit vendor 
export const updateVendor = async (formData, id) => {
  try {
    const response = await commonApi('PATCH', `${BASE_URL}/vendors/vendors-admin-view/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update vendor', error);
    throw error;
  }
};

// delete vendor
export const deleteVendor = async (formData, id) => {
  try {
    const response = await commonApi('DELETE', `${BASE_URL}/vendors/vendors-admin-view/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update vendor', error);
    throw error;
  }
};

// add category
export const addCategory = async (reqBody) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("POST", `${BASE_URL}/vendors/categories/`, reqBody, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to add category:", error);
    throw error;
  }
};

// view category
export const viewCategory = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/vendors/categories/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view category:", error);
    throw error;
  }
};

// edit category
export const updateCategory = async (reqBody,id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("PATCH", `${BASE_URL}/vendors/categories/${id}/`, reqBody, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to edit category:", error);
    throw error;
  }
};

// delete category
export const deleteCategory = async (reqBody,id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("DELETE", `${BASE_URL}/vendors/categories/${id}/`, reqBody, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to edit category:", error);
    throw error;
  }
};

// add sub category
export const addsubCategory = async (reqBody) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("POST", `${BASE_URL}/vendors/admin/subcategories/create/`, reqBody, headers);
    return response;
  } catch (error) {
    console.error("Failed to add category:", error);
    throw error;
  }
};

// view subcategory
export const viewsubCategory = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/vendors/admin/subcategories/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view subcategory:", error);
    throw error;
  }
};

// edit subcategory
export const updateSubCategory = async (reqBody,id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("PATCH", `${BASE_URL}/vendors/admin/subcategories/${id}/`, reqBody, headers);
    return response;
  } catch (error) {
    console.error("Failed to edit subcategory:", error);
    throw error;
  }
}
//delete subcat
;export const deleteSubCategory = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("DELETE", `${BASE_URL}/vendors/admin/subcategories/${id}/`, "", headers);
    return response;
  } catch (error) {
    console.error("Failed to delete subcategory:", error);
    throw error;
  }
};
//view orders

export const viewOrders = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/cart/order-list-admin/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view Orders:", error);
    throw error;
  }
};

//view specific orderdetails
export const viewSpecificOrder=async(id)=>{
  try {
    const token=localStorage.getItem("access_token");
    if(!token){
      throw new Error("Authentication token is missing") 
    };
     const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/cart/orders/admin/${id}/`, headers);
    return response.data;
  } catch (error) {
    console.log("failed to view specific order details:",error);
    throw error;
    
  }
}
//update order status

export const updateOrderStatus = async (reqBody, id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      // DO NOT set 'Content-Type' here when sending FormData
    };

    // Pass headers inside options object
    const response = await commonApi(
      "POST",
      `${BASE_URL}/cart/orders/update-status/${id}/`,
      reqBody,
      { headers }
    );

    return response;
  } catch (error) {
    console.log("Failed to update order status:", error);
    throw error;
  }
};
// delete all orders
export const deleteAllOrders = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("DELETE", `${BASE_URL}/cart/delete-all-orders/`, "", headers);
    return response;
  } catch (error) {
    console.error("Failed to delete all orders:", error);
    throw error;
  }
};
//get specific user orders
export const viewSpecificUserOrders=async(id)=>{
  try {
    const token=localStorage.getItem("access_token");
    if(!token){
      throw new Error("Authentication token is missing") 
    };
     const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/cart/admin/users/${id}/orders/`, headers);
    return response.data;
  } catch (error) {
    console.log("failed to view specific order details:",error);
    throw error;
    
  }
}

// create coupon
export const addCoupon = async (reqBody) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("POST", `${BASE_URL}/users/coupons/`, reqBody, headers);
    return response;
  } catch (error) {
    console.error("Failed to add coupon:", error);
    throw error;
  }
//view coupons
};export const viewCoupons = async (reqBody) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/users/coupons/view/`, reqBody, headers);
    return response;
  } catch (error) {
    console.error("Failed to get coupon:", error);
    throw error;
  }
};

//edit coupons
export const editCoupons = async (reqBody,id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("PATCH", `${BASE_URL}/users/coupons/${id}/`, reqBody, headers);
    return response;
  } catch (error) {
    console.error("Failed to edit coupon:", error);
    throw error;
  }
}
//delete coupon
export const deleteCoupon = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("DELETE", `${BASE_URL}/users/coupons/${id}/`, "", headers);
    return response;
  } catch (error) {
    console.error("Failed to edit coupon:", error);
    throw error;
  }
}

// add colours
export const addColour = async (formData, token) => {
  try {
    const response = await commonApi('POST', `${BASE_URL}/fashion/colors/create/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add color', error);
    throw error;
  }
};



// view colours
export const viewColours = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/fashion/colors/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view category:", error);
    throw error;
  }
};

// add fahsion product 
export const addFashionProduct = async (reqBody) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('POST', `${BASE_URL}/fashion/clothing/admin/`, reqBody, {
      headers: {
        'Content-type':"application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

//add imagefiles of fashion product
export const addImage_fashion = async (formData) => {
  try {
        const token = localStorage.getItem("access_token");

    const response = await commonApi('POST', `${BASE_URL}/fashion/clothing/images/admin/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, 
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to add images', error);
    throw error;
  }
};

// update fashion product
export const updateProduct = async (id,formData) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('PUT', `${BASE_URL}/fashion/clothing/${id}/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

// view fashion products
export const viewProducts = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/fashion/clothing/list/admin/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view category:", error);
    throw error;
  }
};
// View fashion product details by id
export const viewProduct = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/fashion/clothing/${id}/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view product:", error);
    throw error;
  }
};
//delete fashion product
export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("DELETE", `${BASE_URL}/fashion/clothing/${id}/`,"", headers);
    return response;
  } catch (error) {
    console.error("Failed to view product:", error);
    throw error;
  }
};
//delete productimage fashion

export const deleteProductImage = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("DELETE", `${BASE_URL}/fashion/clothing-images/admin/${id}/`," ", headers);
    return response;
  } catch (error) {
    console.error("Failed to view product:", error);
    throw error;
  }
};
//update fashion product image

export const updateProductImage = async (id,reqBody) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("PATCH", `${BASE_URL}/fashion/clothing-images/admin/${id}/`,reqBody, headers);
    return response;
  } catch (error) {
    console.error("Failed to view product:", error);
    throw error;
  }
};
// view users
export const viewUsers = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/users/users/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view users:", error);
    throw error;
  }
};

// view user by id
export const viewUsersById = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/users/users/${id}/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view users:", error);
    throw error;
  }
};
// delete user

export const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("DELETE", `${BASE_URL}/users/users/${id}/`, headers);
    return response;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};
//update userdetails
export const updateUserDetails = async (data,id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await commonApi(
      "PATCH",
      `${BASE_URL}/users/users/${id}/`,
     
      data,
       headers,
    );

    return response;
  } catch (error) {
    console.error("Failed to update user details:", error);
    throw error;
  }
};
//update user adress
export const updateUserAddress = async (formData,userId,addressId) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await commonApi(
      "PATCH",
      `${BASE_URL}/users/admin/users/${userId}/addresses/${addressId}/`,
     formData,
      headers,
     
    );

    return response;
  } catch (error) {
    console.error("Failed to update user address:", error);
    throw error;
  }
};

// add coupons
// export const addCoupons = async (reqBody) => {
//   try {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       throw new Error("Authentication token is missing");
//     }
//     const headers = {
//       Authorization: `Bearer ${token}`,
//     };
//     const response = await commonApi("POST", `${BASE_URL}/fashion/coupons/`, reqBody, headers);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to add coupons:", error);
//     throw error;
//   }
// };

// view coupons
// export const viewCoupons = async (reqBody) => {
//   try {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       throw new Error("Authentication token is missing");
//     }
//     const headers = {
//       Authorization: `Bearer ${token}`,
//     };
//     const response = await commonApi("GET", `${BASE_URL}/fashion/coupons/`, reqBody, headers);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to view coupons:", error);
//     throw error;
//   }
// };

// user wishlist view
export const viewWishlist = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/users/admin/users/wishlists/${id}/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view users wishlist:", error);
    throw error;
  }
};

// user reports view
export const viewReports = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/users/reports/`, headers);
    return response;
  } catch (error) {
    console.error("Failed to view users reports:", error);
    throw error;
  }
};

// user reviews view
export const viewReviews = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/users/reviews/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view users reviews:", error);
    throw error;
  }
};

// products count
export const productsCount = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/fashion/clothing-products/count/`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to view products count:", error);
    throw error;
  }
};

// add sub admins
export const addSubadmin = async (reqBody) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("POST", `${BASE_URL}/users/create-staff/`, reqBody, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to add coupons:", error);
    throw error;
  }
};

// view sub admins
export const viewSubadmins = async (reqBody) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/users/staff/`, reqBody, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to add coupons:", error);
    throw error;
  }
};

// edit sub admin
export const editSubadmin = async (reqBody , phoneNumber) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("PATCH", `${BASE_URL}/users/staff/${phoneNumber}/update/`, reqBody, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to add subadmin:", error);
    throw error;
  }
};

// delete sub admin
export const deleteSubadmin = async (reqBody , phoneNumber) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("DELETE", `${BASE_URL}/users/staff/${phoneNumber}/delete/`, reqBody, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to delete subadmin:", error);
    throw error;
  }
};
//sub admin login
export const subAdminLogin = async (reqBody) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/staff-login/`, reqBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to login', error);
    throw error;
  }
};

//view bigbuyorders

export const viewBigBuyOrders = async ( ) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("GET", `${BASE_URL}/users/admin/big-buy-orders/`, "", headers);
    return response.data;
  } catch (error) {
    console.error("Failed to get big buy orders:", error);
    throw error;
  }
};

//edit bigbuyorders

export const editBigBuyOrders = async (reqBody,id ) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("PATCH", `${BASE_URL}/users/admin/big-buy-order/${id}/update/`, reqBody, headers);
    return response;
  } catch (error) {
    console.error("Failed to edit big buy orders:", error);
    throw error;
  }
};

//delete bigbuyorders

export const deleteBigBuyOrders = async (id ) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await commonApi("DELETE", `${BASE_URL}/users/admin/big-buy-order/${id}/`, "", headers);
    return response;
  } catch (error) {
    console.error("Failed to delete big buy orders:", error);
    throw error;
  }
};

// add food product 
export const addProduct = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('POST', `${BASE_URL}/food/dishes/admin/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

// add grocery product 
export const addGroceryProduct = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('POST', `${BASE_URL}/grocery/products/admin/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

// get grocery products
export const getGroceryProducts = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/grocery/products/list/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};
//get grocery product by id
export const getGroceryProductById = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/grocery/products/admin/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

// get food products
export const getFoodProducts = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/food/dishes/list/admin/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

// get vendors products
export const getVendorsProducts = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/vendors/products/vendor/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to get vendors product', error);
    throw error;
  }
};

// get vendors pending details
export const getVendorsPendingDetails = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/vendors/vendors/pending/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get vendors product', error);
    throw error;
  }
};

// approve pending details 
export const approvePendingDetails = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('POST', `${BASE_URL}/vendors/approve-changes/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get vendors product', error);
    throw error;
  }
};

// update food product
export const updateFoodProduct = async (formData,id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('PATCH', `${BASE_URL}/food/dishes/admin/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

// delete food product
export const deleteFoodProduct = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('DELETE', `${BASE_URL}/food/dishes/admin/${id}/`," ", {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

//getFoodProductById 
export const getFoodProductById  = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/food/dishes/admin/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

// update  grocery product
export const updateGroceryProduct = async (formData,id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('PATCH', `${BASE_URL}/grocery/products/admin/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

// delete  grocery product
export const deleteGroceryProduct = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('DELETE', `${BASE_URL}/grocery/products/admin/${id}/`, " ", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to delete product', error);
    throw error;
  }
};

//get notifications
export const getNotifications = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/users/admin-notifications/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

//mark as read notifications
export const markAsRead = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('POST', `${BASE_URL}/users/admin-notifications/${id}/mark_read/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

//delete notifications
export const deleteNotification = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('DELETE', `${BASE_URL}/users/admin-notifications/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

// mark as all read
export const markAllRead = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('POST', `${BASE_URL}/users/admin-notifications/mark_all_read/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

// get notification count
export const getNotificationCounts = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/users/admin-notifications/unread_count/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};

//get delivery boys

export const getDeliveryBoys = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/delivery/delivery_boys/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get delivery boys', error);
    throw error;
  }
};
export const getDeliveryBoy = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/delivery/delivery_boys/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to get delivery boy details', error);
    throw error;
  }
};
//add deliveryboy


export const addDeliveryBoy = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('POST', `${BASE_URL}/delivery/delivery_boys/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }

};
//delete deliveryboy

export const deleteDeliveryBoy = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('DELETE', `${BASE_URL}/delivery/delivery_boys/${id}/`, "", {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};
//edit deliveryBoy
export const updateDeliveryBoy = async (id,reqBody) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi('PATCH', `${BASE_URL}/delivery/delivery_boys/${id}/`, reqBody, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to add product', error);
    throw error;
  }
};
//get deliveryboy accepted orders

export const getAcceptedOrders = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/delivery/delivery_boys/${id}/accepted_orders/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get delivery boys', error);
    throw error;
  }
};

//get dashboard graph data
export const getGraphData = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/cart/stats/monthly-orders/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get graph data', error);
    throw error;
  }
};
//get dashboard sales progress
export const getSalesProgress = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/cart/stats/daily-revenue/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get sales progress', error);
    throw error;
  }
};
// get dashboard stats overview
export const getStatsOverview = async (date = '') => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const url = date
      ? `${BASE_URL}/cart/stats/overview/?date=${date}`
      : `${BASE_URL}/cart/stats/overview/`;

    const response = await commonApi('GET', url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to get stats overview', error);
    throw error;
  }
};

export const getProduct_Vendor_Count = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await commonApi('GET', `${BASE_URL}/cart/stats/product-vendor-count/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get product and vendors count', error);
    throw error;
  }
};
//get carousel 
export const getAllCarouselAds = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Authentication token is missing");

    const response = await commonApi("GET", `${BASE_URL}/vendors/app-carousel/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch carousel ads", error);
    throw error;
  }
};
//add carousel
export const addCarouselAd = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi(
      'POST',
      `${BASE_URL}/vendors/app-carousel/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Failed to add carousel ad', error);
    throw error;
  }
};
//update carousel
export const updateCarouselAd = async (id, formData) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi(
      'PATCH',
      `${BASE_URL}/vendors/app-carousel/${id}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error(`Failed to update carousel ad with id ${id}`, error);
    throw error;
  }
};
//delete carousel
export const deleteCarouselAd = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await commonApi(
      'DELETE',
      `${BASE_URL}/vendors/app-carousel/${id}/`,
      "",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error(`Failed to delete carousel ad with id ${id}`, error);
    throw error;
  }
};



export const listCommission = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    
    const response = await commonApi("GET",`${BASE_URL}/vendors/admin/vendor-commissions`, headers);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch commissions:", error);
    throw error;
  }
};

export const updateCommissionStatus = async (commissionId, paymentStatus) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    
    const body = {
      commission_id: commissionId,
      payment_status: paymentStatus,
    };
    
    const response = await commonApi("POST",`${BASE_URL}/vendors/admin/vendor-commissions/`, headers, body);
    return response.data;
  } catch (error) {
    console.error("Failed to update commission status:", error);
    throw error;
  }
};




export const listVendorStories = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    
    const response = await fetch(`${BASE_URL}/vendors/vendor-videos-admin/`, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    throw error;
  }
};

export const getStoryDetail = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    
    const response = await fetch(`${BASE_URL}/vendors/vendor-videoadmin/${id}/`, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch story detail');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch story detail:", error);
    throw error;
  }
};

export const listSubcategoryRequests = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    
    const response = await fetch(`${BASE_URL}/vendors/subcategory-requests/`, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch subcategory requests');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch subcategory requests:", error);
    throw error;
  }
};

export const approveSubcategoryRequest = async (id, action) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${BASE_URL}/vendors/admin/approve-subcategory/${id}/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ action })
    });
    
    if (!response.ok) {
      throw new Error('Failed to process subcategory request');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to process subcategory request:", error);
    throw error;
  }
};