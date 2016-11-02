import Koa from 'koa';
import jobtong from './jobtong';
import jobi from './jobi';
import liepin from './liepin';

const app = new Koa();

app.use(jobtong.routes());
app.use(jobi.routes());
app.use(liepin.routes());

app.listen(4000);

export default app;