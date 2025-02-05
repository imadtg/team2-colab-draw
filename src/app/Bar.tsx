import React from "react";
import { useState } from "react";


export default function Bar() { 
   const [opacity, setOpacity] = useState(1);

  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(Number(event.target.value));
  };

  return (
    <div 
    className={`fixed z-10 flex mt-[100px] w-[250px] h-[513px] bg-black top-[30px] left-0 rounded-[20px] p-[10px] ml-[20px] flex-col gap-[25px] text-white`}    >
      <div>
        <span className="text-xs ">Color</span>
        <div className="flex flex-row  gap-[15px]">
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center border-[1px] border-white"
            style={{ backgroundColor: "black" }}
          ></button>
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center  border-[1px] border-white"
            style={{ backgroundColor: "red" }}
          ></button>{" "}
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center  border-[1px] border-white"
            style={{ backgroundColor: "green" }}
          ></button>
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center border-[1px] border-white"
            style={{ backgroundColor: "blue" }}
          ></button>{" "}
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center  border-[1px] border-white"
            style={{ backgroundColor: "orange" }}
          ></button>
          <input
            type="color"
            className="w-[25px] h-[25px] rounded-[5px] border-none cursor-pointer  border-[1px] border-white"
          />
        </div>
      </div>
      <div>
        <span className="text-xs ">Arrier Plan</span>
        <div className="flex flex-row  gap-[15px]">
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: "red " }}
          ></button>{" "}
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: "#ffc9c9" }}
          ></button>
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: "#b2f2bb " }}
          ></button>{" "}
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: " #a5d8ff " }}
          ></button>
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: " #ffec99 " }}
          ></button>
          <input
            type="color"
            className="w-[25px] h-[25px] rounded-[5px] border-none cursor-pointer"
          />
        </div>
      </div>
      <div>
        <span className="text-xs ">Remplissage </span>
        <div className="flex flex-row  gap-[15px]">
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{ backgroundColor: "#d6d6d6 " }}
          >
            <img src="/edit.png" alt="i" className="w-6 h-6" />
          </button>

          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundImage: "url(/path-to-your-image.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img src="/v.png" alt="i" className="w-6 h-6" />
          </button>

          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundImage: "url(/path-to-your-image.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img src="/i-path.png" alt="i" className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div>
        <span className="text-xs ">Largeur de Contour</span>
        <div className="flex flex-row  gap-[15px]">
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundColor: "white",
            }}
          >
            <img src="/remove.png" alt="i" className="w-6 h-6 " />
          </button>

          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundColor: "white",
            }}
          >
            <img src="/minus.png" alt="i" className="w-6 h-6" />
          </button>
          <button className="w-[25px] h-[25px] rounded-[5px] text-center">
            <img
              src="public/circumflex-accent.png"
              alt="i"
              className="w-6 h-6"
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
          >
            <img src="/remove.png" alt="i" className="w-6 h-6 " />
          </button>

          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundColor: "white",
            }}
          >
            <img src="/dashed-line.png" alt="i" className="w-6 h-6" />
          </button>
          <button
            className="w-[25px] h-[25px] rounded-[5px] text-center"
            style={{
              backgroundColor: "white",
            }}
          >
            <img src="/line.png" alt="i" className="w-6 h-6" />
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
}
