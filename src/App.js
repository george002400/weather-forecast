import { useEffect, useState } from "react";
import getFormattedWeatherData from "./services/weatherService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";

const CLIENT_ID = "1a271e1356de9aae1c6a";

function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  const [query, setQuery] = useState({ q: "Manila" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              setCheck(true);
              setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    }
  }, []);

  useEffect(() => {
    if (check) {
      const getUserData = async () => {
        await fetch("http://localhost:4000/getUserData", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"), // Bearer AccessToken
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setUserData(data);
          });
      };
      getUserData();
    }
  }, [check]);

  const loginWithGitHub = () => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  };

  useEffect(() => {
    const fetchWeather = async () => {
      const message = query.q ? query.q : "current location.";

      toast.info("Fetching weather for " + message);

      await getFormattedWeatherData({ ...query, units }).then((data) => {
        toast.success(
          `Successfully fetched weather for ${data.name}, ${data.country}.`
        );

        setWeather(data);
      });
    };

    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to-orange-700";
  };

  return (
    <div>
      <Navbar setRerender={setRerender} rerender={rerender} />
      {localStorage.getItem("accessToken") ? (
        <div
          className={`lg:mx-auto lg:max-w-screen-md mt-4 py-2 px-4 lg:py-5 lg:px-32 bg-blue-400 h-fit shadow-xl mx-4 shadow-gray-400 ${formatBackground()}`}
        >
          {Object.keys(userData).length !== 0 ? (
            <div className="flex flex-col items-center justify-center text-white">
              <div>{userData.login}</div>
              <div>{userData.html_url}</div>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center mt-56">
            <div className="p-6 mx-4 bg-gray-100 shadow-xl rounded-xl lg:mx-0">
              <p>
                Hi! Welcome to the weather forecast web application. Please
                login with your
              </p>
              <p>
                Github user to use the application and view the weather in your
                city.
              </p>
              <div className="flex items-center justify-center">
                <button
                  onClick={loginWithGitHub}
                  className="p-2 mt-6 font-bold text-white bg-blue-500 rounded-xl w-36 "
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
