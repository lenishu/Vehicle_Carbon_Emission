import axios from "axios";
import React from "react";
import Header from "./Components/Header";
import { useForm } from "react-hook-form";
// import Select from "react-select";

const options = ["petrolium", "diesel", "coal", "ethanol"];
const transmission = ["Manual", "Automatic", "CVT", "a"];
const Inputs = [
  {
    id: 1,
    name: "number1",
    placeholder: "number1",
  },
  { id: 2, name: "number2", placeholder: "number2" },
  { id: 3, name: "number3", placeholder: "number3" },
  { id: 4, name: "number4", placeholder: "number4" },
];

function App() {
  const [Options, setOptions] = React.useState([]);
  const [transmissionOptions, setTransmissionOptions] = React.useState([]);
  const [res, setRes] = React.useState();
  const [data, setData] = React.useState("");

  console.log(data);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (data.fueltype === "petrolium") {
      setOptions([1, 0, 0, 0]);
    }

    if (data.fueltype === "diesel") {
      setOptions([0, 1, 0, 0]);
    }

    if (data.fueltype === "coal") {
      setOptions([0, 0, 1, 0]);
    }

    if (data.fueltype === "coal") {
      setOptions([0, 0, 1, 0]);
    }

    if (data.fueltype === "ethanol") {
      setOptions([0, 0, 0, 1]);
    }

    if (data.transmission === "Manual") {
      setTransmissionOptions([1, 0, 0, 0]);
    }

    if (data.transmission === "Automatic") {
      setTransmissionOptions([0, 1, 0, 0]);
    }

    if (data.transmission === "CVT") {
      setTransmissionOptions([0, 0, 1, 0]);
    }

    if (data.transmission === "a") {
      setTransmissionOptions([0, 0, 0, 1]);
    }
  }, [data.fueltype, data.transmission]);

  async function handleClick(data) {
    setData(data);
    /*
     * @dev changing numbers object values to array as backend receives data in the form of array
     */
    const numbers = Object.values(data.numbers);
    const nums = numbers.map(Number);

    /*
     * There is issue on first click as data is set on button click but setter function is Asynchronous to get the updated value, it will be resolved soon
     */
    await axios
      .post("http://127.0.0.1:8000/setData/", {
        Options,
        nums,
        transmissionOptions,
      })
      .then((res) => {
        if (res.status === 200) {
          setRes(res.data);
          reset();
        }
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
            <form
              onSubmit={handleSubmit((data) => {
                handleClick(data);
              })}
              className="flex flex-col gap-3"
            >
              {Inputs.map((input) => {
                return (
                  <div key={input.id} className="flex flex-col">
                    {errors?.numbers?.[input.name] && (
                      <span className="">
                        <em className=" text-red-500">
                          please enter a number*
                        </em>{" "}
                      </span>
                    )}
                    <input
                      type="number"
                      name={input.name}
                      placeholder={input.placeholder}
                      {...register(`numbers[${input.name}]`, {
                        required: true,
                      })}
                    />
                  </div>
                );
              })}
              <select
                name="fueltype"
                id="fuel-type"
                {...register("fueltype", { required: true })}
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
                {...register("transmission", { required: true })}
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
                <button className=" border border-[#ccc] px-2 py-2 rounded-sm w-full">
                  Predict
                </button>
              </div>
            </form>
          </div>
          <p>Result: {res && res[0]} </p>
        </div>
      </div>
    </div>
  );
}

export default App;
