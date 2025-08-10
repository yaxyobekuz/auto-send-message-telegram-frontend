import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-between gap-5 container h-screen py-5">
      <div className="space-y-3.5">
        <h1>Sahifa topilmadi!</h1>

        <p className="text-gray-400">
          Siz mavjud bo'lmagan sahifaga kirib qoldingiz.
        </p>
      </div>

      <Link to="/" className="btn-primary">
        Bosh sahifa
      </Link>
    </div>
  );
};

export default NotFound;
