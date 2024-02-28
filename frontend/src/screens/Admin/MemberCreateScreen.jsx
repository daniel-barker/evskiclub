import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FaPlus, FaMinus } from "react-icons/fa";
import Loader from "../../components/Loader";
import CreateContainer from "../../components/CreateContainer";
import { toast } from "react-toastify";
import {
  useCreateUnitMutation,
  useUploadUnitImageMutation,
} from "../../slices/unitApiSlice";

const MemberCreateScreen = () => {
  const [members, setMembers] = useState([
    {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: [{ number: "", type: "" }],
    },
  ]);
  const [addresses, setAddresses] = useState([
    { addressType: "", street: "", city: "", state: "", zip: "" },
  ]);
  const [memberSince, setMemberSince] = useState("");
  const [image, setImage] = useState("");

  const [createUnit, { isLoading: loadingCreate }] = useCreateUnitMutation();
  const [uploadUnitImage, { isLoading: loadingImage }] =
    useUploadUnitImageMutation();

  const navigate = useNavigate();

  const addMemberFields = () => {
    setMembers([
      ...members,
      {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: [{ number: "", type: "" }],
      },
    ]);
  };

  const handleMemberChange = (index, e) => {
    const updatedMembers = [...members];
    updatedMembers[index][e.target.name] = e.target.value;
    setMembers(updatedMembers);
  };

  const removeMemberFields = (index) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  const addPhoneNumber = (index) => {
    const updatedMembers = [...members];
    updatedMembers[index].phoneNumber.push({ number: "", type: "" });
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
      { addressType: "", street: "", city: "", state: "", zip: "" },
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const uploadResult = await uploadUnitImage(formData).unwrap();
        const newUnit = {
          members,
          addresses,
          memberSince,
          image: uploadResult.image,
        };
        console.log(newUnit);
        const result = await createUnit(newUnit).unwrap();

        if (result) {
          toast.success("Unit created successfully");
          navigate("/admin/unit/list");
        } else {
          throw new Error("Unit creation failed");
        }
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error.message ||
            "An error occurred during unit creation."
        );
      }
    } else {
      try {
        const newUnit = { members, addresses, memberSince };
        const result = await createUnit(newUnit).unwrap();
        if (result) {
          toast.success("Unit created successfully");
          navigate("/admin/unit/list");
        } else {
          throw new Error("Unit creation failed");
        }
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error.message ||
            "An error occurred during unit creation."
        );
      }
    }
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
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
          <h1 className="text-center">Add Membership Unit</h1>
          <hr />
          {loadingCreate && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="members">
              <Form.Label>
                <h3>Add Members</h3>
              </Form.Label>
              {members.map((member, index) => (
                <div key={index}>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
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
                                <option value="">Select Type</option>
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

            <Row>
              <Col>
                <Form.Group controlId="image">
                  <Form.Label>Choose Image (optional)</Form.Label>
                  <Form.Control
                    type="file"
                    id="image-file"
                    label="Choose Image"
                    onChange={imageHandler}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="memberSince">
                  <Form.Label>Member Since</Form.Label>
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
            <div className="text-center">
              <Button type="submit" variant="primary">
                Create Unit
              </Button>
            </div>
          </Form>
        </CreateContainer>
      </Container>
    </div>
  );
};

export default MemberCreateScreen;
