const request = async (url, opts) => {
	const response = await fetch(url, opts)
	const json = await response.json()

	if (response.ok) return json

	const error = {
		...json,
		status: response.status,
	}
	throw error
}

export default request
