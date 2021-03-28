import axios from 'axios';

const axiosClient = axios.create({ timeout: 3000 });

export default axiosClient;
