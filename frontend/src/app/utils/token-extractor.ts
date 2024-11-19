import { jwtDecode } from "jwt-decode";

type Decoded = {
    email: string;
    role: string;
    exp: string
};

export default function extractData(): Decoded | null {
    const token = localStorage.getItem("accessToken");

    if (token) {
        const decoded: Decoded = jwtDecode(token);
        return decoded;
    }
    return null
}
