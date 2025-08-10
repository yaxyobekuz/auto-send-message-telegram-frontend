import { useState } from "react";

// Api
import api from "../api/config";

// Helpers
import { extractNumbers } from "../lib/utils";

function Auth() {
  const [msg, setMsg] = useState("");
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [isLoading, setIsLoading] = useState(false);

  const sendCode = () => {
    setIsLoading(true);

    api
      .post("/api/send-code", { phone })
      .then(({ data }) => {
        const { ok } = data || {};
        if (!ok) throw new Error();
        setStep(2);
      })
      .catch((err) => setMsg(err.error || JSON.stringify(err)))
      .finally(() => setIsLoading(false));
  };

  const verify = () => {
    setIsLoading(true);

    api
      .post("/api/verify-code", { phone, code })
      .then(({ data }) => {
        const { ok, token } = data || {};
        if (!ok) throw new Error();

        setStep(3);
        localStorage.setItem(JSON.stringify({ token, createdAt: Date.now }));
      })
      .catch((err) => {
        if (!err?.response?.data) {
          return setMsg(`Nimadir xato ketdi: ${err.message}`);
        }

        if (err.response.data.error?.includes("SESSION_PASSWORD_NEEDED")) {
          return setMsg(
            "Hisobning 2 bosqichli tekshiruvi yoqilgan. Iltimos 2 bosqichli tekshiruvni o'chirib qaytadan urinib ko'ring."
          );
        }
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
}

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
  return <div className="text-green-600">Siz tizimga kirdingiz!</div>;
};

export default Auth;
