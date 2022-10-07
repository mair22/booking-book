import axios from "axios";

const URL = "https://booking-book.herokuapp.com/api/";

export const fetchPost = () => axios.get(`${URL}/post`);
