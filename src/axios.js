import axios from "axios";
import router from "./router";
import Element from "element-ui"

axios.defaults.baseURL = "http://localhost:9000"

const request = axios.create({
	timeout: 5000,
	headers: {
		'Content-Type': "application/json; charset=utf-8"
	}
})

request.interceptors.request.use(config => {
	config.headers['token'] = localStorage.getItem("token")
	return config
})

request.interceptors.response.use(
	response => {
		console.log("response ->" + response)
		let res = response.data

		if (res.code === 200) {
			return response
		} else {
			if (res.code===401){
				localStorage.removeItem("token")
				router.push("/login");
			}
			Element.Message.error( res.message)
			return Promise.reject(response.data.message)
		}
	},
	error => {
		console.log(error)
		if (error.response.data) {
			error.massage = error.response.data.message
		}
		if (error.response.status === 401) {
			router.push("/login")
		}

		Element.Message.error(error.massage, {duration: 3000})
		return Promise.reject(error)
	}
)

export default request