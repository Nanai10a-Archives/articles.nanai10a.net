import type { Diff } from "utility-types";
import type { NextPage, GetStaticProps } from "next";
import type { ComponentProps } from "react";

import type { Forwards } from "pages/_app";
import type { Content } from "lib/docs";

import { useEffect } from "react";

import Preview from "components/preview";
import { getContents } from "lib/docs";

type Props = Forwards & {
  recents: Array<[string, Array<ComponentProps<typeof Preview>["data"]>]>;
};

const Page: NextPage<Props> = ({ __setTitle: setTitle, recents }) => {
  useEffect(() => setTitle(), [setTitle]);

  return (
    <main>
      <h1 className="font-zen">Nanai10a Articles.</h1>
      <div>
        <h2 className="font-zen">Recent Updates</h2>
        {/* about 3 contents each categories */}
        {recents.map(([kind, datas]) => (
          <div>
            <h3 className="font-zen">{kind}</h3>
            <ul>
              {datas.map((data) => (
                <Preview size="large" data={data} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Page;

export const getStaticProps: GetStaticProps<Diff<Props, Forwards>> = async () => {
  const contents = Object.entries(await getContents()).map<[string, Array<[string, Content]>]>(
    ([kind, contents]) => [
      kind,
      Object.entries(contents).sort(
        ([_0a, { lastUpdated: a }], [_0b, { lastUpdated: b }]) => a - b,
      ),
    ],
  );

  return { props: {} };
};
