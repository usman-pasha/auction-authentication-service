import axios from "axios"

// Define a type for the HTTP method
/**
 * @typedef {"GET" | "POST" | "PUT" | "DELETE" | "PATCH"} HttpMethod
 */

// Common function for making HTTP requests
const request = async (
    method,
    path,
    data = null,
    req = null
) => {
    const headers = {
        Accept: "application/json",
    };

    if (method === "POST" || method === "PUT" || method === "PATCH") {
        headers["Content-Type"] = "application/json";
    }

    const bearerToken = req?.headers?.authorization;
    const token = bearerToken?.split("Bearer ")[1];

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        method,
        url: `${path}`,
        headers,
        data: data ? JSON.stringify(data) : null,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error(`Error during ${method} request to ${path}:`, error);
        throw error;
    }
};

// Common function for making GET requests
export const getMethod = async (path, params = null, req = null) => {
    return request("GET", path, params, req);
};

// Common function for making POST requests
export const postMethod = async (path, data, req = null) => {
    return request("POST", path, data, req);
};

// Common function for making PUT requests
export const putMethod = async (path, data, req = null) => {
    return request("PUT", path, data, req);
};
// Common function for making PATCH requests
export const patchMethod = async (path, data, req = null) => {
    return request("PATCH", path, data, req);
};

// Common function for making DELETE requests
export const deleletMethod = async (path, req = null) => {
    return request("DELETE", path, req);
};
