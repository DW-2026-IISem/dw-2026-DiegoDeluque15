import { Request, Response } from "express";
import { Pasajero, PasajeroI } from "./pasajero.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class PasajeroController {
  // ================== READ ==================
  // (rellenar en ISS-03-B) getAll, luego getOne

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
  // (rellenar en ISS-03-C)

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
  // (rellenar en ISS-03-D)

  // ================== DELETE ==================
  // (rellenar en ISS-03-E)
}