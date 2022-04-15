import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["hello", { text: "client" }]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <h1 className="text-3xl font-bold underline">{data.greeting}</h1>;
};

export default Home;
