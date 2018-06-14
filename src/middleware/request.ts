import { Request } from "../types/request"

export default (fnRoute: any) : any => {
    return (req: any, res: any) => {       
        const request: Request = {
            query: req.query,
            headers: req.headers,
            params: req.params,
            body: req.body,
            session: req.session            
        }

        fnRoute(request).then((result: any) => {
            res.send(result);
        });
    }
}


