"use client";
import { useState } from "react";
import Link from "next/link";
import { GuessGame } from "@/components/games/guess";

const SETSDATA = {
  animals: {
    games: [
      {
        type: "guess",
        data: [
          {
            question: "Where is the fox?",
            options: [
              {
                value: "hyena",
                correct: false,
                title: "Hyena",
                image: "/sets/animals/hyena.png",
              },
              {
                value: "horse",
                correct: false,
                title: "Horse",
                image: "/sets/animals/horse.png",
              },
              {
                value: "fox",
                correct: true,
                title: "fox",
                image: "/sets/animals/fox.png",
              },
            ],
          },
        ],
      },
    ],
  },
};

const SetEnd = () => (
  <section>
    <h1>Congratulations!</h1>
    <p>
      Hooray! You have finished this set!{" "}
      <Link href="/" className="link">
        Go back to the set list
      </Link>
    </p>
  </section>
);

const SetPage = ({ params }: { params: { slug: keyof typeof SETSDATA } }) => {
  const { games } = SETSDATA[params.slug];
  const { 0: currentGame, 1: setCurrentGame } = useState(0);

  const getCurrentGame = () => {
    switch (games[currentGame].type) {
      case "guess":
        return (
          <GuessGame
            games={games[currentGame].data}
            onEnd={() => setCurrentGame((curr) => curr + 1)}
          />
        );
    }
  };

  return currentGame < games.length ? getCurrentGame() : <SetEnd />;
};

export default SetPage;
