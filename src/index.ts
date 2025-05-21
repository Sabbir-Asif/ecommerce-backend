import express, {Express, Request, Response} from 'express';

const app : Express = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req : Request,res : Response) => {
    res.send(`server is running on port ${PORT}`);
});


app.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`);
});

