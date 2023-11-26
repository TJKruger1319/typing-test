import React, {useState, useEffect} from "react";
import Statistics from "./Stastics";
import { BASE_URL } from "../constants";
import axios from "axios";

function Bottom({visible, start, count, selectTime, seconds, statisticCount, wpm, status, handleStatisticCount, user_id}) {
    const [average, setAverage] = useState();
    const [biggest, setBiggest] = useState(0);
    const [title, setTitle] = useState("");
    const [newTitle, setNewTitle] = useState();
    const [bottomStatus, setBottomStatus] = useState("waiting");

    useEffect(function getStatisticsAPI() {
        // Gets the average of all wpms from the database based on the user's chosen test
        async function getStatistics() {
            try {
            const newAverage = await axios.get(`${BASE_URL}/statistics/${seconds}`);
            setAverage(newAverage.data.average_score);
            setBiggest(newAverage.data.highest_score.wpm);
            setTitle(newAverage.data.highest_score.username);
            } catch(e) {
                console.log(e);
                setAverage("failure");
            }
        }
        getStatistics();
    }, [seconds, statisticCount]);

    // Sends the new title to the backend
    async function updateTitle() {
        await axios.patch(`${BASE_URL}/update_username/${user_id}`, {"new_username": newTitle});
    }

    // Handles updates to the input in the form for the highest score user
    const handleChange = (evt) => {
        setNewTitle(evt.target.value);
    }

    // Handles the form submit
    function handleSubmit(e) {
        e.preventDefault();
        updateTitle();
        setBottomStatus("waiting");
        setTimeout(handleStatisticCount, 1000);
    }

    // Checks to see if the wpm score is the new high score
    useEffect(function checkBiggest() {
        if (wpm > biggest) {
            setBottomStatus("new_high_score");
        }
    }, [status])

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
                {bottomStatus === "new_high_score" && (
                    <div className="column has-text-centered">
                        <h3 className="has-text-primary-light">Congratulations! You beat the high score! Please enter a user name:</h3>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text"
                                onChange={handleChange}
                            />
                            <button>Submit</button>
                        </form>
                    </div>
                )}
                <div className="column has-text-centered">
                    <Statistics 
                        time={seconds} 
                        average={average}
                        biggest={biggest}
                        title={title}
                        />
                </div>
            </div>
        </div>
      </div>
    )
}

export default Bottom;