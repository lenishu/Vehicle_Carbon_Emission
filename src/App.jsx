import axios from "axios";
import React from "react";
import Header from "./Components/Header";
// import Select from "react-select";

const initialState = {
  numbers: [
    { id: 0, value: "" },
    { id: 1, value: "" },
    { id: 2, value: "" },
    { id: 3, value: "" },
  ],
  fueltype: ["petrolium"],
  transmission: ["Manual"],
};

function App() {
  const [Options, setOptions] = React.useState([]);
  const [transmissionOptions, setTransmissionOptions] = React.useState([]);
  const options = ["petrolium", "diesel", "coal", "ethanol"];
  const transmission = ["Manual", "Automatic", "CVT", "a"];
  const [res, setRes] = React.useState();
  const [data, setData] = React.useState(initialState);

  const ResetInputs = () => {
    setData(initialState);
  };

  const handleChange = (e, i) => {
    const cloned = [...data.numbers];
    cloned[i].value = e.target.value;
    const newarr = data.numbers.splice(0, data.numbers.length, ...cloned);
    setData({
      ...data,
      numbers: newarr,
    });
  };

  console.log(data);

  const handleFuelOptionsChange = (e) => {
    setData({ ...data, fueltype: [e.target.value] });
  };

  React.useEffect(() => {
    if (data.fueltype[0] === "petrolium") {
      setOptions([1, 0, 0, 0]);
    }

    if (data.fueltype[0] === "diesel") {
      setOptions([0, 1, 0, 0]);
    }

    if (data.fueltype[0] === "coal") {
      setOptions([0, 0, 1, 0]);
    }

    if (data.fueltype[0] === "coal") {
      setOptions([0, 0, 1, 0]);
    }

    if (data.fueltype[0] === "ethanol") {
      setOptions([0, 0, 0, 1]);
    }

    if (data.transmission[0] === "Manual") {
      setTransmissionOptions([1, 0, 0, 0]);
    }

    if (data.transmission[0] === "Automatic") {
      setTransmissionOptions([0, 1, 0, 0]);
    }

    if (data.transmission[0] === "CVT") {
      setTransmissionOptions([0, 0, 1, 0]);
    }

    if (data.transmission[0] === "a") {
      setTransmissionOptions([0, 0, 0, 1]);
    }
  }, [data.fueltype, data.transmission]);

  const handleTransmissionOptionsChange = (e) => {
    setData({
      ...data,
      transmission: [e.target.value],
    });
  };

  async function handleClick() {
    let nums = data.numbers.map(({ value }) => value);
    nums = nums.map(Number);
    console.log(nums);
    await axios
      .post("http://127.0.0.1:8000/setData/", {
        Options,
        nums,
        transmissionOptions,
      })
      .then((res) => {
        console.log(res), ResetInputs(), setRes(res.data);
      })
      .catch((e) => console.log(e));
  }

  return (
    <div>
      <Header />
      <div className=" grid min-h-[60vh] place-items-center">
        <div className="flex flex-col gap-2 max-w-5xl w-full m-auto py-3 px-3">
          <div className=" flex flex-col gap-3">
            <h1>Numerical Data</h1>
            {data?.numbers?.map((num, i) => {
              console.log(num);
              return (
                <input
                  key={i}
                  type="number"
                  name={`number${i + 1}`}
                  id={`number${i + 1}`}
                  onChange={(e) => handleChange(e, i)}
                  placeholder={`number${i + 1}`}
                  value={num.value}
                />
              );
            })}
          </div>
          <select
            name="fueltype"
            id="fuel-type"
            onChange={(e) => {
              handleFuelOptionsChange(e);
            }}
            value={data.fueltype[0]}
            className=" py-2"
          >
            {options.map((option, i) => {
              return (
                <option value={option} key={i}>
                  {option}
                </option>
              );
            })}
          </select>
          <select
            name="transmission"
            id="transmission-type"
            onChange={(e) => {
              handleTransmissionOptionsChange(e);
            }}
            value={data.transmission[0]}
            className=" py-2"
          >
            {transmission.map((t, i) => {
              return (
                <option value={t} key={i}>
                  {t}
                </option>
              );
            })}
          </select>
          <div className=" py-2">
            <button
              onClick={handleClick}
              className=" border border-[#ccc] px-2 py-2 rounded-sm w-full"
            >
              Predict
            </button>
          </div>
          <p>Result: {res && res[0]} </p>
        </div>
      </div>
    </div>
  );
}

export default App;
