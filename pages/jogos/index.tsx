import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

const Jogos: NextPage = () => {
  const router = useRouter();

  const games = [
    { img: "/images/mini-games/double/Double.png", name: "Double Flowers", link: "/jogos/mini-games/double" },
    { img: "/images/mini-games/double/Double.png", name: "Jogo 2", link: "/games/game2" },
    { img: "/images/game3.jpg", name: "Jogo 3", link: "/games/game3" },
    { img: "/images/game4.jpg", name: "Jogo 4", link: "/games/game4" },
    { img: "/images/game5.jpg", name: "Jogo 5", link: "/games/game5" },
    { img: "/images/game6.jpg", name: "Jogo 6", link: "/games/game6" },
    { img: "/images/game7.jpg", name: "Jogo 7", link: "/games/game7" },
    { img: "/images/game8.jpg", name: "Jogo 8", link: "/games/game8" },
  ];

  const handleClick = (link: string) => {
    router.push(link);
  };

  return (
    <Layout>
      <SignedIn>
        <div className="max-w-[100%] flex flex-col items-center justify-center">
          <h1 className="font-black text-2xl mt-4">MINI-GAMES</h1>

          {/* Carrossel de Jogos */}
          <div className="max-w-[100%] bg-transparent p-4 rounded-lg mb-6">
            <h2 className="flex justify-center align-center text-lg text-green-300 font-regular mb-4">MAIS JOGAGOS</h2>
            <div className="overflow-x-auto max-w-[100%]">
              <div className="flex gap-4">
                {games.map((game, index) => (
                  <div
                    key={index}
                    onClick={() => handleClick(game.link)}
                    className="flex-shrink-0 w-[200px] h-[280px] bg-cover bg-center rounded-[15px] shadow-md cursor-pointer "
                    style={{
                      backgroundImage: `url(${game.img})`,
                    }}
                  >
                      <div className="bg-black bg-opacity-50 text-white text-sm font-bold p-2 rounded-t-[15px] bottom-0 max-w-[100%] text-center">
                        {game.name}
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </Layout>
  );
};

export default Jogos;