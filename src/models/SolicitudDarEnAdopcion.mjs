import mongoose from 'mongoose';

const solicitudDarEnAdopcionSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refugio: { type: mongoose.Schema.Types.ObjectId, ref: 'Refugio', required: true },
    datosMascota: {
      nombre: { type: String, required: true, trim: true, minlength: 2 },
      especie: { type: String, required: true, enum: ['perro', 'gato', 'conejo', 'ave', 'otro'] },
      raza: { type: String, trim: true },
      genero: { type: String, enum: ['macho', 'hembra'], required: true },
      edad: { type: Number, min: 0, max: 30 },
      descripcion: { type: String, trim: true, maxlength: 1000 },
      imagen: {type:String},
      caracteristicas: [String],
      esterilizado: { type: Boolean, default: false },
      tamano: { type: String, enum: ['pequeño', 'mediano', 'grande'] },
      nivelEnergia: { type: String, enum: ['bajo', 'moderado', 'alto'] },
      ubicacionActual: { type: String, trim: true }
    },
    estado: {
      type: String,
      enum: ['pendiente', 'aceptada', 'rechazada'],
      default: 'pendiente'
    },
    mensajeDelUsuario: { type: String, maxlength: 500 },
    mensajeDelRefugio: { type: String, maxlength: 500 }
  },
  { timestamps: true }
);

export default mongoose.model('SolicitudDarEnAdopcion', solicitudDarEnAdopcionSchema);
