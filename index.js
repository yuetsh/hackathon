import Koa from 'koa';
import mongoose from 'mongoose';
import {db, port} from './config';
import routing from './routes/index';

mongoose.Promise = global.Promise;
mongoose.connect(db);
mongoose.connection.on('connected', () =>console.log('Mongoose default connection open'));
mongoose.connection.on('error', (err) => console.error(err));
mongoose.connection.on('disconnected', () => console.log('Mongoose default connection disconnected'));

const app = new Koa();

routing(app);

app.listen(port, () => console.log(`Server Started On Port ${port}`));

export default app;