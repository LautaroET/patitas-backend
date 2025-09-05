import Mascota from '../models/Mascota.mjs';
import Refugio from '../models/Refugio.mjs';

export const isOwnerOfMascota = async (req, res, next) => {
  try {
    const mascota = await Mascota.findById(req.params.id);
    if (!mascota) return res.status(404).json({ message: 'Mascota no encontrada' });

    const refugio = await Refugio.findOne({ usuario: req.user.id });
    if (!refugio || mascota.refugio.toString() !== refugio._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    next();
  } catch (err) {
    next(err);
  }
};

export const isOwnerOfRefugio = async (req, res, next) => {
  try {
    const refugio = await Refugio.findOne({ usuario: req.user.id });
    if (!refugio) return res.status(404).json({ message: 'Refugio no encontrado' });
    next();
  } catch (err) {
    next(err);
  }
};