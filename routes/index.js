import jobtong from './jobtong';
import jobi from './jobi';
import liepin from './liepin';
import mmjpg from './mmjpg';
import haodiao from './haodiao';

const routes = [jobtong, jobi, liepin, mmjpg, haodiao];

export default (app) => {
    routes.forEach((route) => {
        app
            .use(route.routes())
            .use(route.allowedMethods({
                throw: true,
            }));
    });
};