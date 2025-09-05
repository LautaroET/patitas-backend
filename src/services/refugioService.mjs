import mongoose from 'mongoose';
import RefugioRepository from '../repositories/RefugioRepository.mjs';
import MascotaRepository from '../repositories/MascotaRepository.mjs';
import SolicitudAdopcionRepository from '../repositories/SolicitudAdopcionRepository.mjs';
import SolicitudDarEnAdopcionRepository from '../repositories/SolicitudDarEnAdopcionRepository.mjs';
import UserRepository from '../repositories/UserRepository.mjs';
import RoleRepository from '../repositories/RoleRepository.mjs';
import logger from '../utils/logger.mjs';

class RefugioService {
async crearRefugio(data, userId) {
    const user = await UserRepository.findById(userId);
    if (!user || user.tipo !== 'comun') throw new Error('Solo usuarios comunes pueden crear refugio');

    if (await RefugioRepository.findByUsuario(userId))
      throw new Error('Ya tienes un refugio registrado');

    const refugio = await RefugioRepository.create({ ...data, usuario: userId });

    const refugioRole = await RoleRepository.findByName('refugio');
    user.role = refugioRole._id;
    user.tipo = 'refugio';
    await UserRepository.update(user._id, { role: refugioRole._id, tipo: 'refugio' });

    return refugio;
  }
    async eliminarRefugio(userId) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
        const refugio = await RefugioRepository.findByUsuario(userId);
        if (!refugio) throw new Error('No tienes un refugio asociado');

        // 1. _ids de mascotas del refugio
        const mascotas = await MascotaRepository.findAll(
            { refugio: refugio._id },
            { session, projection: { _id: 1 } }
        );
        const mascotaIds = mascotas.map(m => m._id);

        // 2. Borrar solicitudes ADOPCIÓN vinculadas a esas mascotas
        if (mascotaIds.length) {
            await SolicitudAdopcionRepository.deleteMany(
            { mascota: { $in: mascotaIds } },
            { session }
            );
        }

        // 3. Borrar solicitudes DAR-EN-ADOPCIÓN vinculadas al refugio
        await SolicitudDarEnAdopcionRepository.deleteMany(
            { refugio: refugio._id },
            { session }
        );

        // 4. Borrar mascotas del refugio
        await MascotaRepository.deleteMany({ refugio: refugio._id }, { session });

        // 5. Borrar refugio
        await RefugioRepository.delete(refugio._id, { session });

        // 6. Revertir rol usuario
        const comunRole = await RoleRepository.findByName('comun');
        await UserRepository.update(
            userId,
            { role: comunRole._id, tipo: 'comun' },
            { session }
        );

        await session.commitTransaction();
        logger.info(`Refugio ${refugio._id} + mascotas + solicitudes (ambos tipos) borradas`);
        return { message: 'Refugio, mascotas y solicitudes eliminadas permanentemente' };
        } catch (err) {
        await session.abortTransaction();
        logger.error('Error hard-eliminando refugio', err);
        throw err;
        } finally {
        session.endSession();
        }
    }
    }

export default new RefugioService();
