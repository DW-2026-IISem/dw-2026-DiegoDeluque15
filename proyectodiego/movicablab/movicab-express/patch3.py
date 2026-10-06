import os

seeder_path = 'src/database/seeders/index.ts'
with open(seeder_path, 'r') as f:
    seeder = f.read()

replacement = '''
  const isMysql = sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";
  if (isMysql) {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  }
  try {
    await sequelize.sync({ force: true });
  } finally {
    if (isMysql) {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  }
'''

if 'await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");' not in seeder:
    seeder = seeder.replace('await sequelize.sync({ force: true });', replacement)
    with open(seeder_path, 'w') as f:
        f.write(seeder)
