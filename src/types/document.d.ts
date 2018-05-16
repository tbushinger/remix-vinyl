export type DocSchema = {
    version: string,
    type: string
}

export type DocMeta = {
    version: string,
    createdOn: string,
    createdBy: string,
    updatedOn: string,
    updatedBy: string
}

export type DocType = {
    id: string,
    schema: DocSchema,
    meta: DocMeta,
    head: any,
    body: any
}