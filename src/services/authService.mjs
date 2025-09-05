import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.mjs';
import RoleRepository from '../repositories/RoleRepository.mjs';

class AuthService {
    async register(data) {
        const { email, username, password } = data;

        const [existingEmail, existingUsername] = await Promise.all([
        UserRepository.findByEmail(email),
        UserRepository.findByUsername(username)
        ]);

        if (existingEmail || existingUsername) {
        throw new Error('Usuario o email ya existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await RoleRepository.findByName('comun');

        const user = await UserRepository.create({
        ...data,
        password: hashedPassword,
        role: role._id,
        tipo: 'comun'
        });

        const token = this.generateToken(user);
        const userResponse = user.toObject();
        delete userResponse.password;

        return { user: userResponse, token };
    }

    async login(email, password) {
        const user = await UserRepository.findByEmail(email);
        if (!user) throw new Error('Usuario no encontrado');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error('Credenciales inválidas');

        const token = this.generateToken(user);
        const userResponse = user.toObject();
        delete userResponse.password;

        return { user: userResponse, token };
    }

    async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error('Usuario no encontrado');
    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;
  }

    generateToken(user) {
        return jwt.sign(
        { id: user._id, role: user.role, tipo: user.tipo },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
        );
    }
    }

export default new AuthService();
