import Dexie from "dexie";

export const db = new Dexie("TemporaryPhotosDB");

db.version(1).stores({
  photos: "++id, name, createdAt",
});

export async function savePhoto(file) {
  return db.photos.add({
    name: file.name,
    blob: file,
    createdAt: Date.now(),
  });
}

export async function getPhotos() {
  return db.photos.toArray();
}

export async function deletePhoto(id) {
  return db.photos.delete(id);
}
