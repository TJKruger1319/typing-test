import React, {useState, useEffect, useRef} from 'react'
import axios from "axios";
import { BASE_URL } from '../constants';
import Started from './Started';
import Finished from './Finished';
import Top from './Top';
import Bottom from './Bottom';

function TypingTest() {
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
  const [statisticCount, setStatisticCount] = useState(0);
  const NUMB_OF_WORDS = 250;
  const textInput = useRef(null);
  
      // Gets the words from the API for the test
  useEffect(function getWordsAPI() {
    async function getSentences() {
        try {
        const newWords = await axios.get(`https://random-word-api.vercel.app/api?words=${NUMB_OF_WORDS}`);
        setWords(newWords.data);
        } catch(e) {
          setWords(undefined);
        }
    }
    getSentences();
    if (count >= 1) {
        sendToDatabase();
    }
    setTimeout(handleStatisticCount, 500);

  }, [count]);


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

  // Used to rerun the statistic average whenever there is a new entry
  const handleStatisticCount = () => {
    setStatisticCount(prevCount => prevCount + 1);
  }

  function start() {

    // Resets the test
    if (status === 'finished') {
      setTimeout(reset, 1000);
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

  // Checks key input
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
        if (currCharIndex <= 0) {
          setCurrCharIndex(-1);
        }
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
    const divider = (seconds/60);
    const totalChars = Math.round((total/5)/divider);
    setWPM(totalChars);
  }

  // Used to set the how long the test lasts
  const selectTime = e => {
    setSeconds(e.target.value);
    setCountDown(e.target.value);
  }

  // Sends the test results to the backend
  async function sendToDatabase() {
    if (wpm > 0) {
      await axios.post(`${BASE_URL}/add/${seconds}`, {wpm});
    }
  }

  function reset() {
    setCurrWordIndex(0);
    setCorrect(0);
    setIncorrect(0);
    setTotal(0);
    setCurrCharIndex(-1);
    setCurrChar("");
    setWPM(0);
    setTotal(0);
  }

  if (!words) {
    return (
      <h1 className='has-text-primary-light'>Error recieving words, please try again later.</h1>
    )
  }

  return (
    <div className="App">
      <Top
        visible={visible}
        countDown={countDown}
        seconds={seconds}
      />
      {status === 'started' && (
        <Started 
          words={words} 
          status={status}
          getCharClass={getCharClass}
          textInput={textInput}
          visible={visible}
          handleKeyDown={handleKeyDown}
          currInput={currInput}
          setCurrInput={setCurrInput}
          setWords={setWords}
          count={count}
          sendToDatabase={sendToDatabase}
          handleStatisticCount={handleStatisticCount}
        />
      )}
      {status === 'finished' && (
        <Finished 
          wpm={wpm}
          correct={correct}
          incorrect={incorrect}
        />
      )}
      <Bottom 
        visible={visible}
        start={start}
        count={count}
        selectTime={selectTime}
        seconds={seconds}
        statisticCount={statisticCount}
        handleStatisticCount={handleStatisticCount}
        wpm={wpm}
        status={status}
      />
    </div>
  );
}

export default TypingTest;