import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DonationFail() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 결제 실패 시 ?code=... 등 파라미터가 붙을 수 있음
    const searchParams = new URLSearchParams(location.search);
    //임시id값
    const orderId = searchParams.get("orderId");
    // etc...
  }, [location]);

  const retry = () => {
    // 다시 후원 페이지로 이동
    navigate("/donation");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>결제가 실패/취소되었습니다.</h1>
      <p>다시 시도하시겠습니까?</p>
      <button onClick={retry}>후원 페이지로 이동</button>
    </div>
  );
}
