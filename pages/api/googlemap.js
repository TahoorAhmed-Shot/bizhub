// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
export default async function handler(req, res) {
  if ((req.method = "GET")) {
    const { queryLocation } = req.query;
    console.log(queryLocation);
    const googleApiKey = "AIzaSyCgYbHR3oi_8pgbqxkexNvGnvD-FCIFMr8";
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${queryLocation}&key=${googleApiKey}`;
    const response = await axios.get(url);
    res.status(200).json(response.data);
  }
}
