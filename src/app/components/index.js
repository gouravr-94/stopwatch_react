import React, { Component } from 'react';

class StopWatch extends Component {
  constructor(props){
    super(props);
    this.timer = null;
    this.initialTime = null;
    /* Component Initial State */
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliSeconds: 0,
      isRunning: false,
      laps: [],
      currentTime: null
    }
  }

  /* Calculate the Difference between Start time an current Time */
  calculateDifference = diff => {
    let milliSeconds = diff;
    let hours = Math.floor(milliSeconds / 1000 / 60 / 60);
    milliSeconds -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(milliSeconds / 1000 / 60);
    milliSeconds -= minutes * 1000 * 60;
    let seconds = Math.floor(milliSeconds / 1000);
    milliSeconds -= seconds * 1000;
    return { hours, minutes, seconds, milliSeconds};
  }

  /* Change state of the Timer every Millisecond */
  startTimer = () => {
    this.timer = setInterval(() => {
      this.setState({ 
        ...this.calculateDifference(new Date() - this.initialTime), 
        isRunning: true, 
        currentTime: new Date() 
      })
    }, 10);
  }   

  /* Start the Timer after checking if currently is in Pause state */
  onClickStart = () => {
    this.initialTime = this.initialTime 
      ? new Date(Date.now() + (this.initialTime - this.state.currentTime)) 
      : new Date();
    this.startTimer();
  }

  /* Reset time Time to Initial and start Time again */
  onClickRestart = () => this.initialTime = new Date();

  /* Stop to Time */
  onClickStop = () => {
    clearInterval(this.timer);
    this.setState({ isRunning: false });
  }

  /* Store Current Time in laps Array */
  onClickLap = () => {
    let { isRunning, laps, currentTime, ...runningTime } = this.state;
    laps.push( runningTime );
    this.setState({ laps });
  }

  /* Reset Laps to initial */
  onClickClearLaps = () => this.setState({laps: []});

  /* Reset Time to Zero and Start Watch again if it's already running */
  onClickReset = () => {
    if (this.state.isRunning) {
      this.initialTime = new Date();
    } else {
      this.initialTime = null;
      this.onClickStop();
      this.setState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliSeconds: 0
      });
    }
  };

  /* Render Action Buttons */
  renderNavbar = () => {
    const { isRunning, laps } = this.state;
    return (
      <nav className="controls">
        <a 
          className={!isRunning ? "button" : "disabled-button"}
          disabled={isRunning}
          onClick={ !isRunning ? () => this.onClickStart() : null}>
          Start
        </a>
        <a 
          className={isRunning ? "button" : "disabled-button"}
          disabled={!isRunning}
          onClick={isRunning ? () => this.onClickStop() : null}>
          Stop
        </a>   
        <a 
          className={isRunning ? "button" : "disabled-button"}
          disabled={!isRunning}
          onClick={isRunning ? () => this.onClickRestart(): null}>
          Restart
        </a>
        <a 
          className={isRunning ? "button" : "disabled-button"}
          disabled={!isRunning}
          onClick={isRunning ?  () => this.onClickLap() : null}>
          Lap
        </a>
        <a 
          className={!laps.length ? "button" : "disabled-button"}
          disabled={!laps.length}
          onClick={laps.length ? () => this.onClickClearLaps() : null}>
          Clear Laps
        </a>
        <a 
          className={this.initialTime ? "button" : "disabled-button"}
          disabled={!this.initialTime}
          onClick={(isRunning || this.initialTime) ? () => this.onClickReset() : null}>
          Reset
        </a>
      </nav>
    );
  };
 
  /* Render Timer */
  renderElapsedTime = () => {
    let { hours, minutes, seconds, milliSeconds } = this.state;
    return(
      <div className="stopwatch-numbers">
        <div>
          <span>{hours}</span>
        </div>
        <span>:</span>
        <div>
          <span>{minutes}</span>
        </div>
        <span>:</span>
        <div>
          <span>{seconds}</span>
        </div>
        <span>:</span>
        <div>
          <span>{milliSeconds}</span>
        </div>
      </div>  
    )
  }

  render() {
    const { laps } = this.state;
    return (
      <div className="flex-container">
        {this.renderNavbar()}
        {this.renderElapsedTime()}
        {
          laps.length && (
            <div className="results-wrapper">
              <h1 className="title">Lap Results</h1>
              <ul className="results">
                {
                  laps.map((lap, index) => (
                    <li key={index}>
                      {`${lap.hours}:${lap.minutes}:${lap.seconds}:${lap.milliSeconds}`}
                    </li>
                  ))
                }
              </ul>
            </div> 
           )
        }
      </div>
    );
  }
}

export default StopWatch;