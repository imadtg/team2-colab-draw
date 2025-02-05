// app/canvas-uploader/page.tsx
"use client";

import { useRef } from "react";
// Importez le composant UploadButton si vous souhaitez combiner les deux approches
// import { UploadButton } from "~/utils/uploadthing";

export default function CanvasUploader() {
  // Supposons que votre canvas soit un élément <svg> rendu via une référence
  const svgRef = useRef<SVGSVGElement>(null);

  const handleUpload = async () => {
    if (!svgRef.current) return;

    // Récupérez le code SVG sous forme de chaîne de caractères
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);

    // Créez un blob à partir de la chaîne SVG
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    // Créez un objet File (le nom et le type sont importants)
    const file = new File([blob], "canvas.svg", { type: "image/svg+xml" });

    // --- Option 1 : Utiliser un composant d’UploadThing personnalisé ---
    // Si vous préférez que l’utilisateur lance l’upload via un bouton de sélection de fichier,
    // vous pouvez utiliser le composant <UploadButton endpoint="imageUploader" ... />
    //
    // --- Option 2 : Upload programmatique ---
    // Ici, nous simulons un appel programmatique vers votre endpoint d’UploadThing.
    // Pour cela, vous pouvez soit utiliser une fonction fournie par UploadThing (ex: uploadFile)
    // soit faire un appel fetch vers votre API.
    //
    // Exemple avec fetch (attention : ceci est un exemple générique, à adapter en fonction
    // de la manière dont UploadThing attend le fichier) :
    try {
      const formData = new FormData();
      formData.append("file", file);

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
      console.error("Erreur d’upload :", error);
      alert(`Erreur : ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-white text-2xl">Canvas SVG Upload</h1>
      {/* Votre canvas généré sous forme de SVG */}
      <svg
        ref={svgRef}
        width="300"
        height="300"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        style={{ background: "#fff" }}
      >
        {/* Exemple de dessin : un cercle */}
        <circle cx="150" cy="150" r="100" fill="cyan" />
      </svg>
      {/* Bouton pour lancer l’upload */}
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Sauvegarder le SVG
      </button>
    </div>
  );
}
