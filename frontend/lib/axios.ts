import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    timeout: 1000,
    headers: {
        "X-Custom-Header": "foobar",
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default apiClient;
