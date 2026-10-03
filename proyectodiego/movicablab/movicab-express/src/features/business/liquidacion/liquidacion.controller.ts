import { Request, Response } from "express";
import { Liquidacion } from "./liquidacion.model";
import { Carrera } from "../carrera/carrera.model";
import { Conductor } from "../conductor/conductor.model";
import { Turno } from "../turno/turno.model";
import { sequelize } from "../../../database/db";
import { Op } from "sequelize";

function paramId(req: Request): number {
  const raw = req.params.id;
  return Number(Array.isArray(raw) ? raw[0] : raw);
}

export class LiquidacionController {
  public async getAll(req: Request, res: Response) {
    try {
      const liquidaciones = await Liquidacion.findAll();
      res.status(200).json({ liquidaciones });
    } catch (error) {
      res.status(500).json({ error: "Error fetching liquidaciones", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const liquidacion = await Liquidacion.findByPk(paramId(req), {
        include: [{ association: "carreras", attributes: ["id", "fecha_fin", "total", "estado"] }]
      });
      if (!liquidacion) { res.status(404).json({ error: "Liquidacion not found" }); return; }
      res.status(200).json({ liquidacion });
    } catch (error) {
      res.status(500).json({ error: "Error fetching liquidacion", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    const { conductor_id, fecha_desde, fecha_hasta, observaciones } = req.body;

    if (!conductor_id || !fecha_desde || !fecha_hasta) {
      res.status(400).json({ error: "conductor_id, fecha_desde and fecha_hasta are required" });
      return;
    }

    const t = await sequelize.transaction();

    try {
      // 1. Valida conductor existe
      const conductor = await Conductor.findByPk(conductor_id);
      if (!conductor) {
        await t.rollback();
        res.status(404).json({ error: `Conductor with id=${conductor_id} not found` });
        return;
      }

      // 2. Busca todas las carreras cerradas, sin liquidar, en el rango, del conductor
      const carreras = await Carrera.findAll({
        where: {
          estado: "cerrada",
          liquidacion_id: null,
          fecha_fin: {
            [Op.gte]: new Date(fecha_desde),
            [Op.lte]: new Date(fecha_hasta),
          },
        },
        include: [
          {
            model: Turno,
            as: "turno",
            where: { conductor_id: conductor_id }, // Filtramos que el turno de esta carrera sea de este conductor
            required: true,
          }
        ],
        transaction: t,
      });

      if (!carreras || carreras.length === 0) {
        await t.rollback();
        res.status(400).json({ error: "Nada que liquidar en ese rango para ese conductor" });
        return;
      }

      // 3. Suma totales
      const valorTotal = carreras.reduce((acc, c) => acc + Number(c.total || 0), 0);

      // 4. Crea liquidacion
      const liquidacion = await Liquidacion.create(
        {
          conductor_id,
          fecha_desde: new Date(fecha_desde),
          fecha_hasta: new Date(fecha_hasta),
          valor: valorTotal,
          estado: "generada",
          observaciones: observaciones || null,
        },
        { transaction: t }
      );

      // 5. Actualiza carreras
      const carreraIds = carreras.map(c => c.id);
      await Carrera.update(
        { liquidacion_id: liquidacion.id },
        {
          where: { id: { [Op.in]: carreraIds } },
          transaction: t,
        }
      );

      await t.commit();
      res.status(201).json({ 
        liquidacion, 
        carreras_liquidadas: carreraIds.length,
        carreras_ids: carreraIds
      });

    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Transaction failed", detail: String(error) });
    }
  }
}
