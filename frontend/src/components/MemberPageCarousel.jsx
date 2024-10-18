import React from "react";
import { Carousel } from "react-bootstrap";
import { useGetCarouselImagesQuery } from "../slices/imageApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const MemberPageCarousel = () => {
  const {
    data: images,
    isLoading,
    isError,
    error,
  } = useGetCarouselImagesQuery();

  if (isLoading) return <Loader />;
  if (isError) return <Message variant="danger">{error.toString()}</Message>;

  return (
    <Carousel fade touch className="shadow">
      {images.map((img) => (
        <Carousel.Item key={img._id} interval={7000}>
          <img className="d-block w-100" src={`${img.image}`} alt={img.title} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MemberPageCarousel;
