import React from 'react';

interface Props {
  onClick: () => void;
}

/**
 * The PlayBot component represents a button for initiating gameplay against a bot.
 * It triggers the provided onClick function when clicked.
 * Currently not being used, but to be introduced when AI functionalities incorporated into application.
 */
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
