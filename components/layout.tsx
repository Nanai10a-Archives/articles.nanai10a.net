import type { VFC, PropsWithChildren } from "react";

import Footer from "./footer";
import Header from "./header";

export type Props = PropsWithChildren<Record<string, never>>;

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
