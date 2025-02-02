'use client';
import { Stage, Layer, Line, Rect, Circle, RegularPolygon, Star } from 'react-konva';
import { useState, useEffect } from 'react';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Ellipse } from 'react-konva';

type ToolType = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'triangle' | 'star' | 'diamond' | 'ellipse';

export default function Canvas() {
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      setCanvasSize({
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.7,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const [lines, setLines] = useState<{ points: number[]; color: string }[]>([]);
  const [shapes, setShapes] = useState<{ type: string; x: number; y: number; width: number; height: number; color: string }[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<ToolType>('pen');
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    setDrawing(true);
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (tool === 'pen' || tool === 'eraser') {
      setLines([...lines, { points: [pos.x, pos.y], color: tool === 'eraser' ? '#ffffff' : color }]);
    } else {
      setStartPos(pos);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    setCursorPos(pos);

    if (!drawing) return;

    if (tool === 'pen' || tool === 'eraser') {
      setLines((prevLines) => {
        const lastLine = { ...prevLines[prevLines.length - 1] };
        lastLine.points = [...lastLine.points, pos.x, pos.y];
        return [...prevLines.slice(0, -1), lastLine];
      });
    } else if (['rectangle', 'circle', 'triangle', 'star', 'diamond', 'ellipse'].includes(tool)) {
      if (startPos) {
        const width = pos.x - startPos.x;
        const height = pos.y - startPos.y;
        setShapes((prevShapes) => {
          const newShapes = [...prevShapes];
          const lastShape = newShapes[newShapes.length - 1];
          if (lastShape && lastShape.type === tool) {
            lastShape.width = width;
            lastShape.height = height;
          } else {
            newShapes.push({ type: tool, x: startPos.x, y: startPos.y, width, height, color });
          }
          return newShapes;
        });
      }
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setStartPos(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-auto">
      <div className="relative">
        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="border border-teal-600"
          style={{ backgroundColor: 'white', cursor: tool === 'eraser' ? 'none' : 'default' }}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line key={i} points={line.points} stroke={line.color} strokeWidth={3} tension={0.5} lineCap="round" lineJoin="round" />
            ))}
            {shapes.map((shape, i) => {
              if (shape.type === 'rectangle') {
                return <Rect key={i} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={shape.color} />;
              } else if (shape.type === 'circle') {
                return <Circle key={i} x={shape.x + shape.width / 2} y={shape.y + shape.height / 2} radius={Math.abs(shape.width) / 2} fill={shape.color} />;
              } else if (shape.type === 'triangle') {
                return <RegularPolygon key={i} x={shape.x + shape.width / 2} y={shape.y + shape.height / 2} sides={3} radius={Math.abs(shape.width) / 2} fill={shape.color} />;
              } else if (shape.type === 'star') {
                return <Star key={i} x={shape.x + shape.width / 2} y={shape.y + shape.height / 2} numPoints={5} innerRadius={Math.abs(shape.width) / 4} outerRadius={Math.abs(shape.width) / 2} fill={shape.color} />;
              } else if (shape.type === 'diamond') {
                return <Rect key={i} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={shape.color} rotation={45} />;
              } else if (shape.type === 'ellipse') {
                return <Ellipse key={i} x={shape.x + shape.width / 2} y={shape.y + shape.height / 2} radiusX={Math.abs(shape.width) / 2} radiusY={Math.abs(shape.height) / 2} fill={shape.color} />;
              }
              return null;
            })}
          </Layer>
        </Stage>

        {/* Curseur personnalisé pour l'eraser */}
        {tool === 'eraser' && cursorPos && (
          <div
            className="absolute w-8 h-8 bg-gray-700 opacity-75 border-2 border-black"
            style={{
              top: cursorPos.y - 16,
              left: cursorPos.x - 16,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Contrôles */}
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <button onClick={() => setTool('pen')} className="bg-black text-white p-2 rounded">🖊️ Stylo</button>
        <button onClick={() => setTool('eraser')} className="bg-gray-500 text-white p-2 rounded">🧽 Gomme</button>
        
        <label className="flex text-white items-center gap-2">
          📐 Forme :
          <select 
            onChange={(e) => setTool(e.target.value as ToolType)} 
            className="p-2 border text-black rounded"
          >
            <option value="rectangle">⬛ Rectangle</option>
            <option value="circle">🔵 Cercle</option>
            <option value="triangle">🔺 Triangle</option>
            <option value="star">⭐ Étoile</option>
            <option value="diamond">💎 Losange</option>
            <option value="ellipse">⭕ Ellipse</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          🎨 Couleur :
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 border-none cursor-pointer" />
        </label>
      </div>
    </div>
  );
}
