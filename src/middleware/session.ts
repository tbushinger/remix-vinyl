import { Session } from "../types/session"

export default (context: any) => {
    return (req: any, res: any, next: any) => {
        const { 
            userid = context.userId
        } = req.headers;
        
        const session: Session = {
            userid
        }

        req.session = session
        
        next();
    }
};