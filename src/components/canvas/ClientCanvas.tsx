"use client"; 

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

const ClientCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const [isDrawingMode, setIsDrawingMode] = useState(false); // Ajouté pour le mode dessin

    useEffect(() => {
        if (canvasRef.current && !fabricCanvasRef.current) {
            // Initialiser le canvas Fabric
            const canvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 600,
                backgroundColor: '#1f2937', // Fond sombre pour le thème
                isDrawingMode: false,
            });
            
            fabricCanvasRef.current = canvas;
        }

        // Fonction de nettoyage
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
            // Initialiser le pinceau s'il n'existe pas
            if (!canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            }
            canvas.freeDrawingBrush.color = '#ffffff'; // Couleur blanche pour le dessin
            canvas.freeDrawingBrush.width = 3;
        }
    };

    // Nouvelle fonction pour uploader le dessin sur UploadThing
    const handleUpload = async () => {
        if (!fabricCanvasRef.current) return;

        // Exporter le canvas en SVG
        const svgString = fabricCanvasRef.current.toSVG();
        // Créer un Blob à partir de la chaîne SVG
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        // Créer un objet File à partir du Blob
        const file = new File([blob], "drawing.svg", { type: "image/svg+xml" });

        // Préparer les données pour l'upload
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Appel vers votre API UploadThing déjà configurée
            const response = await fetch("/api/uploadthing", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'upload");
            }

            const data = await response.json();
            console.log("Upload réussi :", data);
            alert("Upload terminé !");
        } catch (error: any) {
            console.error("Erreur d'upload :", error);
            alert(`Erreur : ${error.message}`);
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
                {/* Bouton ajouté pour uploader le dessin sur UploadThing */}
                <button
                    onClick={handleUpload}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Upload Drawing
                </button>
            </div>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ClientCanvas;
