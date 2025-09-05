import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Permission from '../src/models/Permission.mjs';
import Role from '../src/models/Role.mjs';

dotenv.config();

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    /* ----------------------------------------------------------
        1.  Permisos (solo los que requieren auth)
    ---------------------------------------------------------- */
    const permissionsData = [
      /* Mascotas */
      { name: 'mascotas:create',   description: 'Crear mascota' },
      { name: 'mascotas:update',   description: 'Actualizar mascota propia' },
      { name: 'mascotas:delete',   description: 'Eliminar mascota propia' },

      /* Refugios */
      { name: 'refugios:create',   description: 'Crear refugio' },
      { name: 'refugios:delete',   description: 'Eliminar refugio propio' },
      {name:'refugios:update',     description: 'Edita el propio refugio'}, 
      { name: 'refugios:readOwn',  description: 'Ver mi propio refugio' },

      /* Solicitudes de adopción */
      { name: 'solicitudes:adopcion:create',    description: 'Crear solicitud de adopción' },
      { name: 'solicitudes:adopcion:listOwn',   description: 'Listar mis solicitudes de adopción' },
      { name: 'solicitudes:adopcion:listRefuge',description: 'Listar solicitudes para mi refugio' },
      { name: 'solicitudes:adopcion:patch',     description: 'Aceptar/rechazar solicitud de adopción' },

      /* Solicitudes para dar en adopción */
      { name: 'solicitudes:dar:create',    description: 'Solicitar dar en adopción' },
      { name: 'solicitudes:dar:listOwn',   description: 'Listar mis solicitudes de dar en adopción' },
      { name: 'solicitudes:dar:listRefuge',description: 'Listar solicitudes de dar en adopción para mi refugio' },
      { name: 'solicitudes:dar:patch',     description: 'Aceptar/rechazar solicitud de dar en adopción' },

      /* Admin */
      { name: 'admin:all', description: 'Acceso total al sistema' }
    ];

    const permissions = await Permission.insertMany(
      permissionsData.map(p => ({ ...p, _id: new mongoose.Types.ObjectId() })),
      { ordered: false }
    ).catch(() => Permission.find());

    /* ----------------------------------------------------------
        2.  Roles
    ---------------------------------------------------------- */
    const rolesData = [
      { name: 'comun',   description: 'Usuario común' },
      { name: 'refugio', description: 'Dueño de refugio' },
      { name: 'admin',   description: 'Administrador del sistema' }
    ];

    for (const r of rolesData) {
      let role = await Role.findOne({ name: r.name });
      if (!role) role = new Role(r);

      switch (r.name) {
        case 'comun':
          role.permissions = permissions.filter(p =>
            [
              'refugios:create',
              'solicitudes:adopcion:create',
              'solicitudes:adopcion:listOwn',
              'solicitudes:dar:create',
              'solicitudes:dar:listOwn'
            ].includes(p.name)
          );
          break;

        case 'refugio':
          role.permissions = permissions.filter(p =>
            [
              'mascotas:create',
              'mascotas:update',
              'mascotas:delete',
              'refugios:delete',
              'refugios:update',
              'refugios:readOwn',
              'solicitudes:adopcion:listRefuge',
              'solicitudes:adopcion:patch',
              'solicitudes:dar:listRefuge',
              'solicitudes:dar:patch'
            ].includes(p.name)
          );
          break;

        case 'admin':
          role.permissions = permissions; // todos
          break;
      }
      await role.save();
    }

    console.log('✅ Roles y permisos creados');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al seedear roles:', err);
    process.exit(1);
  }
};

seedRoles();