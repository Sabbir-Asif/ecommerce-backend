import { PrismaClient } from '@prisma/client';
import express, {Express} from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';

const app : Express = express();
app.use(express.json());

export const prismaClient = new PrismaClient();

app.use('/api',rootRouter);


app.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`);
});

