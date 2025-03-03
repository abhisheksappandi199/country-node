import express from "express";
import cors from "cors";

import countryRoutes from "./routes/CountryRoutes";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', async (req, res) => {
  res.send(`Server is running on port ${PORT}`)
})

app.use("/api", countryRoutes);

app.get('/*', async (req, res) => {
  res.status(404).send('something went wromg')
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
