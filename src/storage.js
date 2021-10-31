export function isSaved() {
	return window.localStorage.getItem("then") != null
		&& window.localStorage.getItem("timer-name") != null
}

export function get() {
	return {
		then: window.localStorage.getItem("then"),
		timerName: window.localStorage.getItem("timer-name")
	}
}

export function save(then, timerName) {
	window.localStorage.setItem("then", then)
	window.localStorage.setItem("timer-name", timerName)
}

export function clearAll() {
	window.localStorage.clear()
}