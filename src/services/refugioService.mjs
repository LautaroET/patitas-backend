import mongoose from 'mongoose';
import RefugioRepository from '../repositories/RefugioRepository.mjs';
import MascotaRepository from '../repositories/MascotaRepository.mjs';
import SolicitudAdopcionRepository from '../repositories/SolicitudAdopcionRepository.mjs';
import SolicitudDarEnAdopcionRepository from '../repositories/SolicitudDarEnAdopcionRepository.mjs';
import UserRepository from '../repositories/UserRepository.mjs';
import RoleRepository from '../repositories/RoleRepository.mjs';
import logger from '../utils/logger.mjs';
import ApiError from '../utils/ApiError.mjs';

class RefugioService {
    async crearRefugio(data, userId) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await UserRepository.findById(userId);
            if (!user || user.tipo !== 'comun') {
                throw new ApiError('Solo usuarios comunes pueden crear un refugio', 403);
            }

            if (await RefugioRepository.findByUsuario(userId)) {
                throw new ApiError('Ya tienes un refugio registrado', 409);
            }

            const refugio = await RefugioRepository.create({ ...data, usuario: userId }, { session });

            const refugioRole = await RoleRepository.findByName('refugio');
            await UserRepository.update(
                userId,
                { role: refugioRole._id, tipo: 'refugio' },
                { session }
            );

            await session.commitTransaction();
            return refugio;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    async listarRefugios() {
        return RefugioRepository.findAll();
    }
    
    async eliminarRefugio(userId) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
        const refugio = await RefugioRepository.findByUsuario(userId);
        if (!refugio) throw new Error('No tienes un refugio asociado');

        const mascotas = await MascotaRepository.findAll(
            { refugio: refugio._id },
            { session, projection: { _id: 1 } }
        );
        const mascotaIds = mascotas.map(m => m._id);

        if (mascotaIds.length) {
            await SolicitudAdopcionRepository.deleteMany(
            { mascota: { $in: mascotaIds } },
            { session }
            );
        }

        await SolicitudDarEnAdopcionRepository.deleteMany(
            { refugio: refugio._id },
            { session }
        );

        await MascotaRepository.deleteMany({ refugio: refugio._id }, { session });

        await RefugioRepository.delete(refugio._id, { session });

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