import express from 'express';
import "dotenv/config.js"
import userApp from './src/Modules/User/userRoutes.js';
import connection from './db/connection.js';
import authApp from './src/Modules/Auth/authRoutes.js';
import { globalError } from './src/utils/globalError.js';
import graphQlRouter from './src/Modules/Notes/notesRoutes.js';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


const app = express();
app.use(express.json());
connection
app.use(cors());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);


app.use(graphQlRouter)
app.use(authApp)
app.use(userApp)



app.get('/', (req, res, next) =>{
    res.send('Hello World!');
})

app.use((req, res) => {
    res.status(404).send("Page not found");
})

app.use(globalError)

app.listen(process.env.PORT, () => {
    console.log(`Server is running!`);
})
