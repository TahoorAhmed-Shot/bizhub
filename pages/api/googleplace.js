import axios from "axios";
export default async function handler(req, res) {
  if ((req.method = "GET")) {
    const { place_id } = req.query;

    console.log(place_id);
    const googleApiKey = "AIzaSyCgYbHR3oi_8pgbqxkexNvGnvD-FCIFMr8";
    let url = `https://maps.googleapis.com/maps/api/place/details/json?key=${googleApiKey}&place_id=${place_id}`;

    const response = await axios.get(url);
    res.status(200).json(response.data);
  }
}
