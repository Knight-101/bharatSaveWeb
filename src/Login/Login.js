import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Footer from "../Footer/Footer";
import Head from "../Home/Head";
import "../Signup/Signup.css";
import firebase from "../firebase";
import axios from "axios";

export default function Login() {
  const history = useHistory();
  const [userData, setuserData] = useState({
    mobileNumber: "",
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

  const sendOtpFunc = async () => {
    if (!userData.mobileNumber) {
      setfail("Enter Mobile Number");
    } else {
      var recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha");
      var number = `+91${userData.mobileNumber}`;
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
    }
  };

  const verifyOTP = () => {
    if (otp === null) return;

    window.confirmationResult
      .confirm(otp)
      .then(async function () {
        await axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/augmont/login`, userData)
          .then((res) => {
            if (res.data === "User not found") {
              setotpSent(false);
              setfail("Your number is not registered with us.");
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

        setfail("Invalid OTP");
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
          <p style={{ color: "red" }}>{fail}</p>
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
            <b>Login</b>
          </h1>
          <p style={{ color: "red" }}>{fail}</p>
          {captcha ? (
            <input
              className="authInput"
              id="mobileNumber"
              value={userData.mobileNo}
              placeholder="Mobile Number"
              onChange={handleChange}
              required
              disabled
            />
          ) : (
            <input
              className="authInput"
              id="mobileNumber"
              value={userData.mobileNo}
              placeholder="Mobile Number"
              onChange={handleChange}
              required
            />
          )}

          <div>
            <Link to="/signup">Create account?</Link>
          </div>
          <div id="recaptcha"></div>
          {!captcha && (
            <button className="authBtn" onClick={sendOtpFunc}>
              Send OTP
            </button>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
