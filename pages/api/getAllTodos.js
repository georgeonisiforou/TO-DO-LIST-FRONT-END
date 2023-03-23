import axios from "axios";
export default async function handler(req, res) {
  try {
    await axios
      .get("http://localhost:3001/todoItems", {
        headers: {
          Authorization: "Bearer test",
        },
      })
      .then((response) => {
        res.status(200).json(response.data);
      });
  } catch (error) {
    console.error(error);
  }
}
