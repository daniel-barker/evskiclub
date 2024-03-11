import React from 'react';
import { Carousel } from 'react-bootstrap';
import { useGetImagesQuery } from "../slices/imageApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const MemberPageCarousel = () => {
  const { data: images, isLoading, isError, error } = useGetImagesQuery();

  if (isLoading) return <Loader />;
  if (isError) return <Message variant="danger">{error.toString()}</Message>;

  // Filter images for those marked for the carousel
  const carouselImages = images.filter(img => img.carousel);

  return (
    <Carousel>
      {carouselImages.map((img) => (
        <Carousel.Item key={img._id} interval={3000}>
          <img
            className="d-block w-100"
            src={`${process.env.PUBLIC_URL}/${img.image}`}
            alt={img.title}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MemberPageCarousel;
