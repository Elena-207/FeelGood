import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";

export default function PlacesPage() {
  const { action } = useParams();
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      {/* Add New Place Button */}
      {action !== "new" && (
        <div>
          <div className="text-center">
            <Link
              className="bg-primary text-white py-2 px-6 rounded-full inline-flex gap-1"
              to={"/account/places/new"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
              Add New Place
            </Link>
          </div>

          <div className="mt-4">
            {places.length > 0 &&
              places.map((place) => (
                <Link to={'/account/places/' + place._id}
                  className="bg-gray-100 p-2 rounded-2xl m-2 flex gap-4 cursor-pointer"
                  key={place._id}
                >
                  <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                    <PlaceImg place={place} />
                  </div>

                  <div className="grow-0 shrink">
                    <h2 className="text-xl font-bold">{place.title}</h2>
                    <p className="text-sm mt-2">{place.description}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
