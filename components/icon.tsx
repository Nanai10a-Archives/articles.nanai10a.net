import type { VFC } from "react";

type Props = {
  className?: string;
  kind: "material" | "simple";
  name: string;
  size: number | string;
  color?: string;
};

const Icon: VFC<Props> = ({ className, kind, name, size, color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={color}
  >
    <use href={`/api/icons/${kind}/${name}.svg#icon`} />
  </svg>
);

export default Icon;
