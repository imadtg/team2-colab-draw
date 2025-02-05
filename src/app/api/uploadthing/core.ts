// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Exemple d’authentification factice (à remplacer par votre logique)
const auth = async (req: Request) => {
  // Par exemple, récupérer l’utilisateur depuis les cookies ou le header
  return { id: "fakeId" };
};

export const ourFileRouter = {
  // Création d’une FileRoute pour uploader des images (ici on utilisera un SVG)
  imageUploader: f({
    image: {
      // Pour voir toutes les options, consultez la documentation
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      // Ce qui est retourné ici sera disponible dans onUploadComplete (ex.: métadonnées utilisateur)
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Ce code s’exécute côté serveur une fois l’upload terminé
      console.log("Upload terminé pour l’utilisateur :", metadata.userId);
      console.log("URL du fichier :", file.url);
      // Ce qui est retourné ici sera envoyé au callback côté client
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
