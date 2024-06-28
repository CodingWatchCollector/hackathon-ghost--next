import Link from "next/link";
import { Loader } from "../app/page";

export const AvatarButton = ({ profile }: { profile: Loader["profile"] }) => (
  <Link href="profile" className="border--round avatar--button block tappable">
    <img alt="profile" className="border--round" src={profile.image}></img>
  </Link>
);
