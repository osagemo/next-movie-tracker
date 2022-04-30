import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useSession, signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();
  // const { data } = trpc.useQuery(["hello", { text: "fish" }]);

  // if (!data) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      {session ? (
        <>
          <button onClick={() => signOut()}>Sign Out</button>
          <div className="text-center text-3xl">
            {session.user?.name ?? "Unknown"}&apos;s Movie tracker
          </div>
          <div className="p-5 flex justify-between items-center w-1/2">
            <div>
              <h3>Watched</h3>
              <div className="bg-gray-100 h-96 w-80"></div>
            </div>
            <div>
              <h3>Wanna</h3>
              <div className="bg-gray-100 h-96 w-80"></div>
            </div>
          </div>
        </>
      ) : (
        <button className="btn btn-blue mx-auto" onClick={() => signIn()}>
          Sign In
        </button>
      )}
    </div>
  );
};

export default Home;
