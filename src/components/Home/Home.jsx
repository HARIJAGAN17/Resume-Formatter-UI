import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/resume");
    }
  }, [user, navigate]);

  return (
    <div>
      <h2>Home page</h2>
    </div>
  );
}

export default Home;
