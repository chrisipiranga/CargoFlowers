import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import Occasions from "../../db/Occasions"
import Flowers from "../../db/Flowers"
import Genders from "../../db/Genders"
import Colors from "../../db/Colors"
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  ToggleButton,
  InputGroup,
} from "react-bootstrap"
import Autocomplete from "react-google-autocomplete"

function Filter({ Delivery, userOptions, filterHandler }) {
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }

  return (
    <Container className="p-3 bg-light">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mt-2">
          <Col md="4" lg="4">
            <Form.Group>
              <Form.Label className="font-size-14 mb-0 mt-2">
                Delivery Address:
              </Form.Label>
              <sup className="text-danger">*</sup>
              <InputGroup hasValidation>
                <Autocomplete
                  apiKey="AIzaSyAkKn1ZaV0TKZ-DEnTwS_IEhMszuwPhY5A"
                  required={true}
                  maxLength={64}
                  options={{
                    types: ["address"],
                    componentRestrictions: { country: "de" },
                  }}
                  className="form-control font-size-14"
                  onPlaceSelected={(place) => {
                    filterHandler(
                      "ShippingAddress",
                      "Address",
                      place.formatted_address
                    )
                  }}
                  onChange={(e) =>
                    filterHandler("ShippingAddress", "Address", e.target.value)
                  }
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col xs="6" sm="6" md="4" lg="2">
            <Form.Group>
              <Form.Label className="font-size-14 mb-0 mt-2">
                Delivery (Express):
              </Form.Label>
              <ButtonGroup className="w-100">
                {Delivery.filter((shipping) => shipping.name !== "Normal").map(
                  (shipping, index) => {
                    return (
                      <ToggleButton
                        key={shipping.id}
                        id={shipping.name}
                        type="radio"
                        variant="outline-secondary"
                        className="font-size-14 w-100"
                        value={shipping.date}
                        checked={userOptions.Shipping.Date === shipping.date}
                        onChange={(e) =>
                          filterHandler("Shipping", "Date", e.target.value)
                        }
                      >
                        {shipping.name}
                      </ToggleButton>
                    )
                  }
                )}
              </ButtonGroup>
            </Form.Group>
          </Col>
          <Col xs="6" sm="6" md="4" lg="2">
            <Form.Group>
              <Form.Label className="font-size-14 mb-0 mt-2">
                Delivery:
              </Form.Label>
              <sup className="text-danger">*</sup>
              <ButtonGroup className="w-100">
                <InputGroup.Text
                  id="basic-addon1"
                  className="d-lg-none d-xl-block font-size-14"
                >
                  or
                </InputGroup.Text>
                <Form.Control
                  type="date"
                  className="font-size-14 w-100"
                  min={
                    Delivery.filter((shipping) => shipping.name === "Normal")[0]
                      .date
                  }
                  id="datepicker"
                  defaultValue={userOptions.Shipping.Date}
                  required
                  onChange={(e) =>
                    filterHandler("Shipping", "Date", e.target.value)
                  }
                />
              </ButtonGroup>
              <Form.Control.Feedback type="invalid">
                Please inform the delivery date.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs="6" sm="6" md="4" lg="2">
            <Form.Group>
              <Form.Label className="font-size-14 mb-0 mt-2">
                Gender:
              </Form.Label>
              <Form.Select
                defaultValue={userOptions.Filters.Gender}
                className="font-size-14"
                onChange={(e) =>
                  filterHandler("Filters", "Gender", e.target.value)
                }
              >
                <option>All</option>
                {Genders.map((item, index) => {
                  return <option key={index}>{item.name}</option>
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="6" sm="6" md="4" lg="2">
            <Form.Group>
              <Form.Label className="font-size-14 mb-0 mt-2">
                Occasion:
              </Form.Label>
              <Form.Select
                defaultValue={userOptions.Filters.Occasion}
                className="font-size-14"
                onChange={(e) =>
                  filterHandler("Filters", "Occasion", e.target.value)
                }
              >
                <option>All</option>
                {Occasions.map((item, index) => {
                  return <option key={index}>{item.name}</option>
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="6" sm="6" md="4" lg="2">
            <Form.Group>
              <Form.Label className="font-size-14 mb-0 mt-2">
                Favorite Color?
              </Form.Label>
              <Form.Select
                defaultValue={userOptions.Filters.Color}
                className="font-size-14 colorDropDown"
                onChange={(e) =>
                  filterHandler("Filters", "Color", e.target.value)
                }
              >
                <option>All</option>
                {Colors.map((item, index) => {
                  return (
                    <option
                      style={{ color: item.name }}
                      data-color={item.name}
                      key={index}
                    >
                      {item.name}
                    </option>
                  )
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="6" sm="6" md="4" lg="2">
            <Form.Group>
              <Form.Label className="font-size-14 mb-0 mt-2">
                Favorite Flower?
              </Form.Label>
              <Form.Select
                defaultValue={userOptions.Filters.Flower}
                className="font-size-14"
                onChange={(e) =>
                  filterHandler("Filters", "Flower", e.target.value)
                }
              >
                <option>All</option>
                {Flowers.map((item, index) => {
                  return <option key={index}>{item.name}</option>
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="6" sm="6" md="4" lg="2">
            <Form.Group>
              <Form.Label className="font-size-14 mb-0 mt-2">
                Age:{" "}
                {userOptions.Filters.Age > 0 ? userOptions.Filters.Age : "All"}
              </Form.Label>
              <Form.Range
                className="font-size-14 mt-2"
                onChange={(e) =>
                  filterHandler("Filters", "Age", e.target.value)
                }
                value={userOptions.Filters.Age}
              />
            </Form.Group>
          </Col>
          <Col xs="6" sm="6" md="4" lg="3" xxl="2">
            <Form.Group>
              <Form.Label className="font-size-14 mb-0 mt-2">
                Product Set
              </Form.Label>
              <Form.Check
                className="font-size-14 mt-2"
                defaultValue={userOptions.Filters.Set}
                checked={userOptions.Filters.Set}
                type="switch"
                id="include-set"
                onChange={(e) =>
                  filterHandler("Filters", "Set", e.target.checked)
                }
                label="Include Set Options?"
              />
            </Form.Group>
          </Col>
          <Col
            xs={12}
            md={{ span: 4, offset: 8 }}
            lg={{ span: 3, offset: 0 }}
            xxl={4}
            className="align-self-end"
          >
            <Button
              variant="primary"
              onClick={(e) => handleSubmit(e)}
              className="d-block ms-auto w-100 mt-2 font-size-14"
            >
              Filter Products
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}
export default Filter;
