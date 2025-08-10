import { useState } from "react";

function Auth() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  async function sendCode() {
    setMsg("...");
    const r = await fetch("http://localhost:4000/api/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const j = await r.json();
    if (r.ok) {
      setMsg("Kod yuborildi. Telefonni tekshiring.");
      setStep(2);
    } else {
      setMsg("Xato: " + (j.error || JSON.stringify(j)));
    }
  }

  async function verify() {
    setMsg("...");
    const r = await fetch("http://localhost:4000/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const j = await r.json();
    if (r.ok) {
      setMsg("Muvaffaqiyat! Session DB ga saqlandi.");
      setStep(3);
    } else {
      setMsg("Xato: " + (j.error || JSON.stringify(j)));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Telefon bilan kirish</h2>
            <input
              className="w-full p-3 mb-3 border rounded"
              placeholder="+998..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              className="w-full p-3 bg-blue-600 text-white rounded"
              onClick={sendCode}
            >
              Kod yuborish
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Kod kiriting</h2>
            <input
              className="w-full p-3 mb-3 border rounded"
              placeholder="12345"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              className="w-full p-3 bg-green-600 text-white rounded"
              onClick={verify}
            >
              Tasdiqlash
            </button>
          </>
        )}
        {step === 3 && (
          <div className="text-green-600">Siz tizimga kirdingiz!</div>
        )}
        <div className="mt-3 text-sm text-gray-600">{msg}</div>
      </div>
    </div>
  );
}

export default Auth;
