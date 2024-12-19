import { useState, useEffect, useRef } from "react";
import Layout from "../../components(games)/Layout";

export default function Game() {
  const images = [
    { img: "/images/mini-games/double/sakura.png", name: "sakura" },
    { img: "/images/mini-games/double/capim.png", name: "capim" },
    { img: "/images/mini-games/double/margarida.png", name: "margarida" },
    { img: "/images/mini-games/double/girassol.png", name: "girassol" },
  ];

  const [squares, setSquares] = useState(images);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const [timer, setTimer] = useState(5);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const audioRef = useRef(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const generateRandomResult = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const updateHistory = (chosenResult) => {
    setHistory((prevHistory) => {
      const newHistory = [chosenResult, ...prevHistory];
      localStorage.setItem("rouletteHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  useEffect(() => {
    let spinningInterval;

    if (isSpinning) {
      spinningInterval = setInterval(() => {
        setSquares((prev) => [...prev.slice(1), prev[0]]);
      }, 150);
      playSound();
    }

    return () => clearInterval(spinningInterval);
  }, [isSpinning]);

  useEffect(() => {
    if (isSpinning) {
      const spinTimeout = setTimeout(() => stopSpin(), 5000);
      return () => clearTimeout(spinTimeout);
    } else {
      setShowProgressBar(true);
      const timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
          clearInterval(timerInterval);
          return 1;
        });
      }, 1000);

      const stopTimeout = setTimeout(() => {
        setShowProgressBar(false);
        setIsSpinning(true);
        setSelected(null);
      }, 5000);

      return () => {
        clearTimeout(stopTimeout);
        clearInterval(timerInterval);
      };
    }
  }, [isSpinning]);

  const stopSpin = () => {
    setIsSpinning(false);
    const chosenResult = generateRandomResult();

    setSquares((prev) => {
      const index = prev.findIndex((item) => item.name === chosenResult.name);
      const shiftIndex = (index - 1 + images.length) % images.length; // Ajusta para o segundo quadrado
      return [...prev.slice(shiftIndex), ...prev.slice(0, shiftIndex)];
    });

    setTimeout(() => {
      setResult(chosenResult);
      updateHistory(chosenResult);

      if (selected) {
        alert(
          selected.name === chosenResult.name
            ? "Parabéns, você venceu!"
            : "Que pena, você perdeu!"
        );
      }
    }, 1000);
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("rouletteHistory"));
    if (storedHistory) setHistory(storedHistory);
  }, []);

  return (
    <Layout>
      <div className="bg-[#13131d] w-full flex flex-col justify-center items-center px-6 py-8">
        <audio ref={audioRef} src="/sounds/roulette.mp3" preload="auto"></audio>
        <h1 className="text-white text-4xl font-bold mb-10">Double Flowers</h1>

        <div className="text-white text-lg mb-2">
          {isSpinning ? "A roleta está girando..." : `Tempo para apostas: ${timer}s`}
        </div>

        {!isSpinning && showProgressBar && (
          <div className="w-full max-w-md h-2 bg-gray-700 rounded-md mb-4">
            <div
              className="h-full bg-green-500 rounded-md"
              style={{ width: `${(timer / 5) * 100}%` }}
            ></div>
          </div>
        )}

        <div className="w-full max-w-md bg-slate-800 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-white text-lg font-bold mb-2">Histórico de Resultados</h2>
          <div className="flex gap-2 overflow-x-auto">
            {history.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[50px] h-[50px] bg-center bg-cover rounded-lg"
                style={{ backgroundImage: `url(${item.img})` }}
              />
            ))}
          </div>
        </div>

        <div className="relative w-full flex justify-center items-center bg-slate-800 p-4 h-[150px] rounded-lg overflow-hidden">
          <div className="absolute w-0.5 h-[95%] rounded-[50px] bg-red-600 left-[135px] transform -translate-x-1/2"></div>
          <div className="flex gap-4">
            {squares.map((square, index) => (
              <div
                key={index}
                className={`w-[90px] h-[90px] rounded-[15px] bg-center bg-cover ${
                  index === 1 ? "ring-4 ring-indigo-500" : "opacity-30"
                }`}
                style={{ backgroundImage: `url(${square.img})` }}
              ></div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowBetModal(true)}
          disabled={isSpinning || timer === 0}
          className={`mt-6 py-2 px-6 rounded-full font-semibold transition-all ${
            isSpinning || timer === 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-500"
          }`}
        >
          Apostar
        </button>

        {showBetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg text-center">
              <h2 className="text-black text-lg font-bold">Escolha sua aposta</h2>
              <div className="flex gap-4 mt-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelected(image)}
                    className={`w-[80px] h-[80px] rounded-lg cursor-pointer ${
                      selected?.name === image.name ? "ring-4 ring-indigo-500" : ""
                    }`}
                    style={{
                      backgroundImage: `url(${image.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                ))}
              </div>
              <button
                onClick={() => setShowBetModal(false)}
                className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-indigo-500 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}