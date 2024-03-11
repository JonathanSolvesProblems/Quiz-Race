import React from 'react';

interface Props {
  onClick: () => void;
}

const PlayBot: React.FC<Props> = ({ onClick }: Props) => {
  return <button onClick={onClick}>Play Bot</button>;
};

export default PlayBot;
