import React from 'react';

interface Props {
  onClick: () => void;
}

const PlayBot: React.FC<Props> = ({ onClick }: Props) => {
  return (
    <button
      className="btn btn-primary ms-2"
      style={{ marginTop: '10px' }}
      onClick={onClick}
    >
      Play Bot
    </button>
  );
};

export default PlayBot;
