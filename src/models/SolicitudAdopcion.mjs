import mongoose from 'mongoose';

const solicitudAdopcionSchema = new mongoose.Schema(
    {
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        mascota: { type: mongoose.Schema.Types.ObjectId, ref: 'Mascota', required: true },
        refugio: { type: mongoose.Schema.Types.ObjectId, ref: 'Refugio', required: true },
        estado: {
        type: String,
        enum: ['pendiente', 'aceptada', 'rechazada', 'cancelada'],
        default: 'pendiente'
        },
        datosSolicitante: {
        nombreCompleto: { type: String, required: true },
        telefono: { type: String, required: true },
        email: { type: String, required: true },
        mensaje: { type: String, trim: true, maxlength: 1000 }
        },
        motivosAdopcion: { type: String, trim: true, maxlength: 1000 },
        respuestaMensaje: { type: String, trim: true, maxlength: 1000 }
    },
    { timestamps: true }
);

export default mongoose.model('SolicitudAdopcion', solicitudAdopcionSchema);