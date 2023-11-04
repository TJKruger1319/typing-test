import {useState, useEffect, useRef} from 'react'
import axios from "axios";

function TypingTest() {
  const NUMB_OF_WORDS = 250;
  const [seconds, setSeconds] = useState(60);
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(seconds);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0); 
  const [total, setTotal] = useState(0);
  const [wpm, setWPM] = useState(0);
  const textInput = useRef(null);
  
  // Gets the words from the API for the test
  useEffect(function getWordsAPI() {
    async function getSentences() {
        const newWords = await axios.get(`https://random-word-api.vercel.app/api?words=${NUMB_OF_WORDS}`);
        setWords(newWords.data)
    }
    
    getSentences();
  }, [count])

  // When the test is started, input becomes usable
  useEffect(() => {
    if (status === 'started') {
      textInput.current.focus();
    }
  }, [status]);

  // Used to rerun the API call to get a different set of words
  const handleCount = () => { 
    setCount(prevCount => prevCount + 1);
  }

  function start() {

    // Resets the test
    if (status === 'finished') {
      
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setTotal(0);
      setCurrCharIndex(-1);
      setCurrChar("");
    }

    // Begins the test
    if (status !== 'started') {
      setStatus('started');
      setVisible(false);
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus('finished');
            setCurrInput("");
            setVisible(true);
            handleCount();
            return seconds;
          } else {
            return prevCountdown - 1;
          }
        }  )
      } ,  1000 );
    }
    
  }

  // Checks input
  function handleKeyDown({keyCode, key}) {
    // Space bar 
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
    // Backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }

  // Checks to see if input matches with test
  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
      setTotal(total + wordToCompare.length);
    } else {
      setIncorrect(incorrect + 1);
    }
    calculateWPM();
  }

  // Shows if a character is incorrect
  function getCharClass(wordIdx, charIdx, char) {
    if (wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished') {
      if (char === currChar) {
        return 'has-background-success';
      } else {
        return 'has-background-danger';
      }
    } else if (wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
      return 'has-background-danger';
    } else {
      return '';
    }
  }

  // Calculates the WPM based off the total number of correct characters
  function calculateWPM() {
    const divider = (seconds/60)
    const totalChars = Math.round((total/5)/divider);
    setWPM(totalChars);
  }

  // Used to set the how long the test lasts
  const selectTime = e => {
    setSeconds(e.target.value);
    setCountDown(e.target.value);
  }

  return (
    <div className="App">
      <div className="section">
        <div className="is-size-1 has-text-centered ">
          <h2 className={visible ? "is-hidden" : "has-text-primary"}>{countDown}</h2>
          <h1 className={visible ? "has-text-primary-light" : "is-hidden"}>Typing Test!</h1>
          <h5 className={visible ? "has-text-primary-light" : "is-hidden"}>Test time: {seconds} seconds</h5>
        </div>

      </div>
      {status === 'started' && (
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
      )}
      {status === 'finished' && (
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
      )}
         
      <div className="section">
        <button className={visible ? "button is-info is-fullwidth" : "is-invisible"} onClick={start}>
          {count > 0 ? "Restart" : "Start"}
        </button>
      </div>
      <div className={visible ? "section" : "is-invisible"}>
        <h1 className={"has-text-primary-light"}> Select how long the test is: </h1>
        <button className={"button is-info"} value={10} onClick={selectTime}>10</button>
        <button className={"button is-info"} value={30} onClick={selectTime}>30</button>
        <button className={"button is-info"} value={60} onClick={selectTime}>60</button>
        <button className={"button is-info"} value={120} onClick={selectTime}>120</button>
      </div>
    </div>
  );
}

export default TypingTest;