import { Request, Response } from "express";
import { Fare, FareI } from "./fare.model";
import { Op } from "sequelize";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

function validateBaseAndDates(
  base_value: number,
  valid_from: Date,
  valid_until: Date
): { status: number; message: string } | null {
  if (base_value <= 0) {
    return { status: 400, message: "base_value must be > 0" };
  }
  if (new Date(valid_from) >= new Date(valid_until)) {
    return { status: 400, message: "valid_from must be strictly before valid_until" };
  }
  return null;
}

async function checkOverlap(
  valid_from: Date,
  valid_until: Date,
  exclude_id?: number
): Promise<{ status: number; message: string } | null> {
  const where: any = {
    status: "active",
    [Op.or]: [
      {
        valid_from: { [Op.lte]: valid_until },
        valid_until: { [Op.gte]: valid_from },
      },
    ],
  };

  if (exclude_id) {
    where.id = { [Op.ne]: exclude_id };
  }

  const overlap = await Fare.findOne({ where });
  if (overlap) {
    return {
      status: 409,
      message: `Overlap detected with active Fare id=${overlap.id} [${overlap.valid_from.toISOString()} - ${overlap.valid_until.toISOString()}]`,
    };
  }
  return null;
}

export class FareController {
  public async getVigente(req: Request, res: Response) {
    try {
      const now = new Date();
      const fare = await Fare.findOne({
        where: {
          status: "active",
          valid_from: { [Op.lte]: now },
          valid_until: { [Op.gte]: now },
        },
      });
      if (!fare) {
        res.status(404).json({ error: "No active fare covers the current date" });
        return;
      }
      res.status(200).json({ fare });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vigente", detail: String(error) });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const fares = await Fare.findAll({ where: { status: "active" } });
      res.status(200).json({ fares });
    } catch (error) {
      res.status(500).json({ error: "Error fetching fares", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const fare = await Fare.findByPk(paramId(req));
      if (!fare) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json({ fare });
    } catch (error) {
      res.status(500).json({ error: "Error fetching fare", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as FareI;
      if (body.base_value === undefined || !body.valid_from || !body.valid_until) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const valError = validateBaseAndDates(body.base_value, body.valid_from, body.valid_until);
      if (valError) {
        res.status(valError.status).json({ error: valError.message });
        return;
      }

      if (body.status !== "inactive") {
        const overError = await checkOverlap(body.valid_from, body.valid_until);
        if (overError) {
          res.status(overError.status).json({ error: overError.message });
          return;
        }
      }

      const fare = await Fare.create({
        name: body.name,
        calculation_rule: body.calculation_rule,
        base_value: body.base_value,
        valid_from: body.valid_from,
        valid_until: body.valid_until,
        status: body.status ?? "active",
      });
      res.status(201).json({ fare });
    } catch (error) {
      res.status(500).json({ error: "Error creating fare", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as FareI;
      const fare = await Fare.findByPk(id);
      if (!fare) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      if (body.base_value === undefined || !body.valid_from || !body.valid_until) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const valError = validateBaseAndDates(body.base_value, body.valid_from, body.valid_until);
      if (valError) {
        res.status(valError.status).json({ error: valError.message });
        return;
      }

      const finalStatus = body.status ?? fare.status;
      if (finalStatus === "active") {
        const overError = await checkOverlap(body.valid_from, body.valid_until, id);
        if (overError) {
          res.status(overError.status).json({ error: overError.message });
          return;
        }
      }

      await fare.update({
        name: body.name,
        calculation_rule: body.calculation_rule,
        base_value: body.base_value,
        valid_from: body.valid_from,
        valid_until: body.valid_until,
        status: finalStatus,
      });

      res.status(200).json({ fare });
    } catch (error) {
      res.status(500).json({ error: "Error updating fare", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<FareI>;
      const fare = await Fare.findByPk(id);
      if (!fare) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      const finalValor = body.base_value !== undefined ? body.base_value : fare.base_value;
      const finalDesde = body.valid_from !== undefined ? body.valid_from : fare.valid_from;
      const finalHasta = body.valid_until !== undefined ? body.valid_until : fare.valid_until;
      const finalStatus = body.status !== undefined ? body.status : fare.status;

      const valError = validateBaseAndDates(finalValor, finalDesde, finalHasta);
      if (valError) {
        res.status(valError.status).json({ error: valError.message });
        return;
      }

      if (finalStatus === "active") {
        const overError = await checkOverlap(finalDesde, finalHasta, id);
        if (overError) {
          res.status(overError.status).json({ error: overError.message });
          return;
        }
      }

      await fare.update(body);
      res.status(200).json({ fare });
    } catch (error) {
      res.status(500).json({ error: "Error patching fare", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const fare = await Fare.findByPk(id);
      if (!fare) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      await fare.destroy();
      res.status(200).json({ message: "Permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting fare", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const fare = await Fare.findByPk(id);
      if (!fare) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      await fare.update({ status: "inactive" });
      res.status(200).json({ message: "Deactivated", fare });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating fare", detail: String(error) });
    }
  }
}
