import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import MovieList from "@/components/MovieList";

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
