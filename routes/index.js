import jobtong from './jobtong';
import jobi from './jobi';
import liepin from './liepin';
import mmjpg from './mmjpg';

const routes = [jobtong, jobi, liepin, mmjpg];

export default (app) => {
    routes.forEach((route) => {
        app
            .use(route.routes())
            .use(route.allowedMethods({
                throw: true,
            }));
    });
};