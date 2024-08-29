import axios from "axios"

const URL_Local= "http://192.168.0.10:3333";

export const API=  axios.create({
    baseURL: URL_Local
})