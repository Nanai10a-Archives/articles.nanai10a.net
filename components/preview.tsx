import type { VFC, ComponentProps } from "react";

import { useRouter } from "next/router";

import Icon from "components/icon";

type Props = {
  size: "small" | "medium" | "large";
  data: Data;
};

export type Data = {
  path: string;
  icon: Omit<ComponentProps<typeof Icon>, "className" | "size">;
  title: string;
  description: string;
};

const styles = {
  small: {
    button: "",
    icon: "",
    iconSize: "",
    title: "",
    description: "",
  },
  medium: { button: "", icon: "", iconSize: "", title: "", description: "" },
  large: { button: "", icon: "", iconSize: "", title: "", description: "" },
};

const Preview: VFC<Props> = ({ size, data }) => {
  const router = useRouter();

  return (
    <button
      className={`flex flex-col ${styles[size].button}`}
      onClick={() => router.push(data.path)}
    >
      <Icon
        className={styles[size].icon}
        kind={data.icon.kind}
        name={data.icon.name}
        size={styles[size].iconSize}
      />
      <h3 className={styles[size].title}>{data.title}</h3>
      <p className={styles[size].description}>{data.description}</p>
    </button>
  );
};

export default Preview;
