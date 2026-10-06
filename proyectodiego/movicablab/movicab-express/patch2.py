import os

seeder_path = 'src/database/seeders/index.ts'
with open(seeder_path, 'r') as f:
    seeder = f.read()

seeder = seeder.replace('await sequelize.sync({ force: false, alter: true });', 'await sequelize.sync({ force: true });')

with open(seeder_path, 'w') as f:
    f.write(seeder)
