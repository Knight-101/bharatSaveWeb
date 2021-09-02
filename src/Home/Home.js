import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import Head from "./Head";
import Footer from "../Footer/Footer";

export default function Home() {
  const [goldPriceData, setgoldPriceData] = useState({
    totalPrice: "",
    tax: "",
    blockId: "",
    buyPrice: "",
  });
  const [userBalance, setuserBalance] = useState({
    totalAmount: "",
    goldBalance: "",
  });

  // const [timer, settimer] = useState(0);
  const [amount, setamount] = useState("");
  const [weight, setweight] = useState("");
  const buyData = {
    buyPrice: goldPriceData.buyPrice,
    amount: amount,
    blockId: goldPriceData.blockId,
  };

  const balanceDetails = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/user/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setuserBalance({
          totalAmount: res.data.totalAmount,
          goldBalance: res.data.goldBalance,
        });
      })

      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    balanceDetails();
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/augmont/goldrate`)
      .then((res) => {
        setgoldPriceData({
          totalPrice: res.data.totalBuyPrice,
          tax: res.data.tax,
          blockId: res.data.blockId,
          buyPrice: res.data.goldPrice,
        });
      })

      .catch((err) => {
        console.log(err);
      });
    let interval = setInterval(async () => {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/augmont/goldrate`)
        .then((res) => {
          setgoldPriceData({
            totalPrice: res.data.totalBuyPrice,
            tax: res.data.tax,
            blockId: res.data.K7lkdngq,
            buyPrice: res.data.goldPrice,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const amountChange = (event) => {
    const value = event.target.value;
    setamount(value);
    setweight(((1 / goldPriceData.totalPrice) * value).toFixed(4));
  };

  const weightChange = (event) => {
    const value = event.target.value;
    setweight(value);
    setamount((goldPriceData.totalPrice * value).toFixed(2));
  };

  const buyFunc = async () => {
    const token = localStorage.getItem("token");
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/augmont/buy`, buyData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.OK) {
          alert("Buy successful");
          balanceDetails();
        } else {
          alert("Buy unsuccessful, try again.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Head />
      <div className="mid">
        <div>
          <h3 id="goldprice">₹{goldPriceData.totalPrice}/g</h3>
          <p style={{ margin: "0" }}>
            <b>(incl. tax)</b>
          </p>
        </div>
        <div>
          <h3>
            <u>Your Balance</u>
          </h3>
          <div className="balance">
            <p>
              Amount - <b>₹{userBalance.totalAmount}</b>
            </p>

            <p>
              Weight - <b>{userBalance.goldBalance} g</b>
            </p>
          </div>
        </div>
        <div className="buy">
          <div>
            <label>
              <b>Amount(₹)</b>
            </label>
            <input
              value={amount}
              id="amount"
              placeholder="amount"
              onChange={amountChange}
            />
          </div>
          <p>OR</p>
          <div>
            <label>
              <b>Weight(g)</b>
            </label>
            <input
              value={weight}
              id="weight"
              placeholder="weight"
              onChange={weightChange}
            />
          </div>

          <div>
            <button className="buyBtn" onClick={buyFunc}>
              <b>Buy</b>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
