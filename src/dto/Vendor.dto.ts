export interface CreateVendorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface EditVendorInputs {
    name: string;
    address: string;
    phone: string;
    foodType: [string];
}

export interface VendorLoginInputs {
    email: string;
    password: string;
}

export interface VendorPayload {
    _id: string;
    email: string;
    name: string;
    foodType: [string];
}

export interface CreateOfferInputs {
    offerType: string; //VENDOR //GENERIC
    vendors: [any]; // ['93456ac]
    title: string;
    description: string;
    minValue: number;
    offerAmount: number;
    startValidity: Date;
    endValidity: Date;
    promoCode: string;
    promoType: string;
    bank: [any],
    bins: [any],
    pincode: string;
    isActive: boolean;
}