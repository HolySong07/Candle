import axios from 'axios';

const customFetch = axios.create({
	baseURL: '/api/v1',
	withCredentials: true, // ОБЯЗАТЕЛЬНО!
});

let interceptorSet = false;

export const inject401Interceptor = (onUnauthorized: () => void) => {
	if (interceptorSet) return;
	customFetch.interceptors.response.use(
		(res) => res,
		(err) => {
			if (err?.response?.status === 401) {
				onUnauthorized();
			}
			return Promise.reject(err);
		}
	);
	interceptorSet = true;
};

export default customFetch;
