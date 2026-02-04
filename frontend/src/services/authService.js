import axios from "axios";

export function login(email, password) {
    return axios.post("http://localhost:8080/api/login", {
        email,
        password
    });
}
