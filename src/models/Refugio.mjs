import mongoose from 'mongoose';
import validator from 'validator';

const refugioSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, trim: true, unique: true },
        descripcion: { type: String, trim: true, maxlength: 1000 },
        imagen: { type: String, trim: true },
        direccion: { type: String, required: true, trim: true },
        telefono: { type: String, required: true, trim: true },
        email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email inválido']
        },
        sitioWeb: {
        type: String,
        trim: true,
        validate: [validator.isURL, 'URL inválida']
        },
        redesSociales: {
        facebook: { type: String, trim: true },
        instagram: { type: String, trim: true },
        twitter: { type: String, trim: true }
        },
        horariosAtencion: { type: String, trim: true },
        usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('Refugio', refugioSchema);