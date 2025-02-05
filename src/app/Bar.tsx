import React, { useState } from "react";
import Image from "next/image";

interface BarProps {
  handleColorBordure: (color: string) => void; // Fonction qui prend une couleur en paramètre
  isVisible?: boolean;
  handleColorBackground: (color: string) => void; // Fonction qui prend une couleur en paramètre
  handleLigneWidth: (width: number) => void;
  handleLigneType: (type: boolean) => void;
  handleOpacity: (opacity: number) => void;
}

const Bar: React.FC<BarProps> = ({
  isVisible,
  handleColorBordure,
  handleColorBackground,
  handleLigneWidth,
  handleLigneType,
  handleOpacity,
}) => {
  const [colorBordure, setColorBordure] = useState("black");
  const [colorBackground, setcolorBackground] = useState("black");

  const handlerColorBordure = (color: string) => {
    handleColorBordure(color);
    setColorBordure(color);
  };
  const handlerColorBackground = (color: string) => {
    handleColorBackground(color);
    setcolorBackground(color);
  };
  const handlerLigneWidth = (width: number) => {
    handleLigneWidth(width);
  };

  const handlerLigneType = (type: boolean) => {
    handleLigneType(type);
  };
  const [opacity, setOpacity] = useState(1);

  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(parseFloat(event.target.value));
    handleOpacity(parseFloat(event.target.value));
  };

  return (
    <div
      className={`fixed z-10 flex mt-[100px] w-[250px] h-[513px] bg-black top-[5px] left-0 rounded-[20px] p-[10px] ml-[10px] flex-col gap-[25px] text-white  transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
      }`}
    >
      <div>
        <span className="text-xs ">Color</span>
        <div className="flex flex-row  gap-[15px]">
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center  border-[1px] border-white"
            style={{ backgroundColor: "white" }}
            onClick={() => handlerColorBordure("white")}
          ></button>
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center border-[1px] border-white"
            style={{ backgroundColor: "black" }}
            onClick={() => handlerColorBordure("black")}
          ></button>
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center  border-[1px] border-white"
            style={{ backgroundColor: "red" }}
            onClick={() => handlerColorBordure("red")}
          ></button>{" "}
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center border-[1px] border-white"
            style={{ backgroundColor: "blue" }}
            onClick={() => handlerColorBordure("blue")}
          ></button>{" "}
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center  border-[1px] border-white"
            style={{ backgroundColor: "orange" }}
            onClick={() => handlerColorBordure("orange")}
          ></button>
          <input
            type="color"
            className="w-[25px] h-[25px] rounded-[5px] border-none cursor-pointer"
            value={colorBordure}
            onChange={(e) => handlerColorBordure(e.target.value)}
          />
        </div>
      </div>
      <div>
        <span className="text-xs ">Arrier Plan</span>
        <div className="flex flex-row  gap-[15px]">
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: " #fff" }}
            onClick={() => handlerColorBackground("#fff")}
          ></button>
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: "red " }}
            onClick={() => handlerColorBackground("red")}
          ></button>{" "}
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: "#ffc9c9" }}
            onClick={() => handlerColorBackground("#ffc9c9")}
          ></button>
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: "#b2f2bb " }}
            onClick={() => handlerColorBackground("#b2f2bb")}
          ></button>{" "}
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: " #a5d8ff " }}
            onClick={() => handlerColorBackground("#a5d8ff ")}
          ></button>
          <input
            type="color"
            className="w-[25px] h-[25px] rounded-[5px] border-none cursor-pointer"
            value={colorBackground}
            onChange={(e) => handlerColorBackground(e.target.value)}
          />
        </div>
      </div>
      <div>
        <span className="text-xs ">Remplissage </span>
        <div className="flex flex-row  gap-[15px]">
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundColor: "#d6d6d6 ",
            }}
          >
            <Image
              src="/edit.png"
              alt="i"
              className="w-6 h-6"
              width={24}
              height={24}
            />
          </button>

          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundImage: "url(/path-to-your-image.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Image
              src="/v.png"
              alt="i"
              className="w-6 h-6"
              width={24}
              height={24}
            />
          </button>

          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundImage: "url(/path-to-your-image.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Image
              src="/i-path.png"
              alt="i"
              className="w-6 h-6"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
      <div>
        <span className="text-xs ">Largeur de Ligne</span>
        <div className="flex flex-row  gap-[15px]">
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundColor: "white",
            }}
            onClick={() => handlerLigneWidth(5)}
          >
            <Image
              src="/remove.png"
              alt="i"
              className="w-6 h-6"
              width={24}
              height={24}
            />
          </button>

          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundColor: "white",
            }}
            onClick={() => handlerLigneWidth(2)}
          >
            <Image
              src="/minus.png"
              alt="i"
              className="w-6 h-6"
              width={24}
              height={24}
            />
          </button>
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            onClick={() => handlerLigneWidth(1)}
          >
            <Image
              src="/circumflex-accent.png"
              alt="i"
              className="w-6 h-6"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
      <div>
        <span className="text-xs ">Style de trait</span>
        <div className="flex flex-row  gap-[15px]">
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundColor: "white",
            }}
            onClick={() => handlerLigneType(false)}
          >
            <Image
              src="/remove.png"
              alt="i"
              className="w-6 h-6"
              width={24}
              height={24}
            />
          </button>

          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundColor: "white",
            }}
            onClick={() => handlerLigneType(true)}
          >
            <Image
              src="/dashed-line.png"
              alt="i"
              className="w-6 h-6"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
      <div>
        <span className="text-xs ">Transparence</span>
        <div className="flex flex-row justify-center gap-[15px]">
          <input
            id="opacityRange"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={handleOpacityChange}
            className="w-[200px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Bar;
