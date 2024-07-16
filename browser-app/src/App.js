import axios from "axios";
import React from "react";

function App() {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/a1/rolldice?rolls=12");

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>OpenTelemetry React.js Apwwwp</p>
        <button onClick={fetchData}>Tracing</button>
      </header>
    </div>
  );
}

export default App;
