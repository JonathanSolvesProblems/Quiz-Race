import React from 'react';

interface Props {
  onClick: () => void;
}

/**
 * The PlaySolo component represents a button for initiating solo gameplay.
 * It triggers the provided onClick function when clicked.
 */
const PlaySolo: React.FC<Props> = ({ onClick }: Props) => {
  return (
    <button
      className="btn btn-primary ms-2"
      style={{ marginTop: '10px' }}
      onClick={onClick}
    >
      Play Solo
    </button>
  );
};

export default PlaySolo;
