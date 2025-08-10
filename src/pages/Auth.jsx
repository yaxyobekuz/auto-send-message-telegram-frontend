import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Api
import api from "../api/config";

// Helpers
import { extractNumbers } from "../lib/utils";

const Auth = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const auth = localStorage.getItem("auth");
  const [phone, setPhone] = useState("+998 ");
  const [isLoading, setIsLoading] = useState(false);

  // If user auth token exists navigate user
  useEffect(() => {
    if (auth) navigate("/");
  }, []);

  const sendCode = () => {
    setIsLoading(true);
    const formattedPhone = `+${extractNumbers(phone)}`;

    api
      .post("/api/auth/send-code", { phone: formattedPhone })
      .then(({ ok }) => {
        if (!ok) throw new Error();
        setStep(2);
      })
      .catch((res) => setMsg(res.error || "Nimadir xato ketdi"))
      .finally(() => setIsLoading(false));
  };

  const verify = () => {
    setIsLoading(true);
    const formattedPhone = `+${extractNumbers(phone)}`;

    api
      .post("/api/auth/verify-code", { phone: formattedPhone, code })
      .then(({ ok, token }) => {
        if (!ok) throw new Error();

        const auth = JSON.stringify({ token, createdAt: Date.now });
        localStorage.setItem("auth", auth);
        navigate("/");
        setStep(3);
      })
      .catch((res) => {
        if (!res) {
          return setMsg(`Nimadir xato ketdi: ${JSON.stringify(res)}`);
        }

        if (res.error === "PHONE_CODE_INVALID") {
          return setMsg("Kod noto'g'ri kiritildi");
        }

        if (res.error === "SESSION_PASSWORD_NEEDED") {
          return setMsg(
            "Hisobning 2 bosqichli tekshiruvi yoqilgan. Iltimos 2 bosqichli tekshiruvni o'chirib qaytadan urinib ko'ring."
          );
        }

        return setMsg(res.error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="h-screen container py-5">
      {step === 1 && (
        <StepOne
          msg={msg}
          phone={phone}
          updateMsg={setMsg}
          sendCode={sendCode}
          isLoading={isLoading}
          onPhoneChange={setPhone}
        />
      )}

      {step === 2 && (
        <StepTwo
          msg={msg}
          code={code}
          verify={verify}
          updateMsg={setMsg}
          isLoading={isLoading}
          onCodeChange={setCode}
        />
      )}

      {step === 3 && (
        <StepThree
          msg={msg}
          phone={phone}
          updateMsg={setMsg}
          sendCode={sendCode}
          isLoading={isLoading}
          onPhoneChange={setPhone}
        />
      )}
    </div>
  );
};

const StepOne = ({
  msg,
  phone,
  sendCode,
  updateMsg,
  isLoading,
  onPhoneChange,
}) => {
  const handleSendCode = () => {
    if (isLoading) return;
    const phoneString = extractNumbers(phone);

    if (phoneString.length !== 12) {
      return updateMsg("Telefon raqam noto'g'ri kiritildi!");
    }

    if (!phoneString.startsWith("998")) {
      return updateMsg("Telefon raqam o'zbekiston raqami emas!");
    }

    sendCode();
    updateMsg("");
  };

  return (
    <div className="flex flex-col gap-3.5 size-full">
      <h1>Hisobga kirish</h1>

      <p className="text-gray-400">
        Quyidagi to'ldirish maydoniga telegram hisobingizning telefon raqamini
        kiriting.
      </p>

      <input
        autoFocus
        type="tel"
        value={phone}
        placeholder="+998 ..."
        onChange={(e) => onPhoneChange(e.target.value)}
      />

      <p className="italic text-sm text-gray-500">{msg}</p>

      <button
        disabled={isLoading}
        onClick={handleSendCode}
        className={`btn-primary mt-auto disabled:opacity-50`}
      >
        Kodni yuborish
        {isLoading && "..."}
      </button>
    </div>
  );
};

const StepTwo = ({ msg, code, verify, updateMsg, isLoading, onCodeChange }) => {
  const handleVerify = () => {
    if (isLoading) return;
    const codeString = extractNumbers(code);

    if (codeString.length !== 5) {
      return updateMsg("Kod 5 xonali emas!");
    }

    verify();
    updateMsg("");
  };

  return (
    <div className="flex flex-col gap-3.5 size-full">
      <h1>Hisobni tasdiqlash</h1>

      <p className="text-gray-400">
        Biz hisobingizni tasdiqlash uchun telegram hisobingizga kod yubordik,
        kodni quyidagi to'ldirish maydoniga kiriting.
      </p>

      <input
        autoFocus
        value={code}
        type="number"
        placeholder="_ _ _ _ _"
        onChange={(e) => onCodeChange(e.target.value)}
      />

      <p className="italic text-sm text-gray-500">{msg}</p>

      <button
        disabled={isLoading}
        onClick={handleVerify}
        className={`btn-primary mt-auto disabled:opacity-50`}
      >
        Tasdiqlash
        {isLoading && "..."}
      </button>
    </div>
  );
};

const StepThree = () => {
  return <div className="container text-green-600">Siz tizimga kirdingiz!</div>;
};

export default Auth;
