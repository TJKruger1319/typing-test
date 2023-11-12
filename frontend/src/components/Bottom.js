import React from "react";
import Statistics from "./Stastics";

function Bottom({visible, start, count, selectTime, seconds, statisticCount}) {
    return (
        <div>
            <div className="column is-half is-offset-one-quarter">
            <button className={visible ? "button is-info is-large is-fullwidth" : "is-invisible"} onClick={start}>
            {count > 0 ? "Restart" : "Start"}
            </button>
        </div>
        <div className={visible ? "section" : "is-invisible"}>
            <div className='columns'>
                <div className="column has-text-centered">
                    <h1 className={"has-text-primary-light"}> Select how long the test is: </h1>
                    {[10, 30, 60, 120].map((val) => (
                    <button className={"button is-info"} value={val} onClick={selectTime} key={val}>{val}</button>
                    ))}
                </div>
                <div className="column has-text-centered">
                    <Statistics time={seconds} count={statisticCount}/>
                </div>
            </div>
        </div>
      </div>
    )
}

export default Bottom;