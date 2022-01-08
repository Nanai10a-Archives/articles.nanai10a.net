import type { VFC, PropsWithChildren } from "react";

import Footer from "./footer";
import Header from "./header";

export type Props = PropsWithChildren<Record<string, unknown>>;

const Layout: VFC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
