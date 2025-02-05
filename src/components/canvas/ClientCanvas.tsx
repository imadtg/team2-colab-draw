"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

import { useUploadThing } from "@/utils/uploadthing";

const ClientCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [roomName, setRoomName] = useState("default-room");
  const { startUpload } = useUploadThing("imageUploader");

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      // Initialize Fabric canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "#1f2937", // Dark background to match the theme
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

  const addShape = (shapeType: "rectangle" | "circle") => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const center = canvas.getCenter();

    if (shapeType === "rectangle") {
      const rect = new fabric.Rect({
        left: center.left - 50,
        top: center.top - 50,
        fill: "#0891b2",
        width: 100,
        height: 100,
      });
      canvas.add(rect);
    } else if (shapeType === "circle") {
      const circle = new fabric.Circle({
        left: center.left - 50,
        top: center.top - 50,
        fill: "#3b82f6",
        radius: 50,
      });
      canvas.add(circle);
    }
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
      canvas.freeDrawingBrush.color = "#ffffff"; // White color for drawing
      canvas.freeDrawingBrush.width = 3;
    }
  };

  const handleUploadSVG = async () => {
    if (!fabricCanvasRef.current) return;
    const svgString = fabricCanvasRef.current.toSVG();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const svgFile = new File([svgBlob], `${roomName}.svg`, {
      type: "image/svg+xml",
    });
    try {
      const result = await startUpload([svgFile]);
      console.log("Upload Result: ", result);
      alert("SVG Uploaded successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Upload Error: ", error);
        alert("SVG Upload failed: " + error.message);
      } else {
        console.error("Upload Error: ", error);
        alert("SVG Upload failed: " + String(error));
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap gap-2 p-4 bg-gray-800 rounded-lg">
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
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter partykit room name"
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleUploadSVG}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Upload Canvas as SVG
        </button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ClientCanvas;
