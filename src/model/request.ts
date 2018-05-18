export function extract(req: any) : any {
    const { userid = 'composer' } = req.headers;
    return Object.assign({}, req.params, {
        userid,
        jsonData: (req.payload) ? JSON.parse(req.payload) : undefined
    });
}