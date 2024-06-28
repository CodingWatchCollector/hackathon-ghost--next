import { SettingsButton } from "../components/settings-button";
import { AvatarButton } from "../components/avatar-button";
import { Timer } from "../components/timer";
import Link from "next/link";

type SetType = {
  name: string;
  slug: string;
  active: boolean;
  background: string;
};

export type Loader = {
  sets: SetType[];
  profile: {
    image: string;
  };
};

export const DATA: Loader = {
  sets: [
    {
      name: "Animals",
      slug: "animals",
      active: true,
      background: "/sets/animals.jpg",
    },
    {
      name: "Colors",
      slug: "colors",
      active: false,
      background: "/sets/colors.jpg",
    },
    {
      name: "Fruits",
      slug: "fruits",
      active: false,
      background: "/sets/fruits.jpg",
    },
  ],
  profile: {
    image: "/profile.jpg",
  },
};

const Index = () => {
  const { sets, profile } = DATA as Loader;
  return (
    <section className="index-page stack">
      <header>
        <SettingsButton />
        <Timer />
        <AvatarButton profile={profile} />
      </header>
      <section className="stack-small">
        <Link href="analytics" className="button-style analytics">
          Analytics
        </Link>
        <ul role="list" className="stack-small sets">
          {sets.map(({ slug, name, active, background }) => (
            <li key={slug} className={active ? "" : "disabled"}>
              <Link href={`sets/${slug}`}>
                <div className="image-wrapper">
                  <img src={background} alt="" />
                </div>
                <div className="text--centered">{name}</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};
export default Index;
