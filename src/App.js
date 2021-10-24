import React from "react"
import logo from './logo.svg';
import * as time from "./time"
import * as logic from "./logic"
import './App.css';

function SVGCircle(props) {
    return (
        <div>
            <svg className="absolute top-0 left-0 w-56 h-56 m-4">
                <path
                    fill="none"
                    stroke={props.stroke}
                    strokeWidth="6"
                    d={logic.describeArc(102, 102, 100, 0, props.radius)}/>
            </svg>
        </div>

    )
}

class Countdown extends React.Component {
    
    constructor(props) {
        super(props)

        this.state = {
            days: undefined,
            hours: undefined,
            minutes: undefined,
            seconds: undefined
        }
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            const then = time.parseDateTimeToMillis(this.props.date, this.props.time)
            const now = Date.now()
            
            const countdown = time.formatTime(then - now)

            this.setState({
                days: countdown.days,
                hours: countdown.hours,
                minutes: countdown.minutes,
                seconds: countdown.seconds
            })
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    changeScreen(event) {
        const isCancel = window.confirm("Are you sure?")

        if (isCancel && isCancel !== "") {
            const component = (<DateInput change={this.props.change}/>)
            this.props.change(component);
        }
    }

    render() {
        const { days, hours, minutes, seconds } = this.state;

        if (!days && !hours && !minutes && !seconds) clearInterval(this.timer)

        const daysRadius = logic.scale(days, 365, 0, 360, 0)
        const hoursRadius = logic.scale(hours, 24, 0, 360, 0)
        const minutesRadius = logic.scale(minutes, 60, 0, 360, 0)
        const secondsRadius = logic.scale(seconds, 60, 0, 360, 0)

        return (
            <div className="container mx-auto">
                <div>
                    <h1 className="uppercase text-center tracking-widest mt-3 font-2xl">Countdown</h1>
                    <div className="flex flex-wrap justify-center items-center gap-0">
                        {
                            days > 0 ? (
                                <div className="countdownItem">
                                    <SVGCircle stroke="#333" radius={daysRadius}/>
                                    {days}
                                    <span className="countdownItemSpan">{days > 1 ? "days" : "day"}</span>
                                </div>
                            ) : null
                        }
                        {
                            hours > 0 ? (
                                <div className="countdownItem">
                                    <SVGCircle stroke="#333" radius={hoursRadius}/>
                                    {hours}
                                    <span className="countdownItemSpan">{hours > 1 ? "hours" : "hour"}</span>
                                </div>
                            ) : null
                        }
                        {
                            minutes > 0 ? (
                                <div className="countdownItem">
                                    <SVGCircle stroke="#333" radius={minutesRadius}/>
                                    {minutes}
                                    <span className="countdownItemSpan">{minutes > 1 ? "minutes" : "minute"}</span>
                                </div>
                            ) : null
                        }
                        {
                            seconds > 0 ? (
                                <div className="countdownItem">
                                    <SVGCircle stroke="#333" radius={secondsRadius}/>
                                    {seconds}
                                    <span className="countdownItemSpan">{seconds > 1 ? "seconds" : "second"}</span>
                                </div>
                            ) : null
                        }
                        {
                            !days && !hours && !minutes && !seconds ? <h3>It's done</h3> : null
                        }
                    </div>
                    <div className="flex flex-wrap justify-center items-center">
                        <button className="p-2 text-lg font-black bg-transparent hover:bg-red-600 border border-red-600 rounded-md text-red-600 hover:text-white" onClick={this.changeScreen.bind(this)}>STOP</button>
                    </div>
                </div>
            </div>
        );
    }
}


class DateInput extends React.Component {

    constructor(props) {
        super(props)
    }

    changeScreen(event) {
        const [date, time] = event.target.parentElement.children
        const component = <Countdown time={time.value} date={date.value} change={this.props.change} />
        this.props.change(component)
    }

    render() {
        return (
            <div className="container mx-auto">
                <div className="flex flex-col justify-center items-center gap-7 w-1/4 mx-auto mt-10 p-5 py-10 h-42 rounded-md border border-gray-600 shadow-2xl">
                    <input className="h-8 w-3/4 ring rounded-md" type="date" value="2021-10-24" />
                    <input className="h-8 w-3/4 ring rounded-md" type="time" value="22:40" />
                    <button className="bg-transparent font-black text-lg p-2 w-3/12 rounded border border-green-600 text-green-600 hover:text-white hover:bg-green-600" onClick={this.changeScreen.bind(this)}>start</button>
                </div>
            </div>
        );
    }
}


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            component: (<DateInput change={this.handleComponent.bind(this)} />)
        }
    }

    handleComponent(compoent, event) {
        this.setState(
            {
                component: compoent
            }
        )
    }

    render() {
        return this.state.component
    }
}


export default App;