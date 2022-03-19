import type { VFC, PropsWithChildren } from "react";

import Footer from "components/footer";
import Header from "components/header";

type Props = PropsWithChildren<Record<string, unknown>>;

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
