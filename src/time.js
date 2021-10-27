export function parseDateTimeToMillis( { date, time } ) {
	const [year, month, day] = date.split("-").map(i => +i);
	const [hours, minutes] = time.split(":").map(i => +i);

	return new Date(year, month - 1, day, hours, minutes).getTime()
}

export function formatTime(millis) {
    const days = Math.floor(millis / 864e5)
    const hours = Math.floor(millis / 36e5 % 24)
    const minutes = Math.floor(millis / 6e4 % 60)
    const seconds = Math.floor(millis / 1e3 % 60)

    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
}
