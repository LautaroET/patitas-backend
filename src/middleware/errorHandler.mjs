import logger from '../utils/logger.mjs';
import ApiError from '../utils/ApiError.mjs';

export default (err, req, res, next) => {
    logger.error(err.stack);

if (err instanceof ApiError) {
res.status(err.statusCode).json({
status: err.status,
message: err.message
});
} else {
res.status(500).json({
status: 'error',
message: '¡Algo salió muy mal!'
});
}
};