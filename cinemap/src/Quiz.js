/*
  This file implements the Movie Quiz functionality.
  Originally intended to use an API, but changed it
  to a hard-coded JSON array instead.
*/

import React, {Component} from 'react';
import {quizQuestions} from './quizQuestions';

import oscar from './images/oscar.png';
import goldenglobe from './images/goldenglobe.jpg';
import razzie from './images/razzie.jpg';
import participation from './images/participation.png';


export class Quiz extends Component {

  //fetch and hold questions within the component
  constructor(props) {

      super(props);

      this.state = {

        quizClicked: false,

        //this quiz uses a hard-coded json array,
        //because the API we were going to use
        //had a few annoying issues
        quizArray: [],

        currentQAnswered: false,


        //track current score
        points: 0,
        questionNumber: 0,

      };

      this.handleStartQuizClick = this.handleStartQuizClick.bind(this);
      this.handleNextQuestionClick = this.handleNextQuestionClick.bind(this);
      this.handleAnswerClick = this.handleAnswerClick.bind(this);

  }


  //from stackoverflow.com - shuffle array method
  //to randomise questions and answers order
  shuffleQuestions(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      while(0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex );

        //reduce num of elements to shuffle each time
        currentIndex -= 1;

        //swap the values
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;

      }
      return array;
  }


    handleStartQuizClick() {

      //get a random order of questions from our
      //JSON array
      let randomQs = this.shuffleQuestions(quizQuestions);
      this.setState({quizArray: randomQs});
      this.setState({quizClicked: true});

      //reset the points in case this is a new game
      this.setState({points: 0, currentQAnswered: false, questionNumber: 0});
    }

    handleNextQuestionClick() {
      console.log("Next question button clicked")
      let nextQuestion = this.state.questionNumber + 1;
      if(nextQuestion < 20) {
        this.setState({questionNumber: nextQuestion, currentQAnswered: false});
        console.log("Loaded next quiz question (number " + (this.state.questionNumber+1) + ")");
      }
    }


    handleAnswerClick(answerClicked, answer) {
     console.log("Answer " + answerClicked + " clicked");

      if(answerClicked === answer) {
        console.log("Correct answer.");
        this.setState({points: this.state.points+1});
      } else {
        console.log("Incorrect answer.")
      }
      //move to the next question when an answer is clicked
      this.setState({currentQAnswered: true}, this.handleNextQuestionClick)
    }

    //get and display randomised answers while tracking
    //the correct answer so the answer points can still be
    //checked
    getShuffledAnswers(answerArray, correct_answer) {

      let shuffledAns = this.shuffleQuestions(answerArray);

      return (
        <div>
          <div>
              <button
              className="btn btn-warning"

              onClick={() => this.handleAnswerClick(shuffledAns[0], correct_answer)}
              >{shuffledAns[0]}</button>
          </div>

            <div>
              <br />
              <button
              className="btn btn-warning"

              onClick={() => this.handleAnswerClick(shuffledAns[1], correct_answer)}
              >{shuffledAns[1]}</button>
            </div>

            <div>
              <br />
              <button
              className="btn btn-warning"

              onClick={() => this.handleAnswerClick(shuffledAns[2], correct_answer)}
              >{shuffledAns[2]}</button>
            </div>

            <div>
              <br />
              <button
              className="btn btn-warning"

              onClick={() => this.handleAnswerClick(shuffledAns[3], correct_answer)}
              >{shuffledAns[3]}</button>
            </div>

          </div>
      );
    }

    getQuizComment(points) {

      if(points === 10) {
        return (
            <div id="QuizComment">
                <p>You're a </p>
                <h1>Movie Master!</h1>
                <p>Let it never be said that you don't have vast, extensive knowledge in something really unimportant.</p>
                <img src={oscar} alt="Oscar" />
            </div>
        );
      } else if (points > 6) {
        return (
          <div id="QuizComment">
              <p>You're a </p>
              <h1>Movie Enthusiast!</h1>
              <p>You know a little bit. Enough to be dangerous. But not so much that you'll actually <em>win</em> the table quiz. Good balance.</p>
              <img src={goldenglobe} alt="Golden Globe" />
          </div>
        );
      } else if(points > 3) {
        return (
          <div id="QuizComment">
              <p>You're certainly someone who</p>
              <h1>occasionally watches a movie!</h1>
              <p>Congratulations on having other interests, you weirdo!</p>
              <img src={razzie} alt="Razzie" />
          </div>
        );
      } else {
        return (
          <div id="QuizComment">
            <p>You might not know </p>
            <h1>what a "movie" is.</h1>
            <p>It's like pictures, but with words and explosions (sometimes).</p>
            <small>(Ask your friends about it sometime.)</small>
            <br /><br />
            <small>(Thank us later.)</small>
            <br />
            <img src={participation} alt="Participation Trophy" />
          </div>
        );
      }

    }


  render() {

    let quizArray = this.state.quizArray;
    let quizClicked = this.state.quizClicked;
    let currentQ = this.state.questionNumber;

    return(
      <div id="Questions">

          {quizClicked === false &&
            <div id="QuizStartButton">
              <br />
              <h1>Quiz <span role="img" aria-label="popcorn">&#127871;</span></h1>
              <br />
              <button
                onClick={this.handleStartQuizClick}
                className="btn btn-primary"
              >
              Start Quiz
              </button>
            </div>
          }

          {
            quizClicked === true && currentQ < 10 &&

            <div id="Show quiz">
                <br />
                <h5><strong>{quizArray[currentQ].question}</strong></h5>
                <br />

                {/*randomise order of answers
                  this also sends in the correct answer value of
                  the current question, to compare it
                  */}
                {this.getShuffledAnswers(quizArray[currentQ].answers, quizArray[currentQ].correct_answer)}

            <div>
            <br />

            {/*printing the current question number*/}
            <small>Q{(this.state.questionNumber)+1}/10</small>



            </div>




              <br />

              { /*
              <button onClick={this.handleNextQuestionClick} className="btn btn-secondary">Next &#8250;</button>
              */ }

            </div>
          }

          {/*what to display when the quiz is finished*/}
          {quizClicked === true && currentQ >= 10 &&
            <div id="QuizResults">
              You got {this.state.points} points.

              {/*provide appropriate comments, images etc depending on quiz score*/}
              {this.getQuizComment(this.state.points)}
              <br />
              <button onClick={this.handleStartQuizClick} className="btn btn-secondary">Play Again</button>
            </div>
          }


      </div>
    );
  }

}
