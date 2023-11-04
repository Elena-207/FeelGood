import { useState, useEffect, useContext} from "react";
import PropTypes from "prop-types";
import { differenceInCalendarDays } from "date-fns/fp";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

// validate the types of props passed to component
BookingWidget.propTypes = {
  place: PropTypes.shape({
    price: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numOfGuests, setNumOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");

 const {user}= useContext(UserContext);
useEffect(() => {
if(user){ setName(user.name);}
}, [user]);




  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkIn),
      new Date(checkOut)
    );
  }

  async function bookThisPlace(){
    const data = { checkIn,checkOut,numOfGuests,name,phone,
    place: place._id,
    price: numberOfNights * place.price,
    }
    const response = await axios.post('/bookings', data);
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if(redirect){
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-gray-200 shadow-sm shadow-black p-4 rounded-2xl">
      <div className="text-2xl text-center">
        <b>Price: € {place.price}</b> / night
      </div>

      <div className="border bg-gray-300 rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4 ">
            <label>Check in: </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out: </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className="py-3 px-4 border-t">
          <label>Number of guests: </label>
          <input
            type="number"
            value={numOfGuests}
            onChange={(e) => setNumOfGuests(e.target.value)}
          />
        </div>

        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfNights > 0 && <span> ${numberOfNights * place.price}</span>}
      </button>
      {numberOfNights > 0 && <div>Number of nights: {numberOfNights}</div>}

    </div>
  );
}
