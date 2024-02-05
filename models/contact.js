import { Schema, model } from "mongoose";
import { HandleMongooseError } from "../helpers/HandleMongooseError.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
}, { versionKey: false });

contactSchema.post("save", HandleMongooseError);
const Contact = model("contact", contactSchema)
 
export { Contact };