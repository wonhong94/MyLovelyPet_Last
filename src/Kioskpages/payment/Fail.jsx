import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function FailPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sendAutoCapture = async () => {
      const image = localStorage.getItem("image");
      

      if (image) {
        try {
          await fetch("/petShop/cart/blacklistFaceAdd", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image }),
          });
        } catch (error) {
          console.error("Failed to send autoCapture:", error);
        }
      }
    };

    sendAutoCapture();
  }, []);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 실패</h2>
        <p>{`에러 코드: ${searchParams.get("code")}`}</p>
        <p>{`실패 사유: ${searchParams.get("message")}`}</p>
      </div>
    </div>
  );
}
