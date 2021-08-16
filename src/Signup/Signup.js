import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Footer from "../Footer/Footer";
import Head from "../Home/Head";
import "./Signup.css";
import firebase from "../firebase";
import axios from "axios";

export default function Signup() {
  const history = useHistory();
  const [userData, setuserData] = useState({
    mobileNumber: "",
    userName: "",
    emailId: "",
    userPincode: "",
  });
  const [otpSent, setotpSent] = useState(false);
  const [captcha, setcaptcha] = useState(false);
  const [otp, setotp] = useState();
  const [fail, setfail] = useState("");

  const handleChange = (event) => {
    const { id, value } = event.target;
    setuserData((prevData) => {
      return {
        ...prevData,
        [id]: value,
      };
    });
  };
  const handleChangeOTP = (event) => {
    const { value } = event.target;
    setotp(value);
  };

  const sendOtpFunc = async (e) => {
    e.preventDefault();
    var recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha");
    var number = "+916264524404";
    setcaptcha(true);
    firebase
      .auth()
      .signInWithPhoneNumber(number, recaptcha)
      .then(function (confirmResult) {
        setotpSent(true);
        window.confirmationResult = confirmResult;
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const verifyOTP = () => {
    if (otp === null) return;

    window.confirmationResult
      .confirm(otp)
      .then(async function () {
        await axios
          .post(
            `${process.env.REACT_APP_BACKEND_URL}/augmont/createuser`,
            userData
          )
          .then((res) => {
            if (res.data === "User already exists") {
              setotpSent(false);
              setfail("Your number is already registered");
              setuserData({
                mobileNumber: "",
                userName: "",
                emailId: "",
                userPincode: "",
              });
            } else {
              setfail("");
              localStorage.setItem("token", res.data.token);
              history.push("./home");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch(function (error) {
        console.error(error);
        history.push("/");
      });
  };
  return (
    <div>
      <Head />
      {otpSent ? (
        <div className="authContainer">
          <h1>
            <b>Verify OTP</b>
          </h1>
          <input
            className="authInput"
            id="otp"
            placeholder="OTP"
            onChange={handleChangeOTP}
          />

          <button className="authBtn" onClick={verifyOTP}>
            Verify
          </button>
        </div>
      ) : (
        <div className="authContainer">
          <h1>
            <b>Signup</b>
          </h1>
          <p style={{ color: "red" }}>{fail}</p>
          <form onSubmit={sendOtpFunc}>
            <input
              className="authInput"
              id="mobileNumber"
              value={userData.mobileNumber}
              placeholder="Mobile Number"
              onChange={handleChange}
              required
            />
            <input
              className="authInput"
              id="userName"
              value={userData.userName}
              placeholder="User Name"
              onChange={handleChange}
              required
            />
            <input
              className="authInput"
              id="emailId"
              value={userData.emailId}
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
            <input
              className="authInput"
              id="userPincode"
              value={userData.userPincode}
              placeholder="Pincode"
              onChange={handleChange}
              required
            />
            <div>
              Already registered?
              <Link to="/">Login</Link>
            </div>
            <div id="recaptcha"></div>
            {!captcha && <button className="authBtn">Send OTP</button>}
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}
