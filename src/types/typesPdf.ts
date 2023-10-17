export interface typeHeader{
    textSmall?:string,
    logo?:string,
    titleMain?:string,
}

export interface typeContentBeforeBody{
    headers?:string[] | null,
    values?:any[] | null,
}

export interface typeTable{
    headersTable?:string[],
    valuesTable?:string[][]
}

export interface typeContentFooter{
    content?:{title?:string,info?:string[]}[],
    aditional?:string[],
}