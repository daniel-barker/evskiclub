import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import { FaPlus, FaMinus } from "react-icons/fa";
import Loader from "../../components/Loader";
import CreateContainer from "../../components/CreateContainer";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import {
  useGetUnitByIdQuery,
  useUpdateUnitMutation,
  useUploadUnitImageMutation,
} from "../../slices/unitApiSlice";

const MemberEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [memberSince, setMemberSince] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [originalImage, setOriginalImage] = useState("");

  const { data: unit, isLoading, error } = useGetUnitByIdQuery(id);
  const [updateUnit, { isLoading: loadingUpdate }] = useUpdateUnitMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadUnitImageMutation();

  useEffect(() => {
    if (unit) {
      setMembers(unit.members);
      setAddresses(unit.addresses);
      setMemberSince(unit.memberSince);
      setBio(unit.bio);
      setOriginalImage(unit.image);
    }
  }, [unit]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Start with the base unit details
    const updatedUnit = {
      id,
      members,
      addresses,
      memberSince,
      bio,
    };

    // If the 'removeImage' checkbox is not checked and a new image has been selected, proceed with image upload
    if (!removeImage && image instanceof File) {
      try {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResult = await uploadImage(formData).unwrap();
        updatedUnit.image = uploadResult.image;
      } catch (err) {
        toast.error(
          "Failed to upload image: " + (err?.data?.message || err.error)
        );
        return;
      }
    } else if (removeImage) {
      // If 'removeImage' is checked, ensure 'image' and 'thumbnail' are not included in the payload
      // This is effectively done by not adding them to 'updatedEvent'
    } else {
      // If no new image is selected, retain the original image
      if (originalImage) {
        updatedUnit.image = originalImage;
      }
    }
    // update the unit
    try {
      const result = await updateUnit(updatedUnit).unwrap();
      if (!result.error) {
        toast.success("Member unit updated successfully");
        navigate("/admin/members/list");
      } else {
        throw new Error("Update failed: " + result.error.message);
      }
    } catch (error) {
      toast.error(
        "Failed to update member unit: " + error?.data?.message || error.error
      );
      console.error(error?.data?.message || error.error);
    }
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImageChange = (e) => {
    setRemoveImage(e.target.checked);
  };

  const addMemberFields = () => {
    setMembers([
      ...members,
      {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: [{ number: "", type: "home" }],
        honorary: false,
      },
    ]);
  };

  const handleMemberChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setMembers((prevMembers) => {
      return prevMembers.map((member, i) => {
        if (i === index) {
          // Create a new copy of the member object and update the property
          return {
            ...member,
            [name]: type === "checkbox" ? checked : value,
          };
        }
        return member; // Return all other members unchanged
      });
    });
  };

  const removeMemberFields = (index) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  const addPhoneNumber = (memberIndex) => {
    // Create a new copy of the members array
    const updatedMembers = members.map((member, index) => {
      if (index === memberIndex) {
        // For the targeted member, create a new copy of the phoneNumber array and add the new phone number object
        return {
          ...member,
          phoneNumber: [...member.phoneNumber, { number: "", type: "home" }],
        };
      }
      // For all other members, return them as is
      return member;
    });

    // Update the state with the new array
    setMembers(updatedMembers);
  };

  const handlePhoneNumberChange = (memberIndex, phoneNumberIndex, e) => {
    const updatedMembers = [...members];
    updatedMembers[memberIndex].phoneNumber[phoneNumberIndex][e.target.name] =
      e.target.value;
    setMembers(updatedMembers);
  };

  const removePhoneNumber = (index, subIndex) => {
    const updatedMembers = [...members];
    updatedMembers[index].phoneNumber.splice(subIndex, 1);
    setMembers(updatedMembers);
  };

  const addAddressFields = () => {
    setAddresses([
      ...addresses,
      { addressType: "secondary", street: "", city: "", state: "", zip: "" },
    ]);
  };

  const handleAddressChange = (index, e) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index][e.target.name] = e.target.value;
    setAddresses(updatedAddresses);
  };

  const removeAddressFields = (index) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    setAddresses(updatedAddresses);
  };

  return (
    <div className="blurred-background">
      <br />
      <br />

      <Container>
        <Link to="/admin/members/list" className="btn btn-primary my-3">
          Go Back
        </Link>
        <CreateContainer>
          <h1 className="text-center">Edit (Directory/Membership) Entry</h1>
          <hr />
          {isLoading && <Loader />}
          {loadingUpdate && <Loader />}
          {error && <Message variant="danger">{error}</Message>}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="members">
              <Form.Label>
                <h3>Member(s)</h3>
              </Form.Label>
              {members.map((member, index) => (
                <div key={index}>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      name="firstName"
                      value={member.firstName}
                      onChange={(e) => handleMemberChange(index, e)}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="lastName">
                    <Form.Label className="pt-4">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      name="lastName"
                      value={member.lastName}
                      onChange={(e) => handleMemberChange(index, e)}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="honorary">
                    <Form.Check
                      type="checkbox"
                      label="Honorary Member?"
                      name="honorary"
                      checked={member.honorary || false}
                      onChange={(e) => handleMemberChange(index, e)}
                    />
                  </Form.Group>
                  <Form.Group controlId="email">
                    <Form.Label className="pt-4">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, e)}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="phoneNumber">
                    <FaPlus onClick={() => addPhoneNumber(index)} />

                    <Form.Label className="pt-4">Phone Number(s)</Form.Label>
                    {member.phoneNumber.map((phone, subIndex) => (
                      <div key={subIndex}>
                        <Row>
                          <Col>
                            <Form.Group controlId="number">
                              <FaMinus
                                onClick={() =>
                                  removePhoneNumber(index, subIndex)
                                }
                              />
                              Phone Number {subIndex + 1}:
                              <Form.Control
                                className="mt-2"
                                type="text"
                                placeholder="Enter phone number"
                                name="number"
                                value={phone.number}
                                onChange={(e) =>
                                  handlePhoneNumberChange(index, subIndex, e)
                                }
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group
                              controlId={`phoneNumberType-${index}-${subIndex}`}
                            >
                              <Form.Label>Phone Type</Form.Label>
                              <Form.Control
                                as="select"
                                name="type"
                                value={phone.type}
                                onChange={(e) =>
                                  handlePhoneNumberChange(index, subIndex, e)
                                }
                              >
                                <option value="home">Home</option>
                                <option value="cell">Cell</option>
                                <option value="work">Work</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </Form.Group>
                  <Button
                    type="button"
                    variant="danger"
                    className="mt-3"
                    onClick={() => removeMemberFields(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addMemberFields} className="my-3">
                Add Member to Unit
              </Button>
            </Form.Group>

            <Form.Group controlId="addresses">
              <Form.Label>
                <h3>Addresses</h3>
              </Form.Label>
              {addresses.map((address, index) => (
                <div key={index}>
                  <Form.Group controlId={`addressType-${index}`}>
                    <Form.Label>Address Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="addressType"
                      value={address.addressType}
                      onChange={(e) => handleAddressChange(index, e)}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="street">
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter street"
                      name="street"
                      value={address.street}
                      onChange={(e) => handleAddressChange(index, e)}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter city"
                      name="city"
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, e)}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="state">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter state"
                      name="state"
                      value={address.state}
                      onChange={(e) => handleAddressChange(index, e)}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="zip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter zip"
                      name="zip"
                      value={address.zip}
                      onChange={(e) => handleAddressChange(index, e)}
                    ></Form.Control>
                  </Form.Group>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => removeAddressFields(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addAddressFields} className="mb-3">
                Add More Addresses
              </Button>
            </Form.Group>
            <br />
            <Row className="justify-content-center">
              <Col md={6}>
                <h5>
                  <strong>Current Image</strong>
                </h5>
                <Image src={`/${originalImage}`} fluid />
              </Col>
            </Row>
            <br />
            <Row className="justify-content-center">
              <Col md={6}>
                <Form.Group controlId="new-image">
                  <Form.Label>
                    <h5>
                      <strong>New Image</strong>
                    </h5>{" "}
                    <h6>(optional)</h6>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    label="new image"
                    onChange={imageHandler}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="removeImage">
                  <Form.Check
                    type="checkbox"
                    label="Remove Image"
                    checked={removeImage}
                    onChange={handleRemoveImageChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row className="justify-content-center">
              <Col md={6}>
                <Form.Group controlId="memberSince">
                  <Form.Label>
                    <h5>
                      <strong>Member Since</strong>
                    </h5>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter member since"
                    value={memberSince}
                    onChange={(e) => setMemberSince(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row className="justify-content-center">
              <Col md={8} className="text-center">
                <Form.Group controlId="bio">
                  <Form.Label>
                    <h3>Bio</h3>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter short biography (optional)"
                    value={bio}
                    rows={8}
                    onChange={(e) => setBio(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <br />
            {loadingUpload && <Loader />}
            <div className="text-center">
              <Button type="submit" variant="primary">
                Update Unit
              </Button>
            </div>
          </Form>
        </CreateContainer>
      </Container>
    </div>
  );
};
export default MemberEditScreen;
