import React from "react"

function Started({words, status, getCharClass, textInput, visible, handleKeyDown, currInput, setCurrInput, setWords, count, sendToDatabase, handleStatisticCount}) {    
    return (
        <div className="section" >
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words.map((word, i) => (
                  <span key={i}>
                    <span className="is-size-4">
                      {word.split("").map((char, idx) => (
                        <span className={getCharClass(i, idx, char)}  key={idx}>{char}</span>
                      )) }
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
              <div className="field has-addons has-text-centered">
                <div className="control is-expanded section">
                  <input ref={textInput} disabled={status !== "started"} type="text" className={visible ? "is-hidden" : " is-size-2"} onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value)}  />
                </div> 
              </div>
            </div>
          </div>
        </div>
    )
}

export default Started;