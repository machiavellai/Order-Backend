import mongoose, { Schema, Document } from 'mongoose'

export interface OfferDoc extends Document {
    offerType: string; //VENDOR //GENERIC
    vendors: [any]; // ['93456ac]
    title: string; INR
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


const OfferSchema = new Schema({

    offerType: { type: String, required: true },
    vendors: [
        {
            type: Schema.Types.ObjectId, ref: 'vendor'
        }
    ],
    title: { type: String, required: true },
    description:  String,
    minValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: Date,
    endValidity: Date,
    promoCode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [{
        type: String
    }
    ],
    bins: [{
        type: Number
    }
    ],
    pincode: { type: Number, required: true },
    images: Boolean,

}, {


    toJSON: {
        transform(doc, ret) {
            delete ret._v
        }
    },
    timestamps: true
})


const Offer = mongoose.model<OfferDoc>('offer', OfferSchema);


export { Offer }


