import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useSession, signIn, signOut } from "next-auth/react";
import MovieList from "@/components/movieList";

const Home: NextPage = () => {
  const { data: session } = useSession();
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      {session ? (
        <MovieList userName={session.user?.name ?? "Unknown"} />
      ) : (
        <button className="btn btn-blue mx-auto" onClick={() => signIn()}>
          Sign In
        </button>
      )}
    </div>
  );
};

export default Home;
