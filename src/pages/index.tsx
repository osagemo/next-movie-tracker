import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data } = trpc.useQuery(["hello", { text: "fish" }]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return <h1 className="text-3xl font-bold underline">{data.greeting}</h1>;
};

export default Home;
