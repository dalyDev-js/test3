import React from "react";

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProduct.scss";
import { BiArrowBack } from "react-icons/bi";
import { AiFillEdit } from "react-icons/ai";

function EditProducts() {
  //states
  const selectedOptions = [
    { value: "DVD-Disk", label: "DVD", inputLabel: "Size (MB)", id: "DVD" },
    {
      value: "Furniture",
      label: "Furniture",
      inputLabel: "Dimensions (HxWxL)",
      id: "Furniture",
    },
    { value: "Book", label: "Book", inputLabel: "Weight (KG)", id: "Book" },
  ];
  const [inputs, setInputs] = useState({
    SKU: "",
    name: "",
    price: "",
    attribute: "",
    value: "",
  });
  const [selectedOption, setSelectedOption] = useState("");
  const [attributeInput, setAttributeInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { SKU } = useParams();

  //get users once
  useEffect(() => {
    getUsers();
  }, []);
  function getUsers() {
    axios
      .get(`https://productsstestss.000webhostapp.com/api/products/${SKU}`)
      .then(function (response) {
        console.log(response.data);
        setInputs(response.data);
        setAttributeInput(response.data.attribute);
        setSelectedOption(response.data.attribute);
        if (response.data.attribute === "Furniture") {
          const dimensions = response.data.value.split("x");
          if (dimensions.length === 3) {
            setInputs((values) => ({
              ...values,
              height: dimensions[0],
              width: dimensions[1],
              length: dimensions[2],
            }));
          }
        } else if (response.data.attribute === "DVD-Disk") {
          setInputs((values) => ({
            ...values,
            size: response.data.value,
          }));
        } else if (response.data.attribute === "Book") {
          setInputs((values) => ({
            ...values,
            weight: response.data.value,
          }));
        }
      });
  }

  //change handler
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    if (selectedOption === "Furniture") {
      const dimensions = ["height", "width", "length"];
      const updatedValues = dimensions.reduce((acc, dimension) => {
        if (name === dimension) {
          return { ...acc, [dimension]: value };
        }
        return { ...acc, [dimension]: inputs[dimension] };
      }, {});

      const dimensionValues = dimensions.map(
        (dimension) => updatedValues[dimension]
      );
      const formattedValue = dimensionValues.join("x");

      setInputs((values) => ({ ...values, value: formattedValue }));
    } else if (selectedOption === "DVD-Disk" || selectedOption === "Book") {
      setInputs((values) => ({ ...values, value: value }));
    }
  };
  const handleOptionChange = (event) => {
    const name = event.target.name;
    const option = event.target.value;
    setSelectedOption(option);
    setInputs((values) => ({ ...values, [name]: option }));
  };
  // handle submit
  const Navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .put(
        `https://productsstestss.000webhostapp.com/api/product/${SKU}/edit`,
        inputs
      )
      .then(function (response) {
        console.log(response.data);

        // clear inputs if success
        if (
          JSON.stringify(response.data) ===
          JSON.stringify({ status: 1, message: "Data updated." })
        ) {
          setInputs({
            SKU: "",
            name: "",
            price: "",
            attribute: "",
            value: "",
            height: "",
            width: "",
            length: "",
            weight: "",
            size: "",
          });
          Navigate("/");
        }
      });
  };

  return (
    <>
      <header className="editheader">
        <div className="logo">
          <img
            src="../product-manager-app-high-resolution-logo-black-on-transparent-background.png"
            alt="logo"
          />
        </div>
        <h1 className="void">|</h1>
        <h1>
          {" "}
          <AiFillEdit />
          Edit Product : {inputs.SKU}
        </h1>
      </header>
      <div className="editcontainer">
        <div className="card">
          <form id="product_form" onSubmit={handleSubmit} className="form">
            <div className="lables">
              <label>SKU </label>
              <input
                id="sku"
                type="text"
                name="SKU"
                placeholder=""
                value={inputs.SKU}
                onChange={handleChange}
                required
              />
              {errorMessage && (
                <span className="error-message">{errorMessage}</span>
              )}
            </div>

            <div className="lables">
              <label>Name </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder=""
                value={inputs.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="lables">
              <label>Price ($)</label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder=""
                value={inputs.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="lables">
              <label>Type switcher</label>
              <select
                id="productType"
                name="attribute"
                value={inputs.attribute}
                onChange={handleOptionChange}
                required
              >
                <option hidden></option>
                {selectedOptions.map((option) => (
                  <option
                    name="attribute"
                    id={option.id}
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedOption === "Furniture" && (
              <>
                <div className="lables">
                  <label>Height (cm)</label>
                  <input
                    required
                    id="height"
                    type="number"
                    name="height"
                    value={inputs.height}
                    placeholder=""
                    onChange={handleChange}
                  />
                </div>
                <div className="lables">
                  <label>Width (cm)</label>
                  <input
                    id="width"
                    required
                    type="number"
                    name="width"
                    value={inputs.width}
                    placeholder=""
                    onChange={handleChange}
                  />
                </div>
                <div className="lables">
                  <label>Length (cm)</label>
                  <input
                    id="length"
                    required
                    type="number"
                    name="length"
                    value={inputs.length}
                    placeholder=""
                    onChange={handleChange}
                  />
                </div>
                <span>Please provide dimensions in HxWxL format</span>
              </>
            )}
            {selectedOption === "Book" && (
              <>
                <div className="lables">
                  <label>Weight (KG)</label>
                  <input
                    required
                    id="weight"
                    type="number"
                    name="weight"
                    value={inputs.weight}
                    placeholder=""
                    onChange={handleChange}
                  />
                </div>
                <span>Please provide weight in KG</span>
              </>
            )}
            {selectedOption === "DVD-Disk" && (
              <>
                <div className="lables">
                  <label>Size (MB)</label>
                  <input
                    required
                    id="size"
                    type="number"
                    name="size"
                    value={inputs.size}
                    placeholder=""
                    onChange={handleChange}
                  />
                </div>
                <span>Please provide Size in Mb</span>
              </>
            )}

            <div className="buttonsA">
              <input
                className="submit-btn"
                type="submit"
                name="submit"
                value="Update"
              />

              <Link className="submit-btn" to="/">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProducts;
