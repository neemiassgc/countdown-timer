import React from "react"
import logo from './logo.svg';
import * as time from "./time"
import * as logic from "./logic"
import * as storage from "./storage"
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
        let then

        if (this.props.isSaved) {
            const data = storage.get();
            this.timerName = data.timerName
            then = data.then
        }
        else {
            this.timerName = this.props.timerName
            then = time.parseDateTimeToMillis({date: this.props.date, time: this.props.time});
        }

        if (this.props.saveSession)
            storage.save(then, this.timerName)

        this.timer = setInterval(() => {
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
            storage.clearAll()
        }
    }

    render() {
        const { days, hours, minutes, seconds } = this.state;

        if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) clearInterval(this.timer)

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
                            days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0
                                ? <h3 className="font-black text-4xl">It's time for {this.timerName.toLowerCase()}</h3>
                                : null
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

    setupTimer(event) {
        let [timerName, date, time] =
            [...event.target.parentElement.querySelectorAll("div > input")].map(event => event.value)

        if (date === "")  {
            alert("field 'Date' is mandatory")
            return
        }

        if (time === "") time = "00:00"

        if (timerName === "") timerName = "My event"

        const component = <Countdown saveSession={this.saveSession} timerName={timerName} date={date} time={time} change={this.props.change} />
        this.props.change(component)
    }

    render() {
        return (
            <div className="container mx-auto">
                <div className="flex flex-col justify-center items-center gap-5 w-2/6 mx-auto mt-10 p-5 py-10 h-42 rounded-md shadow-2xl border border-black">
                    <h1 className="font-black text-lg tracking-widest mb-2">Setup countdown timer</h1>
                    <div className="w-3/4 flex flex-col justify-center items-center">
                        <label className="block w-full text-start mb-1" >Timer name<span className="text-red-500">*</span></label>
                        <input className="block h-9 w-full p-1 rounded-md border border-gray-600 outline-none" type="text" placeholder="My event!"/>
                    </div>
                    <div className="w-3/4 flex flex-col justify-center items-center">
                        <label className="block w-full text-start mb-1" >Date<span className="text-red-500">*</span></label>
                        <input className="block h-9 w-full rounded-md border border-gray-600 outline-none" type="date"/>
                    </div>
                    <div className="w-3/4">
                        <label className="block w-full text-start mb-1" >Time</label>
                        <input className="block h-9 w-full rounded-md border border-gray-600 outline-none" type="time"/>
                    </div>
                    <label className="w-3/4 text-start mb-1" >
                        <input className="mr-2 h-4 w-4" type="checkbox" value="off" onChange={(e) => {this.saveSession = e.target.checked}}/>Save session
                    </label>
                    <button className="bg-transparent font-black text-lg p-2 w-3/12 rounded border border-green-600 text-green-600 hover:text-white hover:bg-green-600" onClick={this.setupTimer.bind(this)}>start</button>
                </div>
            </div>
        );
    }
}


class App extends React.Component {

    constructor(props) {
        super(props);

        let component = (<DateInput change={this.handleComponent.bind(this)} />)

        if (storage.isSaved())
            component = (<Countdown isSaved={true} change={this.handleComponent.bind(this)} />)

        this.state = {
            component: component
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