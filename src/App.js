import React from "react"
import * as timeUtils from "./time"
import * as logic from "./logic"
import * as storage from "./storage"
import './App.css';
import { Warning, Prompt } from './modal.js'
import logo from "./logo.svg"

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
            seconds: undefined,
            promptModal: {
                active: false,
                msg: null
            }
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
            then = timeUtils.parseToMillis({date: this.props.date, time: this.props.time});
        }


        if (this.props.saveSession)
            storage.save(then, this.timerName)

        this.timer = setInterval(() => {
            const now = Date.now()
            
            const countdown = timeUtils.formatTime(then - now)

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

    showPrompt(msg) {
        this.setState(prev => {
            return {
                promptModal: {
                    active: !prev.promptModal.active,
                    msg: msg
                }
            }
        })
    }

    removeSession() {
        const component = (<DateInput change={this.props.change}/>)
        storage.clearAll()
        this.props.change(component);
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
                    <h1 className="uppercase text-center tracking-widest mt-4 mb-3 font-3xl">Countdown</h1>
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
                                ? <h3 className="font-black text-4xl mt-4">It's time for {this.timerName.toLowerCase()}</h3>
                                : null
                        }
                    </div>
                    <button className="p-2 text-lg font-black bg-transparent hover:bg-red-600 border border-red-600 rounded-md text-red-600 hover:text-white block mx-auto my-4"
                        onClick={
                            () => {
                                const msg = "Are you sure? You're going to remove your active session"
                                this.showPrompt(msg)
                            }
                        }>STOP</button>
                </div>
                {
                    this.state.promptModal.active ?
                    <Prompt
                        toggle={this.showPrompt.bind(this)}
                        comfirm={this.removeSession.bind(this)}
                        msg={this.state.promptModal.msg} /> :
                    null
                }
            </div>
        );
    }
}


class DateInput extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            warningModal: {
                active: false,
                msg: null
            }
        }
    }

    showWarning(msg) {
        this.setState( prev => {
            return {
                warningModal: {
                    active: !prev.warningModal.active,
                    msg: msg
                }
            }
        })
    }

    setupTimer(event) {
        const YEAR = 31536e6;

        let [timerName, date, time] =
            [...event.target.parentElement.querySelectorAll("div > input")].map(event => event.value)

        if (time === "") time = "00:00"

        if (timerName === "") timerName = "My event"

        if (date === "")  {
            this.showWarning("Field 'Date' is mandatory")
            return;
        }
        else if (timeUtils.parseToMillis({date: date, time: time}) - Date.now() >= YEAR) {
            this.showWarning("Date cannot be more than one year")
            return;
        }

        const component = <Countdown saveSession={this.saveSession} timerName={timerName} date={date} time={time} change={this.props.change} />
        this.props.change(component)
    }

    render() {
        return (
            <div className="container mx-auto">
                <div className="flex flex-col justify-center items-center gap-5 w-11/12 sm:w-2/3 lg:w-3/6 xl:w-1/3 mx-auto mt-10 py-8 h-42 border-0 sm:border rounded-md shadow-none sm:shadow-md">
                    <div className="w-full h-full flex flex-col items-center">
                        <img src={logo} className="w-2/6 h-2/6" alt="logo" />
                        <h1 className="font-black text-gray-500 text-2xl tracking-widest mb-2">Countdown timer</h1>
                        <p className="font-black text-gray-500 tracking-widest">Setup</p>
                    </div>
                    <div className="w-3/4">
                        <label className="block w-full text-start mb-1 text-gray-500" >Timer name*</label>
                        <input className="block h-9 w-full p-5 outline rounded-md border" type="text" placeholder="My event"/>
                    </div>
                    <div className="w-3/4">
                        <label className="block w-full text-start mb-1 text-gray-500" >Date*</label>
                        <input className="block h-9 w-full p-5 outline rounded-md border" type="date" placeholder="date"/>
                    </div>
                    <div className="w-3/4">
                        <label className="block w-full text-start mb-1 text-gray-500" >Time</label>
                        <input className="block h-9 w-full p-5 outline rounded-md border" type="time"/>
                    </div>
                    <label className="w-3/4 text-start mb-1 text-gray-500" >
                        <input className="mr-2 h-4 w-4" type="checkbox" value="off" onChange={(e) => {this.saveSession = e.target.checked}}/>Save session
                    </label>
                    <button className="bg-transparent mt-3 font-black text-lg p-2 w-3/12 rounded border border-green-600 text-green-600 hover:text-white hover:bg-green-600" onClick={this.setupTimer.bind(this)}>start</button>
                </div>
                { this.state.warningModal.active ? <Warning toggle={this.showWarning.bind(this)} msg={this.state.warningModal.msg} /> : null }
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

    handleComponent(component, event) {
        this.setState(
            {
                component: component
            }
        )
    }

    render() {
        return this.state.component
    }
}


export default App;