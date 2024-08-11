import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { checkPaymentStatus } from '../../../Controller';

const Thankyou = () => {

  const [productOrdered, setProductOrdered] = useState([]);
  const [adminMessage, setAdminMessage] = useState({});
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // New state to track payment success

  //=======================================//
  //==========ALERT PAYMENT STATUS========//
  //=====================================//
  
  const alertPaymentStatus = async () => {
    try {
      const status = await checkPaymentStatus();
      console.log(status);

      if (status === 'paid') {
        toast.success('Payment confirmed');
        setIsPaymentSuccessful(true); // Set payment as successful
      } else {
        toast.error('Your payment is not correct');
        setIsPaymentSuccessful(false); // Set payment as unsuccessful
      }
    } catch (error) {
      toast.error('Error checking payment status');
      console.error('Error:', error);
      setIsPaymentSuccessful(false); // Set payment as unsuccessful in case of error
    }
  };

  //==================================================//
  //==================CALL ALERT FUNCTION=============//
  //==================================================//

  useEffect(() => {
    alertPaymentStatus();
  }, []);
  

  //================================================//
  //=======INITIALIZE SHIPPING DETAILS OBJECT=======//
  //================================================//
  let shippingDetails = {};

  try {
    shippingDetails = JSON.parse(localStorage.getItem('shippingDetails') || '{}');
  } catch (error) {
    console.error('Error parsing shippingDetails:', error);
  }

  const { email, firstName, lastName, phone, country, province, streetAddress, zipCode, town, companyName, additionalInfo } = shippingDetails;

  useEffect(() => {
    try {
      const orderedProduct = JSON.parse(localStorage.getItem('cartItems') || '[]');
      if (orderedProduct.length > 0) {
        setProductOrdered(
          orderedProduct.map(product => ({
            title: product.title,
            Price: product.price,
            color: product.color,
            quantity: product.quantity,
            Tags: product.Tags,
            Category: product.Category,
          }))
        );
      }
    } catch (error) {
      console.error('Error parsing cartItems:', error);
    }
  }, []);

  useEffect(() => {
    const generateCombinedOrderSummary = product => {
      return (
        product
          .map(product => {
            const { title, quantity, color, Category, Price } = product;
            return `${quantity} ${color} ${title}(s) in the category of ${Category} at $${Price}`;
          })
          .join(', and ') + '.'
      );
    };

    const newMessage = generateCombinedOrderSummary(productOrdered);

    setAdminMessage({
      email,
      firstName,
      lastName,
      phone,
      country,
      province,
      streetAddress,
      zipCode,
      town,
      companyName,
      additionalInfo,
      summary: newMessage,
    });
  }, [productOrdered, email, firstName, lastName, phone, country, province, streetAddress, zipCode, town, companyName, additionalInfo]);

  useEffect(() => {
    emailjs.init('cYTlawvh2LD7a6cv5');
  }, []);

  const sendAdminMail = () => {
    console.log('Sending admin mail with message:', adminMessage);
    emailjs.send('service_336ikkh', 'template_gx3pbes', adminMessage).then(
      response => {
        // console.log("Thanks, we'll respond very soon");
      },
      error => {
        // console.error('EmailJS error:', error);
      }
    );
  };

  const sendUserMail = () => {
    console.log('Sending user mail with message:', adminMessage);
    emailjs.send('service_336ikkh', 'template_w7kg68m', adminMessage).then(
      response => {
        toast.success("Thanks for your order, Check your mail for more details");
      },
      error => {
        // toast.error('FAILED... An error occurred!');
        // console.error('EmailJS error:', error);
      }
    );
  };

  const sendBothMails = () => {
    sendUserMail();
    sendAdminMail();
  };

  useEffect(() => {
    if (adminMessage.summary && isPaymentSuccessful) { // Only send emails if payment is successful
      sendBothMails();
    }
  }, [adminMessage, isPaymentSuccessful]); // Dependency array includes payment success


  return (
    <section className='h-lvh w-full bg-[#fff] flex items-center justify-center'>
      <div className='w-1/2 h-[70%] bg-[#f5f5f5] shadow-2xl rounded-lg flex flex-col items-center justify-center gap-5'>
        <span className='py-1 w-[200px] bg-[#2DCE71] rounded-full'></span>
        <aside className='py-10 px-[50px] gap- flex flex-col items-center justify-center'>
          <h1 className='font-extrabold text-5xl text-[#C9C9C9] uppercase'>Thank you</h1>
          <p className='text-2xl font-sans capitalize text-[#C9C9C9] mt-10'>your order</p>
          <p className='text-2xl font-sans capitalize text-[#C9C9C9]'>is being processed</p>
        </aside>
        <Link to='/' className='bg-[#2DCE71] text-white capitalize font-bold h-[50px] px-4 text-center flex items-center justify-center rounded-md'>
          Continue shopping
        </Link>
      </div>
    </section>
  );
};

export default Thankyou;