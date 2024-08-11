import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import emailjs from '@emailjs/browser';

export default function Grid({ createUserAccount, isLoading, shippingDetails, isEdited }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedTotal = localStorage.getItem("total");
    if (savedTotal) {
      setTotal(parseFloat(savedTotal));
    }
  }, []);

  const endPointUrl = 'https://techthoth-stripe-server.onrender.com/create-checkout-session';
  const secretKey = 'sk_test_2IIZj9qvETFVO3EvJYJHAUQ100SCzRfnk5';

  const requestBodyObject = {
    stripeSecretKey: secretKey,
    productPrice: total * 100,
    productName: 'Lets create products Check out',
    mode: 'payment',
    paymentMethod: 'card',
    successUrl: 'http://localhost:5173/thank-you',
    cancelUrl: 'http://localhost:5173/payment-error',
    quantity: 1,
    currency: 'usd'
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBodyObject)
  };

  const handlePayment = () => {
    let valid = true;
    for (let key in shippingDetails) {
      if (!shippingDetails[key].trim()) {
        valid = false;
        break;
      }
    }

  // Save shipping details to local storage
  localStorage.setItem('shippingDetails', JSON.stringify(shippingDetails));

    if (valid) {
      fetch(endPointUrl, options)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then(json => Promise.reject(json));
        })
        .then(({ url, sessionId }) => {
          localStorage.setItem('sessionId', sessionId);
          window.location = url
        })
        .catch(err => {
          console.error('An Error Occurred:', err.message);
        });
    } else {
      toast.error('Fill All Your Shipping Details First');
    }
  };

  return (
    <section className="flex flex-col bg-white p-5 mt-3">
      <main className="flex flex-row justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-4">Product</h3>
          <p className="text-xs font-semibold mb-4">Subtotal</p>
          <p className="text-xs font-semibold mb-4">Total</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Subtotal</h3>
          <p className="text-xs font-medium mb-4">${total.toFixed(2)}</p>
          <p className="text-xl font-semibold mb-4 text-[#fcd34d]">
            ${total.toFixed(2)}
          </p>
        </div>
      </main>

      <hr className="h-px my-3 bg-gray-200 border-1 dark:bg-gray-400"></hr>
      <main className="flex flex-col gap-3">
        <div className="mt-4 w-full py-6 flex items-center justify-center">
          <button
            type="submit"
            className="w-[150px] h-[55px] rounded-lg bg-[#2EFAE7] font-serif text-lg text-white font-bold shadow-lg capitalize"
            onClick={handlePayment}
          >
            Check Out
          </button>
        </div>
      </main>
    </section>
  );
}
