import { Session } from "session";

export type Request = {
    query: any,
    headers: any,
    params: any,
    body: any,
    session: Session
}