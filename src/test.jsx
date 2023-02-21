import { useEffect, useState } from "react";
import { useLocalStorage } from "./utils/hooks";

let initialForm = {
  name: "",
  website: "",
  contact: {
    cell: "",
    email: "",
  },
};

const App = () => {
  const [savedForm, setSavedForm, clearLocalStorage] =
    useLocalStorage("inputForm");
  const [inputFormState, setInputFormState] = useState(
    savedForm() || initialForm
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    if (name === "name" || name === "website") {
      setInputFormState((prev) => {
        const newForm = { ...prev };
        newForm[name] = value;
        return newForm;
      });
    }

    if (name === "cell" || name === "email") {
      setInputFormState((prev) => {
        let newForm = { ...prev };
        newForm.contact[name] = value;
        return newForm;
      });
    }
  };

  useEffect(() => {
    setSavedForm(inputFormState);
  }, [setSavedForm, inputFormState]);

  return (
    <>
      <div>
        Name:{" "}
        <input
          name="name"
          value={inputFormState?.name}
          onChange={(e) => handleFormChange(e)}
        />
      </div>

      <div>
        Website:{" "}
        <input
          name="website"
          value={inputFormState?.website}
          onChange={(e) => handleFormChange(e)}
        />
      </div>
      <div>
        Cell:{" "}
        <input
          name="cell"
          value={inputFormState?.contact?.cell}
          onChange={(e) => handleFormChange(e)}
        />
      </div>
      <div>
        Email:{" "}
        <input
          name="email"
          value={inputFormState?.contact?.email}
          onChange={(e) => handleFormChange(e)}
        />
      </div>
      <div>
        <button onClick={() => clearLocalStorage()}>Clear Cache</button>
      </div>
    </>
  );
};

export default App;
