import mongoose, { Schema, Document, Model } from 'mongoose';
import { FoodDoc } from './Food';


export interface OrderDoc extends Document {

    orderId: string;
    vendorId: string;
    items: [any];
    totalAmount: number;
    orderDate: Date;
    paidThrough: string;
    orderStatus: string;  //ACCEPT // REJECT // UNDER-PROCESS // READY
    paymentResponse: string;
    remarks: string;
    deliveryId: string;
    appliedOffers: boolean;
    offerId: string;
    readyTime: number; //30 mins max
    // paidAmount: number;
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
    remarks: { type: String },
    // paidAmount: number;
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    readyTime: { type: Number }, //30 mins max
    offerId: { type: String }

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