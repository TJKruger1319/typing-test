import React from "react";

function Top({visible, countDown, seconds}) {
    return (
        <div className="section">
            <div className="is-size-1 has-text-centered ">
                <h2 className={visible ? "is-hidden" : "has-text-primary"}>{countDown}</h2>
                <h1 className={visible ? "has-text-primary-light" : "is-hidden"}>Typing Test!</h1>
                <h5 className={visible ? "has-text-primary-light" : "is-hidden"}>Test time: {seconds} seconds</h5>
            </div>
        </div>
  );
}

export default Top;