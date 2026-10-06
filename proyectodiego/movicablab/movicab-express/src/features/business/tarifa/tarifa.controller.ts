import { Request, Response } from "express";
import { Tarifa, TarifaI } from "./tarifa.model";
import { Op } from "sequelize";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

function validateBaseAndDates(
  valor_base: number,
  vigencia_desde: Date,
  vigencia_hasta: Date
): { status: number; message: string } | null {
  if (valor_base <= 0) {
    return { status: 400, message: "valor_base must be > 0" };
  }
  if (new Date(vigencia_desde) >= new Date(vigencia_hasta)) {
    return { status: 400, message: "vigencia_desde must be strictly before vigencia_hasta" };
  }
  return null;
}

async function checkOverlap(
  vigencia_desde: Date,
  vigencia_hasta: Date,
  exclude_id?: number
): Promise<{ status: number; message: string } | null> {
  const where: any = {
    status: "active",
    [Op.or]: [
      {
        vigencia_desde: { [Op.lte]: vigencia_hasta },
        vigencia_hasta: { [Op.gte]: vigencia_desde },
      },
    ],
  };

  if (exclude_id) {
    where.id = { [Op.ne]: exclude_id };
  }

  const overlap = await Tarifa.findOne({ where });
  if (overlap) {
    return {
      status: 409,
      message: `Overlap detected with active Tarifa id=${overlap.id} [${overlap.vigencia_desde.toISOString()} - ${overlap.vigencia_hasta.toISOString()}]`,
    };
  }
  return null;
}

export class TarifaController {
  public async getVigente(req: Request, res: Response) {
    try {
      const now = new Date();
      const tarifa = await Tarifa.findOne({
        where: {
          status: "active",
          vigencia_desde: { [Op.lte]: now },
          vigencia_hasta: { [Op.gte]: now },
        },
      });
      if (!tarifa) {
        res.status(404).json({ error: "No active tarifa covers the current date" });
        return;
      }
      res.status(200).json({ tarifa });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vigente", detail: String(error) });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const tarifas = await Tarifa.findAll({ where: { status: "active" } });
      res.status(200).json({ tarifas });
    } catch (error) {
      res.status(500).json({ error: "Error fetching", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const tarifa = await Tarifa.findByPk(paramId(req));
      if (!tarifa) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json({ tarifa });
    } catch (error) {
      res.status(500).json({ error: "Error fetching", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as TarifaI;
      if (body.valor_base === undefined || !body.vigencia_desde || !body.vigencia_hasta) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const valError = validateBaseAndDates(body.valor_base, body.vigencia_desde, body.vigencia_hasta);
      if (valError) {
        res.status(valError.status).json({ error: valError.message });
        return;
      }

      if (body.status !== "inactive") {
        const overError = await checkOverlap(body.vigencia_desde, body.vigencia_hasta);
        if (overError) {
          res.status(overError.status).json({ error: overError.message });
          return;
        }
      }

      const tarifa = await Tarifa.create({
        nombre: body.nombre,
        regla_calculo: body.regla_calculo,
        valor_base: body.valor_base,
        vigencia_desde: body.vigencia_desde,
        vigencia_hasta: body.vigencia_hasta,
        status: body.status ?? "active",
      });
      res.status(201).json({ tarifa });
    } catch (error) {
      res.status(500).json({ error: "Error creating", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as TarifaI;
      const tarifa = await Tarifa.findByPk(id);
      if (!tarifa) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      if (body.valor_base === undefined || !body.vigencia_desde || !body.vigencia_hasta) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const valError = validateBaseAndDates(body.valor_base, body.vigencia_desde, body.vigencia_hasta);
      if (valError) {
        res.status(valError.status).json({ error: valError.message });
        return;
      }

      const finalStatus = body.status ?? tarifa.status;
      if (finalStatus === "active") {
        const overError = await checkOverlap(body.vigencia_desde, body.vigencia_hasta, id);
        if (overError) {
          res.status(overError.status).json({ error: overError.message });
          return;
        }
      }

      await tarifa.update({
        nombre: body.nombre,
        regla_calculo: body.regla_calculo,
        valor_base: body.valor_base,
        vigencia_desde: body.vigencia_desde,
        vigencia_hasta: body.vigencia_hasta,
        status: finalStatus,
      });

      res.status(200).json({ tarifa });
    } catch (error) {
      res.status(500).json({ error: "Error updating", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<TarifaI>;
      const tarifa = await Tarifa.findByPk(id);
      if (!tarifa) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      const finalValor = body.valor_base !== undefined ? body.valor_base : tarifa.valor_base;
      const finalDesde = body.vigencia_desde !== undefined ? body.vigencia_desde : tarifa.vigencia_desde;
      const finalHasta = body.vigencia_hasta !== undefined ? body.vigencia_hasta : tarifa.vigencia_hasta;
      const finalStatus = body.status !== undefined ? body.status : tarifa.status;

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

      await tarifa.update(body);
      res.status(200).json({ tarifa });
    } catch (error) {
      res.status(500).json({ error: "Error patching", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const tarifa = await Tarifa.findByPk(id);
      if (!tarifa) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      await tarifa.destroy();
      res.status(200).json({ message: "Permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const tarifa = await Tarifa.findByPk(id);
      if (!tarifa) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      await tarifa.update({ status: "inactive" });
      res.status(200).json({ message: "Deactivated", tarifa });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating", detail: String(error) });
    }
  }
}
