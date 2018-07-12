const request = async (url, opts) => {
	const response = await fetch(url, opts)
	const json = await response.json()
	return response.ok ? json : Promise.reject(json)
}

export default request
