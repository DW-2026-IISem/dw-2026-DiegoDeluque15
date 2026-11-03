import { Request, Response } from "express";
import { Passenger, PassengerI } from "./passenger.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class PassengerController {
  public async getAll(req: Request, res: Response) {
    try {
      const passengers = await Passenger.findAll({ where: { status: "active" } });
      res.status(200).json({ passengers });
    } catch (error) {
      res.status(500).json({ error: "Error fetching passengers", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const passenger = await Passenger.findByPk(id);
      if (!passenger) {
        res.status(404).json({ error: "Passenger not found" });
        return;
      }
      res.status(200).json({ passenger });
    } catch (error) {
      res.status(500).json({ error: "Error fetching passenger", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as PassengerI;
      const passenger = await Passenger.create({
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        password: body.password,
        status: body.status ?? "inactive",
      });
      res.status(201).json({ passenger });
    } catch (error) {
      res.status(500).json({ error: "Error creating passenger", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PassengerI;
      const passenger = await Passenger.findByPk(id);
      if (!passenger) {
        res.status(404).json({ error: "Passenger not found" });
        return;
      }
      await passenger.update({
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        password: body.password,
        status: body.status ?? passenger.status,
      });
      res.status(200).json({ passenger });
    } catch (error) {
      res.status(500).json({ error: "Error updating passenger (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PassengerI>;
      const passenger = await Passenger.findByPk(id);
      if (!passenger) {
        res.status(404).json({ error: "Passenger not found" });
        return;
      }
      await passenger.update(body);
      res.status(200).json({ passenger });
    } catch (error) {
      res.status(500).json({ error: "Error updating passenger (PATCH)", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const passenger = await Passenger.findByPk(id);
      if (!passenger) {
        res.status(404).json({ error: "Passenger not found" });
        return;
      }
      await passenger.destroy();
      res.status(200).json({ message: "Passenger permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting passenger", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const passenger = await Passenger.findByPk(id);
      if (!passenger) {
        res.status(404).json({ error: "Passenger not found" });
        return;
      }
      await passenger.update({ status: "inactive" });
      res.status(200).json({ message: "Passenger deactivated (logical delete)", passenger });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating passenger", detail: String(error) });
    }
  }
}
