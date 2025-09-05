import mongoose from 'mongoose';

const mascotaSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, trim: true, minlength: 2 },
        especie: {
        type: String,
        required: true,
        enum: ['perro', 'gato', 'conejo', 'ave', 'otro']
        },
        raza: { type: String, trim: true },
        genero: { type: String, enum: ['macho', 'hembra'], required: true },
        edad: { type: Number, min: 0, max: 30 },
        estado: {
        type: String,
        enum: ['disponible', 'en proceso de adopción', 'adoptado'],
        default: 'disponible'
        },
        descripcion: { type: String, trim: true, maxlength: 1000 },
        imagen:{ type: String } ,
        caracteristicas: [String],
        esterilizado: { type: Boolean, default: false },
        tamano: { type: String, enum: ['pequeño', 'mediano', 'grande'] },
        nivelEnergia: { type: String, enum: ['bajo', 'moderado', 'alto'] },
        refugio: { type: mongoose.Schema.Types.ObjectId, ref: 'Refugio', required: true },
        ubicacionActual: { type: String, trim: true }
    },
    { timestamps: true }
);

// Índices para búsquedas frecuentes
mascotaSchema.index({ refugio: 1, estado: 1 });
mascotaSchema.index({ especie: 1, estado: 1 });
mascotaSchema.index({ nombre: 'text', descripcion: 'text' });

export default mongoose.model('Mascota', mascotaSchema);
