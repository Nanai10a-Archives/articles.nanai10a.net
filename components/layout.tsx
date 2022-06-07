import type { VFC, PropsWithChildren } from "react";

import Footer from "components/footer";
import Header from "components/header";

type Props = PropsWithChildren<Record<string, unknown>>;

const Layout: VFC<Props> = ({ children }) => {
  return (
    <div className="w-screen h-screen bg-lshades text-dshades dark:bg-dshades dark:text-lshades flex justify-center">
      <div className="w-10/12 md:w-5/6 lg:w-3/4 xl:w-2/3 mt-8">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
