import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TripAccessPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/trips/invite/${token}`);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    fetchInvite();
  }, [token]);

  if (status === "loading") return <p className="text-center mt-10">Завантаження...</p>;
  if (status === "error") return <p className="text-center mt-10 text-red-500">Недійсне запрошення 😢</p>;

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Вас успішно додано до подорожі!</h2>
      <a href="/trips" className="text-blue-600 hover:underline">Перейти до подорожей</a>
    </div>
  );
};

export default TripAccessPage;
