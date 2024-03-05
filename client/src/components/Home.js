import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [drugname, setDrugname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const url= process.env.REACT_APP_API_URL || "http://localhost:3000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${url}/search/${drugname}`);
      console.log("response", response);
      const data = response.data;
      console.log("Fetched data:", data);
      navigate(`/profile/${drugname}`);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    }
    setIsLoading(false);
    setDrugname("");
  };

  return (
    <div className="home">
      <form className="home__form" onSubmit={handleSubmit}>
        <label htmlFor="drugname">Enter your drugname</label>
        <input
          value={drugname}
          placeholder="Search . . ."
          onChange={(e) => setDrugname(e.target.value)}
          name="drugname"
          id="drugname"
          className="text-white"
        />
        <button type="submit" disabled={isLoading} className="text-white">
          {isLoading ? "Loading..." : "Search"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Home;
