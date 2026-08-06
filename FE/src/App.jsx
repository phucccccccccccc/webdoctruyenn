import { useEffect } from "react";
import axios from "axios";
import { antiCopy, removeAntiCopy } from "./utils/antiCopy";

function App() {

  useEffect(() => {

    // Kích hoạt chống sao chép
    antiCopy();

    // Test API
    axios.get("http://localhost:5000/test")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // Hủy sự kiện khi App unmount
    return () => {
      removeAntiCopy();
    };

  }, []);

  return (
    <>
      <h1>FE</h1>
    </>
  );
}

export default App;