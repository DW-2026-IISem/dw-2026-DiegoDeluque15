import { Request, Response } from "express";
import { TipoVehiculo, TipoVehiculoI } from "./tipo-vehiculo.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class TipoVehiculoController {
  // ================== READ ==================
  // (rellenar en ISS-06 / 11.2)

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
  // (rellenar en ISS-06 / 11.2-C)

  // ================== UPDATE ==================
  // (rellenar en ISS-06 / 11.2-D)

  // ================== DELETE ==================
  // (rellenar en ISS-06 / 11.2-E)
}