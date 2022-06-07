import mongoose from 'mongoose';
const { Model, Schema } = mongoose;

export default mongoose.model(
    'Guild',
    new Schema({
        id: { type: String },
        registeredAt: { type: Number, default: Date.now() },
        addons: {
            screeningRoles: [String],
            logging: {
                enabled: { type: Boolean, default: false },
                channel: { type: String, default: null },
            },
            greeter: {
                enabled: { type: Boolean, default: false },
                channel: { type: String, default: '' },
                joinMessages: {
                    type: [String],
                    default: ['{mention} joined the server.'],
                },
                leaveMessages: {
                    type: [String],
                    default: ['{mention} left the server.'],
                },
                dmGreet: {
                    enabled: { type: Boolean, default: false },
                    message: { type: String, default: 'Welcome to the server, {user}!' },
                },
            },
        },
    })
);
