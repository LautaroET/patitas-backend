import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        nombreCompleto: {
        nombre: { type: String, required: true },
        apellido: { type: String, required: true }
        },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        fechaNacimiento: { type: Date, required: true },
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
        tipo: {
        type: String,
        enum: ['comun', 'refugio', 'admin'],
        default: 'comun'
        }
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);