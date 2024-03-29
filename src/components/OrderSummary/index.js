import React, { useState } from "react"
import Autocomplete from "react-google-autocomplete"
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faRemove,
  faAngleDoubleUp,
  faAngleDoubleDown,
  faCheck,
  faPencil
} from "@fortawesome/free-solid-svg-icons"
import {
  Container,
  Card,
  Collapse,
  Button,
  Row,
  Form,
  Col,
  InputGroup,
} from "react-bootstrap"
import { Link } from "react-router-dom"

function OrderSummary({userOptions, returnShippingSet, filterHandler, removeHandler, itemsBasket}) {

  const [showShipping, setShowShipping] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false)

  function subtotal() {
    let sumItem = itemsBasket.reduce(function (prev, current) {
      return prev + +current.price
    }, 0)

    return sumItem
  }

  function total() {

    let shipping = 0.0

    if (userOptions.Shipping.Date) {
      shipping = returnShippingSet().price
    }

    return +(subtotal() + shipping).toFixed(12);
  }

  const basketReady = subtotal() > 0;

  const shippingAddressReady = Object.values(userOptions.ShippingAddress).every(
    (value) => Boolean(value)
  )

  const InvoiceAddressReady = Object.values(userOptions.InvoiceAddress).every(
    (value) => Boolean(value)
  )

  const shippingReady = Object.values(userOptions.Shipping).every((value) =>
    Boolean(value)
  )

  return (
    <div className="sticky-up-down d-none d-lg-flex">
      <Container className="shadow mt-sm-2 my-lg-3 rounded p-3">
        <Row>
          <Col>
            <Card bg="primary" text="dark" className="d-flex">
              <Card.Header className="font-size-15">Order Summary</Card.Header>
              <Card.Body>
                {itemsBasket.length ? (
                  itemsBasket.map((product, index) => {
                    return (
                      <Row key={index} className="mt-2 mt-lg-1 g-0">
                        <Col lg={8} className="font-size-14 text-mute">
                          <strong>{product.name}</strong>
                          <span className="d-block mt-n1 font-size-12">
                            {product.description}
                          </span>
                        </Col>
                        <Col lg={1} className="align-self-center">
                          <FontAwesomeIcon
                            icon={faRemove}
                            onClick={() => removeHandler(product.id)}
                            className="d-inline font-size-14 text-danger cursor-pointer"
                          />
                        </Col>
                        <Col
                          lg={3}
                          className="font-size-14 text-end fw-bold align-self-center"
                        >
                          € {product.price}
                        </Col>
                      </Row>
                    )
                  })
                ) : (
                  <span className="font-size-12 text-muted">
                    No products added to basket
                  </span>
                )}
                <hr />
                <Row className="mt-2 mt-lg-1 g-0">
                  <Col lg={4} className="font-size-14 text-primary">
                    Delivery Option:
                  </Col>
                  <Col lg={5} className="font-size-14">
                    {userOptions.Shipping.Date
                      ? `${returnShippingSet().name} (${
                          returnShippingSet().type
                        })`
                      : "---"}
                  </Col>
                  <Col
                    lg={3}
                    className="font-size-14 text-end text-danger fw-bold"
                  >
                    {userOptions.Shipping.Date
                      ? `€ ${returnShippingSet().price}`
                      : "---"}
                  </Col>
                </Row>
                <Row className="mt-2 mt-lg-1 g-0">
                  <Col lg={4} className="font-size-14 text-primary">
                    Delivery Date:
                  </Col>
                  <Col lg={8} className="font-size-14">
                    {userOptions.Shipping.Date
                      ? moment(userOptions.Shipping.Date).format("DD/MM/YYYY")
                      : "---"}
                  </Col>
                </Row>
                <hr />
                <Row className="mt-2 p-1 mt-lg-1 g-0 bg-light">
                  <Col lg={7} className="font-size-16 text-primary fw-bold">
                    Total:
                  </Col>
                  <Col
                    lg={5}
                    className="font-size-16 text-end text-danger fw-bold"
                  >
                    {total() > 0 ? `€ ${total()}` : `---`}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="my-2">
          <Col>
            <Form.Check
              className="font-size-14 mt-2 text-muted text-nowrap"
              defaultValue={userOptions.Order.Card}
              checked={userOptions.Order.Card}
              inline
              type="switch"
              aria-controls="message-wrapper"
              aria-expanded={userOptions.Order.Card}
              id="include-card"
              label={
                <div className="w-100">
                  Add <span className="text-primary">Message Card</span>?
                </div>
              }
              onChange={(e) => filterHandler("Order", "Card", e.target.checked)}
            />
          </Col>
          <Col className="align-self-center text-end">
            <FontAwesomeIcon
              icon={faPencil}
              className="d-inline font-size-12 text-danger me-3"
            />
          </Col>
        </Row>
        <Collapse in={userOptions.Order.Card}>
          <Row className="mb-3">
            <Col>
              <Card bg="primary" text="dark" className="d-flex">
                <Card.Body id="message-wrapper" className="pb-0">
                  <Row className="g-0">
                    <Col
                      lg={4}
                      className="font-size-14 text-primary align-self-center"
                    >
                      Message:
                    </Col>
                    <Col lg={8} className="font-size-14">
                      <Form.Group>
                        <Form.Group controlId="message">
                          <Form.Control
                            as="textarea"
                            rows={2}
                            type="text"
                            placeholder="Message"
                            value={userOptions.Order.Message}
                            className="form-control-sm w-100"
                            onChange={(e) =>
                              filterHandler("Order", "Message", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="g-0 mt-2">
                    <Col
                      lg={4}
                      className="font-size-14 text-primary align-self-center"
                    >
                      Sender:
                    </Col>
                    <Col lg={8} className="font-size-14">
                      <Form.Group controlId="sender">
                        <Form.Control
                          type="text"
                          placeholder={
                            userOptions.Order.Anonymously
                              ? "No sender"
                              : "Sender"
                          }
                          disabled={userOptions.Order.Anonymously}
                          value={userOptions.Order.Sender}
                          className="form-control-sm w-100"
                          onChange={(e) =>
                            filterHandler("Order", "Sender", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="g-0">
                    <Col
                      lg={4}
                      className="font-size-14 text-primary align-self-center"
                    ></Col>
                    <Col lg={8} className="font-size-14">
                      <Form.Check
                        className="font-size-12 text-secondary mt-2"
                        defaultValue={userOptions.Order.Anonymously}
                        checked={userOptions.Order.Anonymously}
                        type="switch"
                        aria-controls="message-wrapper"
                        aria-expanded={userOptions.Order.Anonymously}
                        id="send-anonymously"
                        label="Anonymously?"
                        onChange={(e) =>
                          filterHandler(
                            "Order",
                            "Anonymously",
                            e.target.checked
                          )
                        }
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Collapse>
        <Row>
          <Col>
            <Card bg="primary" text="dark" className="d-flex">
              <Card.Header
                className="font-size-15 cursor-pointer"
                onClick={() => setShowShipping(!showShipping)}
              >
                <Row>
                  <Col>Shipping Details</Col>
                  <Col className="text-end">
                    <FontAwesomeIcon
                      icon={showShipping ? faAngleDoubleUp : faAngleDoubleDown}
                      className="d-inline font-size-15 text-danger"
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Collapse in={showShipping}>
                <Card.Body>
                  <Row className="g-0">
                    <Col
                      lg={4}
                      className="font-size-14 text-primary align-self-center"
                    >
                      First / Last Name:
                    </Col>
                    <Col lg={8}>
                      <Row className="g-0">
                        <Col className="pe-2">
                          <Form.Group controlId="name">
                            <Form.Control
                              type="text"
                              placeholder="First Name"
                              value={userOptions.ShippingAddress.FirstName}
                              className="form-control-sm"
                              onChange={(e) =>
                                filterHandler(
                                  "ShippingAddress",
                                  "FirstName",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="name">
                            <Form.Control
                              type="text"
                              placeholder="Last Name"
                              value={userOptions.ShippingAddress.LastName}
                              className="form-control-sm"
                              onChange={(e) =>
                                filterHandler(
                                  "ShippingAddress",
                                  "LastName",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="g-0 mt-2">
                    <Col lg={4} className="font-size-14 text-primary">
                      Delivery Address:
                    </Col>
                    <Col lg={8} className="font-size-14">
                      {userOptions.ShippingAddress.Address ? (
                        userOptions.ShippingAddress.Address
                      ) : (
                        <span className="font-size-12 tip">
                          use the{" "}
                          <i className="text-muted">
                            [Delivery Address:
                            <span className="text-danger">*</span>]
                          </i>{" "}
                          to add
                        </span>
                      )}
                    </Col>
                  </Row>
                  <Row className="g-0 mt-2">
                    <Col
                      lg={4}
                      className="font-size-14 text-primary align-self-center"
                    >
                      Email:
                    </Col>
                    <Col lg={8}>
                      <Form.Group controlId="name">
                        <Form.Control
                          type="email"
                          placeholder="Email Address"
                          value={userOptions.ShippingAddress.Email}
                          className="form-control-sm"
                          onChange={(e) =>
                            filterHandler(
                              "ShippingAddress",
                              "Email",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="g-0 mt-2">
                    <Col
                      lg={4}
                      className="font-size-14 text-primary align-self-center"
                    >
                      Phone:
                    </Col>
                    <Col lg={8}>
                      <Form.Group controlId="phone">
                        <Form.Control
                          type="phone"
                          placeholder="Phone"
                          value={userOptions.ShippingAddress.Phone}
                          className="form-control-sm"
                          onChange={(e) =>
                            filterHandler(
                              "ShippingAddress",
                              "Phone",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Collapse>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Card bg="primary" text="dark" className="d-flex">
              <Card.Header
                className="font-size-15 cursor-pointer"
                onClick={() => setShowInvoice(!showInvoice)}
              >
                <Row>
                  <Col>Invoice Details</Col>
                  <Col className="text-end">
                    <FontAwesomeIcon
                      icon={showInvoice ? faAngleDoubleUp : faAngleDoubleDown}
                      className="d-inline font-size-15 text-danger"
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Collapse in={showInvoice}>
                <Card.Body>
                  <Row className="g-0">
                    <Col
                      lg={4}
                      className="font-size-14 text-primary align-self-center"
                    >
                      First / Last Name:
                    </Col>
                    <Col lg={8}>
                      <Row className="g-0">
                        <Col className="pe-2">
                          <Form.Group controlId="name">
                            <Form.Control
                              type="text"
                              placeholder="First Name"
                              value={userOptions.InvoiceAddress.FirstName}
                              className="form-control-sm"
                              onChange={(e) =>
                                filterHandler(
                                  "InvoiceAddress",
                                  "FirstName",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="name">
                            <Form.Control
                              type="text"
                              placeholder="Last Name"
                              value={userOptions.InvoiceAddress.LastName}
                              className="form-control-sm"
                              onChange={(e) =>
                                filterHandler(
                                  "InvoiceAddress",
                                  "LastName",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="g-0 mt-2">
                    <Col
                      lg={4}
                      className="font-size-14 text-primary align-self-center"
                    >
                      Invoice Address:
                    </Col>
                    <Col lg={8} className="font-size-14">
                      <Form.Group>
                        <InputGroup hasValidation>
                          <Autocomplete
                            apiKey="AIzaSyAkKn1ZaV0TKZ-DEnTwS_IEhMszuwPhY5A"
                            maxLength={64}
                            required={true}
                            options={{
                              types: ["address"],
                              componentRestrictions: { country: "de" },
                            }}
                            className="form-control form-control-sm"
                            onPlaceSelected={(place) => {
                              filterHandler(
                                "InvoiceAddress",
                                "Address",
                                place.formatted_address
                              )
                            }}
                            onChange={(e) =>
                              filterHandler(
                                "InvoiceAddress",
                                "Address",
                                e.target.value
                              )
                            }
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="g-0 mt-2">
                    <Col
                      lg={4}
                      className="font-size-14 text-primary align-self-center"
                    >
                      Email:
                    </Col>
                    <Col lg={8}>
                      <Form.Group controlId="name">
                        <Form.Control
                          type="email"
                          placeholder="Email Address"
                          value={userOptions.InvoiceAddress.Email}
                          className="form-control-sm"
                          onChange={(e) =>
                            filterHandler(
                              "InvoiceAddress",
                              "Email",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="g-0 mt-2">
                    <Col
                      lg={4}
                      className="font-size-14 text-primary align-self-center"
                    >
                      Phone:
                    </Col>
                    <Col lg={8}>
                      <Form.Group controlId="phone">
                        <Form.Control
                          type="phone"
                          placeholder="Phone"
                          value={userOptions.InvoiceAddress.Phone}
                          className="form-control-sm"
                          onChange={(e) =>
                            filterHandler(
                              "InvoiceAddress",
                              "Phone",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Collapse>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3 font-size-11">
          <Col className="tip text-center">
            Basket
            <FontAwesomeIcon
              icon={basketReady ? faCheck : faRemove}
              className={
                basketReady
                  ? "d-inline font-size-10 cursor-pointer ms-1 text-primary"
                  : "d-inline font-size-10 cursor-pointer ms-1 text-danger"
              }
            />
          </Col>
          <Col className="tip text-center">
            Delivery
            <FontAwesomeIcon
              icon={shippingReady ? faCheck : faRemove}
              className={
                shippingReady
                  ? "d-inline font-size-10 cursor-pointer ms-1 text-primary"
                  : "d-inline font-size-10 cursor-pointer ms-1 text-danger"
              }
            />
          </Col>
          <Col className="tip text-center">
            Shipping
            <FontAwesomeIcon
              icon={shippingAddressReady ? faCheck : faRemove}
              className={
                shippingAddressReady
                  ? "d-inline font-size-10 cursor-pointer ms-1 text-primary"
                  : "d-inline font-size-10 cursor-pointer ms-1 text-danger"
              }
            />
          </Col>
          <Col className="tip text-center">
            Invoice
            <FontAwesomeIcon
              icon={InvoiceAddressReady ? faCheck : faRemove}
              className={
                InvoiceAddressReady
                  ? "d-inline font-size-10 cursor-pointer ms-1 text-primary"
                  : "d-inline font-size-10 cursor-pointer ms-1 text-danger"
              }
            />
          </Col>
        </Row>
        <Row className="">
          <Col>
            <Button
              variant="primary"
              disabled={
                !(
                  basketReady &&
                  shippingAddressReady &&
                  InvoiceAddressReady &&
                  shippingReady
                )
              }
              className="d-block ms-auto w-100 mt-2"
            >
              Buy Now
            </Button>
            <label className="font-size-10 mt-2">
              By clicking <strong>"Buy Now"</strong> you agree to our terms of
              service and that you have read our{" "}
              <Link to="/privacy-policy" className="text-primary">
                privacy policy
              </Link>
              .
            </label>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default OrderSummary
