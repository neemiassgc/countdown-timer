export function isSaved() {
	return window.localStorage.getItem("then") != null
}

export function getThen() {
	return window.localStorage.getItem("then")
}

export function saveThen(ms) {
	if (!isSaved()) window.localStorage.setItem("then", ms)
}

export function clearThen() {
	window.localStorage.clear()
}