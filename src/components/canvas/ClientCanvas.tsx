"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import Bar from "@/app/Bar";
import Image from "next/image";

const ClientCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [BarSide, setBarSide] = useState(true);
  // const [cls, setcls] = useState("Bar");

  const [colorBordure, setColorBordure] = useState("red");
  const [BackgroundColor, setBackgroundColor] = useState("red");
  const [ligneWidth, setligneWidth] = useState(2);
  const [ligneType, setligneType] = useState(false);
  // const [opacity, setOpacity] = useState(1);

  // const [tool, setTool] = useState<
  //   | "selector"
  //   | "pen"
  //   | "text"
  //   | "eraser"
  //   | "rectangle"
  //   | "circle"
  //   | "ligne"
  //   | "triangle"
  //   | "ellipse"
  // >("pen");

  const handlerTool = (
    shapeType:
      | "selector"
      | "pen"
      | "eraser"
      | "text"
      | "rectangle"
      | "circle"
      | "triangle"
      | "ligne"
      | "diamond"
      | "selector"
      | "ellipse"
  ) => {
    // Vérifie explicitement chaque forme
    if (
      shapeType === "circle" ||
      shapeType === "rectangle" ||
      shapeType === "triangle" ||
      shapeType === "text" ||
      shapeType === "pen" ||
      shapeType === "ligne" ||
      shapeType === "ellipse"
    ) {
      setBarSide(true);
    } else {
      setBarSide(false);
    }
    if (shapeType === "pen") toggleDrawingMode();
    else {
      if (
        shapeType === "circle" ||
        shapeType === "rectangle" ||
        shapeType === "triangle" ||
        shapeType === "ellipse"
      ) {
        addShape(shapeType);
      }
      toggleDrawingMode();
    }
    if (shapeType === "pen") toggleDrawingMode();
    else {
      if (
        shapeType === "circle" ||
        shapeType === "rectangle" ||
        shapeType === "triangle" ||
        shapeType === "ligne" ||
        shapeType === "text"
      ) {
        addShape(shapeType);
      }
      toggleDrawingMode();
    }
  };

  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    if (canvasRef.current && !fabricCanvasRef.current) {
      // Initialize Fabric canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: parent?.clientWidth,
        height: parent?.clientHeight,
        isDrawingMode: false,
      });

      fabricCanvasRef.current = canvas;
    }

    // Cleanup function
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  const addShape = (
    shapeType:
      | "rectangle"
      | "circle"
      | "triangle"
      | "ligne"
      | "text"
      | "ellipse"
  ) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const center = canvas.getCenter();

    if (shapeType === "rectangle") {
      const rect = new fabric.Rect({
        left: center.left - 50,
        top: center.top - 50,
        fill: BackgroundColor,
        ...(ligneType ? { strokeDashArray: [5, 5] } : null),
        stroke: colorBordure,
        strokeWidth: ligneWidth,
        width: 100,
        height: 100,
        opacity: 0.5,
      });
      canvas.add(rect);
    } else if (shapeType === "circle") {
      const circle = new fabric.Circle({
        left: center.left - 50,
        top: center.top - 50,
        fill: BackgroundColor,
        stroke: colorBordure,
        ...(ligneType ? { strokeDashArray: [5, 5] } : null),
        strokeWidth: ligneWidth,
        radius: 50,
      });
      canvas.add(circle);
    } else if (shapeType === "triangle") {
      const triangle = new fabric.Triangle({
        width: 100,
        height: 100,
        fill: BackgroundColor,
        left: 100,
        top: 100,
        angle: 0,
        ...(ligneType ? { strokeDashArray: [5, 5] } : null),
        stroke: colorBordure,
        strokeWidth: ligneWidth,
        selectable: true,
      });
      canvas.add(triangle);
    } else if (shapeType === "ligne") {
      const line = new fabric.Line([50, 50, 200, 200], {
        stroke: colorBordure,
        strokeWidth: ligneWidth,
        ...(ligneType ? { strokeDashArray: [5, 5] } : null),
        selectable: true,
      });
      canvas.add(line);
    } else if (shapeType === "text") {
      const text = new fabric.Textbox("Hello World", {
        left: 100,
        top: 100,
        fill: colorBordure,
        fontSize: ligneWidth * 10,
        fontFamily: "Arial",
        selectable: true,
      });
      canvas.add(text);
    } else if (shapeType === "ellipse") {
      const ellipse = new fabric.Ellipse({
        left: center.left - 50,
        top: center.top - 50,
        fill: BackgroundColor, // Remplace BackgroundColor par la couleur que tu souhaites
        stroke: colorBordure, // Remplace colorBordure par la couleur de bordure souhaitée
        ...(ligneType ? { strokeDashArray: [5, 5] } : null), // Si ligneType est vrai, appliquer un motif de bordure en tirets
        strokeWidth: ligneWidth, // Largeur de la bordure
        rx: 50, // Rayon horizontal (demi-largeur de l'ellipse)
        ry: 30, // Rayon vertical (demi-hauteur de l'ellipse)
      });
      canvas.add(ellipse);
    }
    //   const path = new fabric.Path('M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80', {
    //     fill: 'transparent',
    //     stroke: 'pink',
    //     strokeWidth: 2,
    //     selectable: true
    //   });
    //   canvas.add(path);
    //   const polyline = new fabric.Polyline([
    //     { x: 50, y: 50 },
    //     { x: 100, y: 100 },
    //     { x: 150, y: 50 }
    //   ], {
    //     fill: 'transparent',
    //     stroke: 'orange',
    //     strokeWidth: 2,
    //     selectable: true
    //   });
    //   canvas.add(polyline);
  };

  const toggleDrawingMode = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const newMode = !isDrawingMode;
    setIsDrawingMode(newMode);
    canvas.isDrawingMode = newMode;

    if (newMode) {
      // Initialize the brush if it doesn't exist
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }
      canvas.freeDrawingBrush.color = colorBordure; // White color for drawing
      canvas.freeDrawingBrush.width = ligneWidth;
    }
  };
  const handleColorBordure = (colorBordure: string) => {
    setColorBordure(colorBordure);
  };
  const handleColorBackground = (colorBackground: string) => {
    setBackgroundColor(colorBackground);
  };
  const handleLigneWidth = (width: number) => {
    setligneWidth(width);
  };
  const handleLigneType = (type: boolean) => {
    setligneType(type);
  };

  // const handleOpacity = (opacity: number) => {
  //   setOpacity(opacity);
  // };
  return (
    <>
      <Bar
        isVisible={BarSide}
        handleColorBordure={handleColorBordure}
        handleColorBackground={handleColorBackground}
        handleLigneWidth={handleLigneWidth}
        handleLigneType={handleLigneType}
        handleOpacity={() => {}}
      />
      <div className="flex flex-col items-center gap-4">
        <div
          className="fixed bottom-[5%]  left-1/2 transform -translate-x-1/2
   bg-black p-4 rounded-lg shadow-lg h-8 w-3/5 max-w-xl flex items-center justify-center "
        >
          <div className="flex justify-center items-center">
            <ol className="flex gap-7">
              <li className="transform transition-transform duration-300 scale-75 hover:scale-100  ">
                <Image
                  src="/click.png"
                  alt="Click Icon"
                  onClick={() => handlerTool("selector")}
                  width={24}
                  height={24}
                />
              </li>
              <li className="transform transition-transform duration-300 scale-75 hover:scale-150">
                <Image
                  src="/color-palette.png"
                  alt="Color Palette Icon"
                  onClick={() => handlerTool("selector")}
                  width={24}
                  height={24}
                />
              </li>
              <li className="transform transition-transform duration-300 scale-75 hover:scale-150">
                <Image
                  src="/line-segment.png"
                  alt="Line Segment Icon"
                  onClick={() => handlerTool("ligne")}
                  width={24}
                  height={24}
                />
              </li>
              <li className="transform transition-transform duration-300 scale-75 hover:scale-150">
                <Image
                  src="/move.png"
                  alt="Move Icon"
                  onClick={() => handlerTool("selector")}
                  width={24}
                  height={24}
                />
              </li>
              <li className="transform transition-transform duration-300 scale-75 hover:scale-150">
                <Image
                  src="/pen.png"
                  alt="Pen Icon"
                  onClick={() => handlerTool("pen")}
                  width={24}
                  height={24}
                />
              </li>
              <li className="transform transition-transform duration-300 scale-75 hover:scale-150">
                <Image
                  src="/round.png"
                  alt="Round Icon"
                  onClick={() => handlerTool("circle")}
                  width={24}
                  height={24}
                />
              </li>
              <li className="transform transition-transform duration-300 scale-75 hover:scale-150">
                <Image
                  src="/text.png"
                  alt="Text Icon"
                  onClick={() => handlerTool("text")}
                  width={24}
                  height={24}
                />
              </li>
              <li className="transform transition-transform duration-300 scale-75 hover:scale-150">
                <Image
                  src="/rectangle.png"
                  alt="Rectangle Icon"
                  onClick={() => handlerTool("rectangle")}
                  width={24}
                  height={24}
                />
              </li>
              <li className="transform transition-transform duration-300 scale-75 hover:scale-150">
                <Image
                  src="/triangle.png"
                  alt="triangle Icon"
                  onClick={() => handlerTool("triangle")}
                  width={24}
                  height={24}
                />
              </li>
              <li className="transform transition-transform duration-300 scale-75 hover:scale-150">
                <Image
                  src="/vector.png"
                  alt="ellipse Icon"
                  onClick={() => handlerTool("ellipse")}
                  width={24}
                  height={24}
                />
              </li>
            </ol>
          </div>
        </div>
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                bg-white  rounded-lg shadow-lg h-[77%] w-[77%]"
        >
          <canvas ref={canvasRef} />
        </div>
        {/* <div className="flex gap-2 p-4 bg-gray-800 rounded-lg">
          <button
            onClick={() => addShape("rectangle")}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            Add Rectangle
          </button>
          <button
            onClick={() => addShape("circle")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Circle
          </button>
          <button
            onClick={toggleDrawingMode}
            className={`px-4 py-2 rounded ${
              isDrawingMode
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            } text-white`}
          >
            {isDrawingMode ? "Exit Drawing" : "Start Drawing"}
          </button>
        </div> */}
      </div>
    </>
  );
};

export default ClientCanvas;
