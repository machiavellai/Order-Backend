import mongoose, { Schema, Document, Model } from 'mongoose';
import { FoodDoc } from './Food';


export interface OrderDoc extends Document {

    orderId: string;
    vendorId: string;
    items: [any];
    totalAmount: number;
    orderDate: Date;
    paidThrough: string;
    orderStatus: string;
    paymentResponse: string;
    food: [FoodDoc];
    remarks: string;
    paidAmount: number;
    deliveryId: string;
    readyTime: number; //30 mins max
    appliedOffers: boolean;
    offerId: string;
}


const OrderSchema = new Schema({
    orderId: { type: String, require: true },
    vendorId: { type: String, require: true },
    // vendorId: {type: String, require: true},
    items: [
        {
            food: { type: Schema.Types.ObjectId, ref: "food", require: true },
            unit: { type: Number, require: true }
        }
    ],
    totalAmount: { type: Number, require: true },
    orderDate: { type: Date },
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
    // food: [{
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'food'
    // }]
    // readyTime:{type: Number},
    // paidAmount: {type: Number, require: true},

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;

        }
    },
    timestamps: true
});


const Order = mongoose.model<OrderDoc>('order', OrderSchema);

export { Order }