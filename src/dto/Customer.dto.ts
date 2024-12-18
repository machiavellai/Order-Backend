
import { IsEmail, IsEmpty, Length } from "class-validator"

export class CreateCustomerInpiuts {

    @IsEmail()
    email: string

    @Length(7, 15)
    phone: string

    @Length(6, 12)
    password: string
}


export class EditCustomerProfileInputs {
    @Length(7, 15)
    firstName: string;

    @Length(3, 16)
    lastName: string;

    @Length(6, 16)
    address: string;

}

export class UserLoginInpiuts {

    @IsEmail()
    email: string



    @Length(6, 12)
    password: string
}


export interface CustomerPayload {
    _id: string;
    email: string;
    verified: boolean;
}

export class CartItems {
    _id: string;

    unit: number;
}

export class OrderInputs {
    txnId: string;
    amount: string;
    items: [CartItems];
}


// export class OrderInputs {
//     txnId: string;
//     amount: string;
//     items: [CartItem];
// }


