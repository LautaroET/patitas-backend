import logger from '../utils/logger.mjs';
export default (err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
};