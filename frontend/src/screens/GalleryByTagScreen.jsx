import { useGetImagesByTagQuery } from "../slices/imageApiSlice";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

const GalleryByTagScreen = () => {
  const { tag } = useParams();
  const { data: images, isLoading, error } = useGetImagesByTagQuery(tag);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container className="form-background mt-4">
      <Link to="/gallery" className="btn btn-secondary my-3">
        Go Back
      </Link>
      <h2>Gallery</h2>
      <Gallery>
        {images.map((img, index) => (
          <Item
            key={index}
            original={`${process.env.PUBLIC_URL}/${img.image}`}
            thumbnail={`${process.env.PUBLIC_URL}/${img.thumbnail}`}
            width={img.width}
            height={img.height}
            title={img.title}
          >
            {({ ref, open }) => (
              <img
                ref={ref}
                onClick={open}
                src={`${process.env.PUBLIC_URL}/${img.thumbnail}`}
                alt={img.title}
                style={{ margin: "10px", width: "auto", height: "100px" }}
              />
            )}
          </Item>
        ))}
      </Gallery>
    </Container>
  );
};
export default GalleryByTagScreen;
