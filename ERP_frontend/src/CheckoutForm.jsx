import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Variables } from "./Variables";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    var cart = [];
    var TotalPrice = 0;
    var Price = 0;
    var Order = "";

    fetch(`${Variables.API_URL}stavke`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          console.log(data);
          cart = data;
          cart.forEach((element) => {
            Price += element.cartPrice;
            console.log(Price);
          });
          TotalPrice = Price;
          console.log(TotalPrice);

          return fetch(variables.API_URL + "racuni", {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              IDKupac: localStorage.getItem("ID"),
              UkupnaCena: TotalPrice,
              Datum: new Date().toISOString(),
            }),
          });
        } else {
          throw new Error("Cart is empty.");
        }
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data != null) {
          Order = data.idOrder;

          const orderItemPromises = cart.map((item) =>
            fetch(variables.API_URL + "sracuna", {
              method: "POST",
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                IDRacun: Order,
                IDProizvod: item.idProduct,
                Kolicina: item.cartAmount,
                Cena: item.cartPrice,
              }),
            })
              .then((res) => {
                if (!res.ok) {
                  throw new Error("Failed to create order item.");
                }
                return res.json();
              })
              .then((data) => {
                if (data != null) {
                  return fetch(variables.API_URL + "sracun/" + item.idProduct, {
                    method: "DELETE",
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  });
                } else {
                  throw new Error("Failed to create order item.");
                }
              })
          );

          return Promise.all(orderItemPromises);
        } else {
          throw new Error("Failed to create order.");
        }
      })
      .then((orderItemResponses) => {
        console.log(orderItemResponses); // Array of response data for each order item

        // Handle successful creation of order items
        alert("All order items created successfully");
        this.refreshList();
      })

      .finally(() => {
        setIsLoading(false);
      });

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:5173/",
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.target.value)}
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        style={{ width: "100%", backgroundColor: 'blue'}}
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
