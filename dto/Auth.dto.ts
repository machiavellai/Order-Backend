
import { VendorPayload } from "./Vendor.dto"
import { CustomerPayload } from './Customer.dto'



export type AuthPayload = VendorPayload | CustomerPayload


// export type AuthPayload = VendorPayload | CustomerPayload

// | UserPayload | 