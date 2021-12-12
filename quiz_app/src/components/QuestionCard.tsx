import React, {FC} from 'react'
import {AnswerObject} from '../App'
import {Wrapper,  ButtonWrapper} from './QuestionCard.styles'

type Props = {
  question: string;
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: FC<Props> = ({question, answers, callback, userAnswer, questionNumber, totalQuestions}) => {

  const answersMap = answers.map(answer => (
    <ButtonWrapper 
      key={answer}
      correct={userAnswer?.correctAnswer === answer}
      userClicked={userAnswer?.answer === answer}
      >
      <button value={answer} disabled={userAnswer ? true : false} onClick={callback}>
        <span dangerouslySetInnerHTML={{__html: answer}} />
      </button>
    </ButtonWrapper>
  ))

  return (
    <Wrapper>
      <p className="number">Question: {questionNumber} / {totalQuestions}</p>
      <p dangerouslySetInnerHTML={{__html: question}} />
      <div>
        {answersMap}
      </div>
    </Wrapper>
  )
}

export default QuestionCard
