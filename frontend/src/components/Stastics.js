import React, {useState, useEffect} from "react";
import axios from "axios";
import { BASE_URL } from "../constants";

function Statistics({ time, count }) {
    const [average, setAverage] = useState();
    const [biggest, setBiggest] = useState(0);

    useEffect(function getAverageAPI() {
        // Gets the average of all wpms from the database based on the user's chosen test
        async function getAverage() {
            try {
            const newAverage = await axios.get(`${BASE_URL}/average/${time}`);
            setAverage(newAverage.data.average);
            setBiggest(newAverage.data.highest);
            } catch(e) {
                setAverage("failure");
            }
        }
        getAverage();
    }, [time, count]); 

    if (!average) {
        return(
            <p>Loading average...</p>
        );
    } else if (average === "failure") {
        return (
            <p>Failed to get statistics, please try again later.</p>
        );
    } else {
        return (
            <div>
                <h1 className={"has-text-primary-light is-size-5"}> Average wpm for {time} seconds:</h1>
                <p className="has-text-info is-size-3">{average}</p>
                <h1 className={"has-text-primary-light is-size-5"}> High score wpm for {time} seconds:</h1>
                <p className="has-text-info is-size-3">{biggest}</p>
            </div>
        );
    }
}

export default Statistics;