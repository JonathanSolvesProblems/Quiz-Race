import React from 'react';

interface Props {
  onClick: () => void;
}

const PlaySolo: React.FC<Props> = ({ onClick }: Props) => {
  return <button onClick={onClick}>Play Solo</button>;
};

export default PlaySolo;
