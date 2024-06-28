import { useState } from "react";

type Props = {
  games: {
    question: string;
    options: {
      value: string;
      correct: boolean;
      title: string;
      image: string;
    }[];
  }[];
  onEnd: () => void;
};

export const Question = ({ question }: { question: string }) => (
  <h1>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 10.0018V14.0018C3 14.5518 3.45 15.0018 4 15.0018H7L10.29 18.2918C10.92 18.9218 12 18.4718 12 17.5818V6.41179C12 5.52179 10.92 5.07179 10.29 5.70179L7 9.00179H4C3.45 9.00179 3 9.45179 3 10.0018ZM16.5 12.0018C16.5 10.2318 15.48 8.71179 14 7.97179V16.0218C15.48 15.2918 16.5 13.7718 16.5 12.0018ZM14 4.45179V4.65179C14 5.03179 14.25 5.36179 14.6 5.50179C17.18 6.53179 19 9.06179 19 12.0018C19 14.9418 17.18 17.4718 14.6 18.5018C14.24 18.6418 14 18.9718 14 19.3518V19.5518C14 20.1818 14.63 20.6218 15.21 20.4018C18.6 19.1118 21 15.8418 21 12.0018C21 8.16179 18.6 4.89179 15.21 3.60179C14.63 3.37179 14 3.82179 14 4.45179Z" />
    </svg>
    <span>{question}</span>
  </h1>
);

type TileProps = {
  value: string;
  correct: boolean;
  title: string;
  image: string;
  onClick: (value: string, correct: boolean) => void;
};

export const Tile = ({ value, correct, title, image, onClick }: TileProps) => (
  <li>
    <button
      className="tile"
      onClick={() => {
        // TODO: handle correct/incorrect click on tile (animation/outline...)
        onClick(value, correct);
      }}
    >
      {title}
      <img alt="" src={image} />
    </button>
  </li>
);

export const GuessGame = ({ games, onEnd }: Props) => {
  const { 0: currentGame, 1: setCurrentGame } = useState(0);
  const handleClick = (_value: string, correct: boolean) => {
    if (correct) {
      return currentGame < games.length - 1
        ? setCurrentGame((curr) => curr + 1)
        : onEnd();
    }
  };

  const GameElement = ({ game }: { game: Props["games"][number] }) => (
    <section className="stack">
      <Question question={game.question} />
      <ul role="list" className="stack-small">
        {game.options.map((opt) => (
          <Tile key={opt.value} {...opt} onClick={handleClick} />
        ))}
      </ul>
    </section>
  );

  return <GameElement game={games[currentGame]} />;
};
