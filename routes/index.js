import jobtong from './jobtong';
import jobi from './jobi';
import liepin from './liepin';

const routes = [jobtong, jobi, liepin];

export default (app) => {
    routes.forEach((route) => {
        app
            .use(route.routes())
            .use(route.allowedMethods({
                throw: true,
            }));
    });
};