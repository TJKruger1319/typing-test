import React from "react"

function Started({words, status, getCharClass, textInput, visible, handleKeyDown, currInput, setCurrInput, setWords, count, sendToDatabase, handleStatisticCount}) {    
    return (
        <div className="section" >
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words.map((word, i) => (
                  <span key={i}>
                    <span>
                      {word.split("").map((char, idx) => (
                        <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                      )) }
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
                <div className="control is-expanded section">
                    <input ref={textInput} disabled={status !== "started"} type="text" className={visible ? "is-hidden" : "input"} onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value)}  />
                </div> 
            </div>
          </div>
        </div>
    )
}

export default Started;