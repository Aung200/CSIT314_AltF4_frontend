//libraries
import { useEffect, useState } from "react";

function Home() {
  const [message, setMessage] = useState("Loading...");
  useEffect(() => {
    const controller = new AbortController();
    fetch("https://backend-52c7fa59.fastapicloud.dev/", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to connect to backend.");
        return response.json();
      })
      .then((data) => setMessage(data.message))
      .catch((error) => {
        if (error.name !== "AbortError") setMessage("Unable to connect to backend.");
      });
    return () => controller.abort();
  }, []);
  return <>
  <h1>Home</h1><p>Backend : {message}</p></>;
}

export default Home;
