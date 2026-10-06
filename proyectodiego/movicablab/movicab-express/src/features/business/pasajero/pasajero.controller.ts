import { Request, Response } from "express";
import { Pasajero, PasajeroI } from "./pasajero.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class PasajeroController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const pasajeros = await Pasajero.findAll({
        where: { status: "active" },
        attributes: { exclude: ["password"] },
      });
      res.status(200).json({ pasajeros });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pasajeros", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pasajero = await Pasajero.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }
      res.status(200).json({ pasajero });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pasajero", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as PasajeroI;
      const pasajero = await Pasajero.create({
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        password: body.password,
        status: body.status ?? "active",
      });
      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(201).json({ pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error creating pasajero", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PasajeroI;
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }

      await pasajero.update({
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        password: body.password ?? pasajero.password,
        status: body.status ?? pasajero.status,
      });

      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(200).json({ pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error updating pasajero (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PasajeroI>;
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }

      await pasajero.update(body);
      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(200).json({ pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error updating pasajero (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }
      await pasajero.destroy();
      res.status(200).json({ message: "Pasajero permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting pasajero", detail: String(error) });
    }
  }

  /** Eliminacion logica: status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }
      await pasajero.update({ status: "inactive" });
      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(200).json({ message: "Pasajero deactivated (logical delete)", pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating pasajero", detail: String(error) });
    }
  }
}