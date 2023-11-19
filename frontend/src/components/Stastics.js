import React from "react";

function Statistics({ time, average, biggest, title }) {

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
                <h1 className="has-text-primary-light is-size-2">Statistics of all users</h1>
                <h1 className={"has-text-primary-light is-size-5"}> Average wpm for {time} seconds:</h1>
                <p className="has-text-info is-size-3">{average}</p>
                <h1 className={"has-text-primary-light is-size-5"}> High score wpm for {time} seconds:</h1>
                <p className="has-text-info is-size-3">{biggest}</p>
                <h1 className={"has-text-primary-light is-size-5"}> User with the highest score:</h1>
                <p className="has-text-info is-size-4">{title}</p>
            </div>
        );
    }
}

export default Statistics;