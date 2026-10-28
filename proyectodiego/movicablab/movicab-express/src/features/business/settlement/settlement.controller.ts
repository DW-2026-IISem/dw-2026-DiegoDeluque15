import { Request, Response } from "express";
import { Settlement } from "./settlement.model";
import { Trip } from "../trip/trip.model";
import { Driver } from "../driver/driver.model";
import { Shift } from "../shift/shift.model";
import { sequelize } from "../../../database/db";
import { Op } from "sequelize";

function paramId(req: Request): number {
  const raw = req.params.id;
  return Number(Array.isArray(raw) ? raw[0] : raw);
}

export class SettlementController {
  public async getAll(req: Request, res: Response) {
    try {
      const settlements = await Settlement.findAll();
      res.status(200).json({ settlements });
    } catch (error) {
      res.status(500).json({ error: "Error fetching settlements", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const settlement = await Settlement.findByPk(paramId(req), {
        include: [{ association: "trips", attributes: ["id", "ended_at", "total", "status"] }]
      });
      if (!settlement) { res.status(404).json({ error: "Settlement not found" }); return; }
      res.status(200).json({ settlement });
    } catch (error) {
      res.status(500).json({ error: "Error fetching settlement", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    const { driver_id, date_from, date_to, notes } = req.body;

    if (!driver_id || !date_from || !date_to) {
      res.status(400).json({ error: "driver_id, date_from and date_to are required" });
      return;
    }

    const t = await sequelize.transaction();

    try {
      // 1. Valida driver existe
      const driver = await Driver.findByPk(driver_id);
      if (!driver) {
        await t.rollback();
        res.status(404).json({ error: `Driver with id=${driver_id} not found` });
        return;
      }

      // 2. Busca todas las trips cerradas, sin liquidar, en el rango, del driver
      const trips = await Trip.findAll({
        where: {
          status: "cerrada",
          settlement_id: null,
          ended_at: {
            [Op.gte]: new Date(date_from),
            [Op.lte]: new Date(date_to),
          },
        },
        include: [
          {
            model: Shift,
            as: "shift",
            where: { driver_id: driver_id },
            required: true,
          }
        ],
        transaction: t,
      });

      if (!trips || trips.length === 0) {
        await t.rollback();
        res.status(400).json({ error: "Nothing to settle in that range for that driver" });
        return;
      }

      // 3. Suma totales
      const valorTotal = trips.reduce((acc, c) => acc + Number(c.total || 0), 0);

      // 4. Crea settlement
      const settlement = await Settlement.create(
        {
          driver_id,
          date_from:    new Date(date_from),
          date_to:      new Date(date_to),
          total_amount: valorTotal,
          status:       "generada",
          notes:        notes || null,
        },
        { transaction: t }
      );

      // 5. Actualiza trips
      const tripIds = trips.map(c => c.id);
      await Trip.update(
        { settlement_id: settlement.id },
        {
          where: { id: { [Op.in]: tripIds } },
          transaction: t,
        }
      );

      await t.commit();
      res.status(201).json({ 
        settlement, 
        trips_settled: tripIds.length,
        trip_ids: tripIds
      });

    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Transaction failed", detail: String(error) });
    }
  }
}
