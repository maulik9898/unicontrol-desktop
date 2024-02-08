import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.unicontrol.enmatter.co.in/v1/',
  timeout: 5000,
});


axiosInstance.interceptors.request.use(async (req) => {
  const token = await fetchAuthSession()
  req.headers.set("Authorization", token.tokens?.idToken?.toString())
  return req
})


export default axiosInstance
