import { useState, useEffect } from "react";
import PhotoUploader from "../PhotosUploader.jsx";
import Features from "../LocationFeatures";
import axios from "axios";
import AccountNav from "../AccountNav.jsx";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addPhoto, setAddPhoto] = useState([]);
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [moreInfo, setMoreInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestNum, setGuestNum] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(50);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddPhoto(data.photos);
      setDescription(data.description);
      setFeatures(data.features);
      setMoreInfo(data.moreInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setGuestNum(data.guestNum);
      setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(e) {
    e.preventDefault();
    const placeData = {title,
        address,
        addPhoto,
        description,
        features,
        moreInfo,
        checkIn,
        checkOut,
        guestNum,
      price,
      }; 
    if (id) {
      //Update existing place
      await axios.put("/places/:id", {
        id, ...placeData
      });
      setRedirect(true);
    } else {
      //Create new place
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {/* Title */}
        {preInput("Title", "write a short title for your place")}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="This is my place"
        />

        {/* Address */}
        {preInput("Address", "write the address to this place")}

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="My address"
        />

        {/* Photos */}
        {preInput("Photos", "add photos ")}

        <PhotoUploader addPhoto={addPhoto} onChange={setAddPhoto} />

        {/* Description */}
        {preInput("Description", "details about the place")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Location features */}
        {preInput("Location Features", "select all the futures in this place")}
        <div className="grid gap-2 mt-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Features selected={features} onChange={setFeatures} />
        </div>

        {/* More info */}
        {preInput("More Info", "house rules, etc.")}
        <textarea
          value={moreInfo}
          onChange={(e) => setMoreInfo(e.target.value)}
        />

        {/* Check In and Check Out */}
        {inputHeader(" Check In & Check Out")}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <h3 className="mt-2 mb-1">Check In Time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(e) => setCheckIn(parseInt(e.target.value, 10))}
              placeholder="14"
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Check Out Time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(e) => setCheckOut(parseInt(e.target.value, 10))}
              placeholder="11"
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Number of Guests</h3>
            <input
              type="number"
              value={guestNum}
              onChange={(e) => setGuestNum(parseInt(e.target.value, 10))}
              placeholder="1"
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Price per night</h3>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value, 10))}
             
            />
          </div>
        </div>

        {/* Save button */}
        <div>
          <button className="primary my-4">Save</button>
        </div>
      </form>
    </div>
  );
}
