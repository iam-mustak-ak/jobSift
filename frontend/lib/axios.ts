import { API_BASE_URL } from "@/lib/api";
import axios from "axios";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 1000,
    headers: {
        "X-Custom-Header": "foobar",
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default apiClient;
