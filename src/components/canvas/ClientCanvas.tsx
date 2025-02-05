"use client";

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import PartySocket from "partysocket";
import { debounce } from 'lodash';

const ClientCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [socket, setSocket] = useState<PartySocket | null>(null);

    // Flag to suppress local updates when applying a remote change.
    const suppressEvents = useRef(false);
    // Store the last JSON payload sent to avoid re-sending identical states.
    const lastSentCanvasRef = useRef<string | null>(null);

    useEffect(() => {
        const socket = new PartySocket({
            host: "localhost:1999", // TODO: change to the partykit host
            room: "room1", // TODO: change to the room id   
        });

        setSocket(socket);

        socket.onopen = () => {
            console.log("connected to partykit");
            };

        socket.onmessage = (event) => {
            console.log("message from partykit", event.data);
        };

        socket.onclose = () => {
            console.log("disconnected from partykit");
        };
        
        socket.onerror = (event) => {   
            console.log("error from partykit", event);
        };

        return () => {
            socket.close();
        };

    }, []);

    useEffect(() => {
        if (canvasRef.current && !fabricCanvasRef.current) {

            // Initialize Fabric canvas
            const canvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 600,
                backgroundColor: '#1f2937', // Dark background to match the theme
                isDrawingMode: false,
            });
            canvas.renderAll();
            fabricCanvasRef.current = canvas;
        }

        if (fabricCanvasRef.current && socket) {
            const canvas = fabricCanvasRef.current;

            // Debounce the update so that rapid changes (like dragging) don't overwhelm the server.
            const updateCanvas = debounce(() => {
                if (!suppressEvents.current) {
                    const canvasJson = JSON.stringify(canvas.toJSON());
                    // Only send an update if the canvas state is different from the last sent version.
                    if (lastSentCanvasRef.current === canvasJson) {
                        console.log("Canvas unchanged. Not sending update.");
                        return;
                    }
                    lastSentCanvasRef.current = canvasJson;
                    console.log("Sending canvas update to server");
                    socket.send(JSON.stringify({
                        type: 'canvas',
                        data: canvas.toJSON(),
                    }));
                } else {
                    console.log("Update suppressed - remote update in progress");
                }
            }, 300); // Adjust delay as needed

            const handleObjectChange = () => {
                if (suppressEvents.current) {
                    console.log("Local event suppressed");
                    return;
                }
                console.log("Object event");
                updateCanvas();
            };

            // Helper to register event listeners.
            const registerCanvasEvents = () => {
                canvas.on('object:added', handleObjectChange);
                canvas.on('object:modified', handleObjectChange);
                canvas.on('object:moving', handleObjectChange);
                canvas.on('object:scaling', handleObjectChange);
                canvas.on('object:rotating', handleObjectChange);
            };

            // Helper to unregister event listeners.
            const unregisterCanvasEvents = () => {
                canvas.off('object:added', handleObjectChange);
                canvas.off('object:modified', handleObjectChange);
                canvas.off('object:moving', handleObjectChange);
                canvas.off('object:scaling', handleObjectChange);
                canvas.off('object:rotating', handleObjectChange);
            };

            // Initially register the event handlers.
            registerCanvasEvents();

            // Change the onmessage handler to suppress events during a remote update.
            socket.onmessage = (event) => {
                console.log("Message from PartyKit:", event.data);
                try {
                    const { data } = JSON.parse(event.data);
                    if (data.type === 'canvas') {
                        console.log("Remote canvas update received");
                        // Temporarily unregister canvas events so that loadFromJSON doesn't trigger updates.
                        unregisterCanvasEvents();
                        // Suppress local updates during load.
                        suppressEvents.current = true;
                        
                        canvas.loadFromJSON(data.data, () => {
                            console.log("Canvas loaded from remote update");
                            // Force a re-render of all objects
                            canvas.renderAll();
                            canvas.requestRenderAll();
                            
                            // Use a longer timeout to ensure any spurious events have settled.
                            setTimeout(() => {
                                suppressEvents.current = false;
                                registerCanvasEvents();
                                // Add another render call after events are re-registered
                                canvas.renderAll();
                                console.log("Remote update complete, events re-registered");
                            }, 500); // increased delay to 500ms
                        });
                    }
                } catch (error) {
                    console.error("Error parsing message from partykit", error);
                }
            };

            // Cleanup event listeners on unmount
            return () => {
                unregisterCanvasEvents();
            };
        }

        return () => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
                fabricCanvasRef.current = null;
            }
        };
    }, [socket]);

    const addShape = (shapeType: 'rectangle' | 'circle') => {
        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;
        const center = canvas.getCenterPoint();

        if (shapeType === 'rectangle') {
            const rect = new fabric.Rect({
                left: center.x - 50,
                top: center.y - 50,
                fill: '#0891b2',
                width: 100,
                height: 100,
            });
            canvas.add(rect);
        } else if (shapeType === 'circle') {
            const circle = new fabric.Circle({
                left: center.x - 50,
                top: center.y - 50,
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
