import {Request,Response, NextFunction } from "express"

export class customError extends Error{
    statusCode:number
    constructor(message:string,statusCode:number){
        super(message)
        this.statusCode=statusCode
    }
}

export class errorHandler{
    static handleError(err:Error,req:Request,res:Response,next:NextFunction){
        console.log("error handler",err)

        const statusCode=err instanceof customError ? err.statusCode : 500
        res.status(statusCode).json({error:{
        message:err.message ? err.message :["Internal Server Error"]}})
    }
}

    