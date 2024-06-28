import Link from "next/link";

type LinkProps = {
  type: "link";
  href: string;
};

type ButtonProps = {
  type: "button";
  action: () => void;
};

type Common = {
  children: React.ReactNode;
  [x: string]: unknown;
};

type Props = (LinkProps | ButtonProps) & Common;

const className = "button-style tappable";

export const Button = ({ type, action, href, children, ...rest }: Props) =>
  type === "link" ? (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  ) : (
    <button onClick={action} className={className} {...rest}>
      {children}
    </button>
  );
