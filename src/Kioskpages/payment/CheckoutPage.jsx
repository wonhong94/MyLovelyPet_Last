import React from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import PetFooter from '../../Kioskcomponents/PetFooter';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import './CheckoutPage.css';

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "8otNVWzNcvj8y5GTCJ9GK";

export function CheckoutPage() {
  const [amount, setAmount] = useState({ currency: "KRW", value: 0 });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  // const [cartIdx] = useState(null);
  const { allCart } = useContext(UserContext);
  const cartIdxArray = allCart.map(item => item.cartIdx);

  useEffect(() => {
    const totalAmount = allCart.reduce((sum, item) => sum + item.pdPrice * item.cartCount, 0);
    setAmount({ currency: "KRW", value: totalAmount });
  }, [allCart]);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      setWidgets(widgets);
    }
    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets || amount.value <= 0) {
        return;
      }
      await widgets.setAmount(amount);

      await Promise.all([ 
        widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
        widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
      ]);

      setReady(true);
    }
    renderPaymentWidgets();
  }, [widgets, amount]);

  const handlePayment = async () => {
    try {
      const orderId = uuidv4();
      // 결제 정보를 서버로 전송
      const response = await fetch("/petShop/payment/toss", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartIdx : cartIdxArray,
          orderId,
          amount: amount.value,
          orderName: "MyLovelPet 물품",
          payType: "NORMAL"
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed.');
      }

      const paymentData = await response.json();

      // 결제를 요청
      await widgets.requestPayment({
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        successUrl: window.location.origin + "/success",
        failUrl: window.location.origin + "/fail"
      });
    } catch (error) {
      // 에러 처리
      console.error('Payment failed:', error);
      // alert('결제에 실패했습니다. 다시 시도해 주세요.');
      Swal.fire({
        title: '결제실패',
        text: '결제에 실패했습니다. 다시 시도해 주세요.',
        icon: 'error',
        confirmButtonText: '확인'
      });
    }
  };

  return (
    <div className="wrapper">
      <div className="checkout-box_section">
        <div id="payment-method" />
        <div id="agreement" />
        <button
          className="Check_button"
          disabled={!ready }
          onClick={handlePayment}
        >
          결제하기
        </button>
      </div>
      <PetFooter isRelative={true} />
    </div>
  );
}
