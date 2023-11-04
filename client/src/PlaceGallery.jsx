import { useState } from "react";
import PropTypes from "prop-types";
// validate the types of props passed to component
PlaceGallery.propTypes = {
    place: PropTypes.shape({
      price: PropTypes.number.isRequired,
      _id: PropTypes.string.isRequired,
      photos: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  };
  

export default function PlaceGallery({place}){
    const [showAllPhotos, setShowAllPhotos] = useState(false);

     // Check place is defined and has photos property before trying to access it
  if (!place || !place.photos) {
    return <div>Loading...</div>;
  }

    if (showAllPhotos) {
        return (
          <div className="absolute bg-primary min-h-screen inset-0">
            <div className="p-8 grid gap-4 bg-primary">
              <div className="mt-4">
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="flex gap-1 px-4 py-2 rounded-2xl fixed right-12 top-3 shadow shadow-gray-600 font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Close
                </button>
              </div>
    
              {place?.photos?.length > 0 &&
                place.photos.map((photo) => (
                  <div key={photo._id} className="rounded-2xl overflow-hidden">
                    <img src={"http://localhost:4000/uploads/" + photo} alt="" />
                  </div>
                ))}
            </div>
          </div>
        );
      }
    

    return(
        <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
          <div>
            {place.photos?.[0] && (
              <div>
                <img onClick={() => setShowAllPhotos(true)}
                  src={"http://localhost:4000/uploads/" + place.photos[0]}
                  alt=""
                  className="aspect-square object-cover cursor-pointer"
                />
              </div>
            )}
          </div>
          <div className="grid">
            {place.photos?.[1] && (
              <img onClick={() => setShowAllPhotos(true)}
                src={"http://localhost:4000/uploads/" + place.photos[1]}
                alt=""
                className="aspect-square object-cover cursor-pointer"
              />
            )}

            {place.photos?.[2] && (
              <div className="overflow-hidden">
                <img onClick={() => setShowAllPhotos(true)}
                  src={"http://localhost:4000/uploads/" + place.photos[2]}
                  alt=""
                  className="aspect-square object-cover relative top-2 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="absolute bottom-2 right-2 px-4 py-2 bg-white rounded-2xl shadow shadow-gray-500 flex gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M6 3a3 3 0 00-3 3v2.25a3 3 0 003 3h2.25a3 3 0 003-3V6a3 3 0 00-3-3H6zM15.75 3a3 3 0 00-3 3v2.25a3 3 0 003 3H18a3 3 0 003-3V6a3 3 0 00-3-3h-2.25zM6 12.75a3 3 0 00-3 3V18a3 3 0 003 3h2.25a3 3 0 003-3v-2.25a3 3 0 00-3-3H6zM17.625 13.5a.75.75 0 00-1.5 0v2.625H13.5a.75.75 0 000 1.5h2.625v2.625a.75.75 0 001.5 0v-2.625h2.625a.75.75 0 000-1.5h-2.625V13.5z" />
          </svg>
          See more photos
        </button>
      </div>

    )
}