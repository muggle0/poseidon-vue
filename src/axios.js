import axios from "axios";
import router from "./router";
import Element from "element-ui"
import QS from 'qs';

axios.defaults.baseURL = "http://localhost:8080/api"

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

export function post(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, QS.stringify(params),{headers: {'content-type': 'application/json'}})
			.then(res => {
				resolve(res.data);
			})
			.catch(err =>{
				reject(err.data)
			})
	});

}
export default request