import React from 'react';

interface Props {
  onClick: () => void;
}

const PlayFriend: React.FC<Props> = ({ onClick }: Props) => {
  return (
    <button
      className="btn btn-primary ms-2"
      style={{ marginTop: '10px' }}
      onClick={onClick}
    >
      Play Friend
    </button>
  );
};

export default PlayFriend;
