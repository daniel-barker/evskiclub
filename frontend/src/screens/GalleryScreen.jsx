import {
  useGetImagesQuery,
  useGetImageTagsQuery,
} from "../slices/imageApiSlice";
import { Container } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

const GalleryScreen = () => {
  const { data: images, isLoading, error } = useGetImagesQuery();
  const {
    data: tags,
    isLoading: isLoadingTags,
    error: errorTags,
  } = useGetImageTagsQuery();

  if (isLoadingTags) return <div>Loading...</div>;
  if (errorTags) return <div>Error: {errorTags.message}</div>;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container>
      <h2>Gallery</h2>
      <Gallery>
        {images.map((img, index) => (
          <Item
            key={index}
            original={img.image}
            thumbnail={img.thumbnail}
            width={img.width}
            height={img.height}
            title={img.title}
          >
            {({ ref, open }) => (
              <img
                ref={ref}
                onClick={open}
                src={img.thumbnail}
                alt={img.title}
                style={{ margin: "10px", width: "auto", height: "100px" }}
              />
            )}
          </Item>
        ))}
      </Gallery>
      <div className="mt-4 form-background">
        <h2>Tags</h2>

        {tags.map((tag, index) => (
          <a key={index}>| {tag} |</a>
        ))}
      </div>
    </Container>
  );
};

export default GalleryScreen;
