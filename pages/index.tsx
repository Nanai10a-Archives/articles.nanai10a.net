import type { NextPage } from "next";
import type { Forwards } from "./_app";

import { useEffect } from "react";

type Props = Forwards;

const Page: NextPage<Props> = ({ __setTitle }) => {
  useEffect(() => __setTitle(), [__setTitle]);

  return <main></main>;
};

export default Page;
