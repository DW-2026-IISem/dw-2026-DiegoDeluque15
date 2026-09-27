import { Request, Response } from "express";
import { TipoVehiculo, TipoVehiculoI } from "./tipo-vehiculo.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class TipoVehiculoController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const tipos_vehiculo = await TipoVehiculo.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ tipos_vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehiculo types", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const tipo_vehiculo = await TipoVehiculo.findByPk(id);
      if (!tipo_vehiculo) {
        res.status(404).json({ error: "Vehiculo type not found" });
        return;
      }
      res.status(200).json({ tipo_vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehiculo type", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as TipoVehiculoI;
      const tipo_vehiculo = await TipoVehiculo.create({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ tipo_vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error creating vehiculo type", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as TipoVehiculoI;
      const tipo_vehiculo = await TipoVehiculo.findByPk(id);
      if (!tipo_vehiculo) {
        res.status(404).json({ error: "Vehiculo type not found" });
        return;
      }

      await tipo_vehiculo.update({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? tipo_vehiculo.status,
      });

      res.status(200).json({ tipo_vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehiculo type (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<TipoVehiculoI>;
      const tipo_vehiculo = await TipoVehiculo.findByPk(id);
      if (!tipo_vehiculo) {
        res.status(404).json({ error: "Vehiculo type not found" });
        return;
      }

      await tipo_vehiculo.update(body);
      res.status(200).json({ tipo_vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehiculo type (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const tipo_vehiculo = await TipoVehiculo.findByPk(id);
      if (!tipo_vehiculo) {
        res.status(404).json({ error: "Vehiculo type not found" });
        return;
      }
      await tipo_vehiculo.destroy();
      res.status(200).json({ message: "Vehiculo type permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting vehiculo type", detail: String(error) });
    }
  }

  /** Eliminacion logica -> status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const tipo_vehiculo = await TipoVehiculo.findByPk(id);
      if (!tipo_vehiculo) {
        res.status(404).json({ error: "Vehiculo type not found" });
        return;
      }
      await tipo_vehiculo.update({ status: "inactive" });
      res.status(200).json({
        message: "Vehiculo type deactivated (logical delete)",
        tipo_vehiculo,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating vehiculo type", detail: String(error) });
    }
  }
}