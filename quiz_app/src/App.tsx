import React, {useState, useEffect} from 'react';
import {fetchQuizQuestions} from './API';
import { QuestionState, Difficulty } from './API';
import { shuffleArray } from "./utils"
import QuestionCard from './components/QuestionCard';
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10

function App() {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  const startQuiz = async () => {
    setGameOver(false)
    setScore(0)
    setUserAnswers([])
    setNumber(0)
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value
      const correct = questions[number].correct_answer === answer
      correct && setScore(prev => prev + 1)
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers(prev => [...prev, answerObject  ])  
    }
  }

  const nextQuestion = () => {
    const followingQuestion = number + 1
    followingQuestion === TOTAL_QUESTIONS ? setGameOver(true) : setNumber(followingQuestion)
  }

  useEffect(async () => {
    setLoading(true)
    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS)
    setQuestions(newQuestions)
    setLoading(false)
  }, [gameOver])

  return (
    <>
    <GlobalStyle />
      <Wrapper>
        <h1>React Quiz</h1>
        {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && (
          <button className="start" onClick={startQuiz}>Start</button>
        )}

        {!gameOver && (<p className="score">Score: {score}</p>)}
        
        {loading && (<p>Loading Questions...</p>)}

        {(!loading && !gameOver) && (
          <QuestionCard 
            questionNumber={number + 1} 
            totalQuestions={TOTAL_QUESTIONS} 
            question={questions[number].question}
            answers={shuffleArray([...questions[number].incorrect_answers, questions[number].correct_answer])}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}

        {(!gameOver && 
          !loading && 
          userAnswers.length === number + 1 && 
          number !== TOTAL_QUESTIONS - 1) && (
            <button className="next" onClick={nextQuestion}>Next Question</button>
        )}
      </Wrapper>
    </>
  )
}

export default App;
