"use client";

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

const ClientCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const [isDrawingMode, setIsDrawingMode] = useState(false);

    useEffect(() => {
        if (canvasRef.current && !fabricCanvasRef.current) {
            // Initialize Fabric canvas
            const canvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 600,
                backgroundColor: '#1f2937', // Dark background to match the theme
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

    const addShape = (shapeType: 'rectangle' | 'circle') => {
        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;
        const center = canvas.getCenter();

        if (shapeType === 'rectangle') {
            const rect = new fabric.Rect({
                left: center.left - 50,
                top: center.top - 50,
                fill: '#0891b2',
                width: 100,
                height: 100,
            });
            canvas.add(rect);
        } else if (shapeType === 'circle') {
            const circle = new fabric.Circle({
                left: center.left - 50,
                top: center.top - 50,
                fill: '#3b82f6',
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
            canvas.freeDrawingBrush.color = '#ffffff'; // White color for drawing
            canvas.freeDrawingBrush.width = 3;
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2 p-4 bg-gray-800 rounded-lg">
                <button
                    onClick={() => addShape('rectangle')}
                    className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                >
                    Add Rectangle
                </button>
                <button
                    onClick={() => addShape('circle')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Add Circle
                </button>
                <button
                    onClick={toggleDrawingMode}
                    className={`px-4 py-2 rounded ${
                        isDrawingMode 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-600 hover:bg-gray-700'
                    } text-white`}
                >
                    {isDrawingMode ? 'Exit Drawing' : 'Start Drawing'}
                </button>
            </div>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ClientCanvas;
