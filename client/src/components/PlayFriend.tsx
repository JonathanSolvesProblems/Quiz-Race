import React from 'react';

interface Props {
  onClick: () => void;
}

const PlayFriend: React.FC<Props> = ({ onClick }: Props) => {
  return <button onClick={onClick}>PlayFriend</button>;
};

export default PlayFriend;
