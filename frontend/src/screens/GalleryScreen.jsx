import React, { useEffect, useState } from "react";
import { Gallery } from "react-grid-gallery";
import { useGetImagesQuery } from "../slices/imageApiSlice";

const GalleryScreen = () => {
  const { data: images, isLoading, error } = useGetImagesQuery();
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    if (images) {
      const formattedImages = images.map((img) => ({
        src: img.image,
        thumbnail: img.thumbnail,
        thumbnailWidth: img.width / 2,
        thumbnailHeight: img.height / 2,
        caption: img.title,
      }));
      setGalleryImages(formattedImages);
    }
  }, [images]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Gallery</h2>
      <Gallery images={galleryImages} enableImageSelection={false} />
    </div>
  );
};

export default GalleryScreen;
