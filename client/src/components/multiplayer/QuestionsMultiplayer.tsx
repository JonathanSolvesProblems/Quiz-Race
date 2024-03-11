import React, { useState, useEffect } from 'react';
import QuestionRenderer from '../renderers/QuestionRenderer';

// TODO: Import into common file for the interfaces and re-use.
interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: string;
  onCorrectAnswerSelected: () => void;
}

interface Props {
  socket: any;
  username: string;
  room: string;
  questionContent: QuestionData;
}

const QuestionsMultiplayer: React.FC<Props> = (props) => {
  const sendQuestions = async () => {
    if (props !== undefined) {
      const messageInformation = {
        room: props.room,
        username: props.username,
        message: props.questionContent,
      };

      await props.socket.emit('send_message', messageInformation);
    }
  };

  useEffect(() => {
    props.socket.on('receive_message', sendQuestions);

    return () => {
      props.socket.off('receive_message', sendQuestions);
    };
  }, [props.socket]);

  return (
    <div>
      <h1>Multiplayer Questions</h1>
      <QuestionRenderer {...props.questionContent} />
    </div>
  );
};

export default QuestionsMultiplayer;
