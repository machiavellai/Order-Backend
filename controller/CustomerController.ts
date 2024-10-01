import express, { Request, Response, NextFunction } from 'express'

import {plainToClass} from 'class-transformer'
import { CreateCustomerInpiuts } from '../dto/Customer.dto'


export const CustomerSignup =  async (req: Request, res: Response, next: NextFunction) => {

const customerInputs = plainToClass(CreateCustomerInpiuts, req.body)

}

export const CustomerLogin =  async (req: Request, res: Response, next: NextFunction) => {

}

export const VerifyCustomer =  async (req: Request, res: Response, next: NextFunction) => {

}

export const RequestOtp =  async (req: Request, res: Response, next: NextFunction) => {

}

export const GetCustomerProfile =  async (req: Request, res: Response, next: NextFunction) => {

}

export const EditCustomerProfile =  async (req: Request, res: Response, next: NextFunction) => {

}