export interface typeHeader{
    textSmall?:string,
    directionLogo?:string,
    titleMain?:string,
    infoContract?:string,
    textAditional?:string
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
    titleInfo?:string[],
    aditional?:string[],
}