import mongoose from 'mongoose';


const placeSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    features:[String],
    moreInfo: String,
    checkIn: Number,
    checkOut: Number,
    guestNum: Number,
    price: Number,
});

const PlaceModel= mongoose.model('Place', placeSchema);
export default PlaceModel;          