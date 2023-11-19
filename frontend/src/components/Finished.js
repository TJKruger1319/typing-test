import React from "react";

function Finished({wpm, correct, incorrect}) {
    return (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5 has-text-primary-light">Words per minute:</p>
              <p className="has-text-primary is-size-1">
                {wpm}
              </p>
            </div>
            <div className="column has-text-centered">
              <p className="is-size-5 has-text-primary-light">Accuracy:</p>
              {correct !== 0 ? (
                <p className="has-text-info is-size-1">
                  {Math.round((correct / (correct + incorrect)) * 100)}%
                </p>
              ) : (
                <p className="has-text-info is-size-1">0%</p>
              )}
            </div>
          </div>
        </div>
    )
}

export default Finished;