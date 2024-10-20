import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";

function ProfileAdmin() {
  const [formData, setFormData] = useState({
    name: "", 
    password: "",
    cpassword: "",
  });

  const [passwordValidity, setPasswordValidity] = useState({
    length: false,
    capital: false,
    simple: false,
    number: false,
  });

  const [errors, setErrors] = useState({
    name: "", 
    password: "",
    cpassword: "",
  });

  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [passwordObscure, setPasswordObscure] = useState(true);
  const [confirmPasswordObscure, setConfirmPasswordObscure] = useState(true);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    if (id === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    setPasswordValidity({
      length: password.length >= 8,
      capital: /[A-Z]/.test(password),
      simple: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    });
  };

  const validate = () => {
    let tempErrors = { name: "", password: "", cpassword: "" };
    let isValid = true;

    if (!formData.name) {
      tempErrors.name = "Name is required"; 
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else {
      if (!passwordValidity.length) {
        tempErrors.password = "Password must be at least 8 characters";
        isValid = false;
      }
      if (!passwordValidity.capital) {
        tempErrors.password = "Password must contain at least 1 capital letter";
        isValid = false;
      }
      if (!passwordValidity.simple) {
        tempErrors.password =
          "Password must contain at least 1 lowercase letter";
        isValid = false;
      }
      if (!passwordValidity.number) {
        tempErrors.password = "Password must contain at least 1 number";
        isValid = false;
      }
    }
    if (formData.password !== formData.cpassword) {
      tempErrors.cpassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch("/api/updateProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "USER_ID_HERE", // Replace with actual user ID
            name: formData.name,
            password: formData.password,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setMessage(data.message);
          setAlertType("alert alert-success");
        } else {
          setMessage(data.message);
          setAlertType("alert alert-danger");
        }
        setShowAlert(true);
      } catch (error) {
        setMessage("An error occurred. Please try again.");
        setAlertType("alert alert-danger");
        setShowAlert(true);
      }
    } else {
      setMessage("Please correct the errors and try again.");
      setAlertType("alert alert-danger");
      setShowAlert(true);
    }
  };

  const handleObscurePassword = () => {
    setPasswordObscure(!passwordObscure);
  };

  const handleObscureConfirmPassword = () => {
    setConfirmPasswordObscure(!confirmPasswordObscure);
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <SidebarAdmin />
        <div className="col py-3 content-area">
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset>
              <legend className="caption">Profile</legend>

              <div className="">
                <div className="form-group">
                  <label className="">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="text-box"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="text-danger mt-2">{errors.name}</div>
                  )}
                </div>
              </div>

              <div className="">
                <div className="form-group">
                  <label className="">Password</label>
                  
                    <input
                      type={passwordObscure ? "password" : "text"}
                      id="password"
                      className="text-box"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      className="input-group-text cursor-pointer"
                      type="button"
                      id="obscure"
                      onClick={handleObscurePassword}
                    >
                      <FontAwesomeIcon
                        icon={passwordObscure ? faEye : faEyeSlash}
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <div className="text-danger mt-2">{errors.password}</div>
                  )}
                  <div className="mt-2">
                    <ul>
                      <li
                        className={
                          passwordValidity.length
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        Password must be at least 8 characters
                      </li>
                      <li
                        className={
                          passwordValidity.capital
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        Password must contain at least 1 capital letter
                      </li>
                      <li
                        className={
                          passwordValidity.simple
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        Password must contain at least 1 lowercase letter
                      </li>
                      <li
                        className={
                          passwordValidity.number
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        Password must contain at least 1 number
                      </li>
                    </ul>
                  </div>
                </div>

              <div className="">
                <div className="form-group">
                  <label className="">Confirm Password</label>
                  
                    <input
                      type={confirmPasswordObscure ? "password" : "text"}
                      id="cpassword"
                      className="text-box"
                      placeholder="Confirm Password"
                      value={formData.cpassword}
                      onChange={handleChange}
                    />
                    <button
                      className="input-group-text cursor-pointer"
                      type="button"
                      id="obscure"
                      onClick={handleObscureConfirmPassword}
                    >
                      <FontAwesomeIcon
                        icon={confirmPasswordObscure ? faEye : faEyeSlash}
                      />
                    </button>
                  </div>
                  {errors.cpassword && (
                    <div className="text-danger mt-2">{errors.cpassword}</div>
                  )}
                </div>

              {showAlert && (
                <div className={alertType + " mt-3"} role="alert">
                  {message}
                </div>
              )}

                <div className="col-md- mt-5">
                  <button className="btnall btnSave" type="submit">
                    Save Changes
                  </button>
                </div>

            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileAdmin;
