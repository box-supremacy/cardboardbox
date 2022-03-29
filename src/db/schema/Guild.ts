import mongoose from 'mongoose';
const { Model, Schema } = mongoose;

export default mongoose.model(
    'Guild',
    new Schema({
        id: { type: String },
        registeredAt: { type: Number, default: Date.now() },
        roles: {
            mod: [String],
            admin: [String],
            owner: [String],
        },
        addons: {
            screeningRoles: [String],
        },
    })
);
