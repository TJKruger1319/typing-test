import React, {useState, useEffect} from "react";
import axios from "axios";
import { BASE_URL } from "../constants";

function Statistics({ time }) {
    const [average, setAverage] = useState();

    useEffect(function getAverageAPI() {
        // Gets the average of all wpms from the database based on the user's chosen test
        async function getAverage() {
            const newAverage = await axios.get(`${BASE_URL}/average/${time}`);
            setAverage(newAverage.data.average);
        }
        getAverage();
    }, [time]); 

    if (!average) {
        return(
            <p>Loading average...</p>
        );
    } else {
        return (
            <div>
                <h1 className={"has-text-primary-light is-size-5"}> Average wpm for {time} seconds:</h1>
                <p className="has-text-info is-size-3">{average}</p>
            </div>
        );
    }
}

export default Statistics;