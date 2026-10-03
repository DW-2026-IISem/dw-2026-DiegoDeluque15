import { Request, Response } from "express";
import { Pago, PagoI } from "./pago.model";
import { Carrera } from "../carrera/carrera.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  return Number(Array.isArray(raw) ? raw[0] : raw);
}

export class PagoController {
  /** GET /api/pagos */
  public async getAll(req: Request, res: Response) {
    try {
      const pagos = await Pago.findAll();
      res.status(200).json({ pagos });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pagos", detail: String(error) });
    }
  }

  /** GET /api/pagos/:id */
  public async getOne(req: Request, res: Response) {
    try {
      const pago = await Pago.findByPk(paramId(req));
      if (!pago) { res.status(404).json({ error: "Pago not found" }); return; }
      res.status(200).json({ pago });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pago", detail: String(error) });
    }
  }

  /** POST /api/pagos */
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as Pick<PagoI, "referencia_id" | "metodo">;

      if (!body.referencia_id || !body.metodo) {
        res.status(400).json({ error: "referencia_id and metodo are required" });
        return;
      }

      // Invariante 1: carrera debe existir
      const carrera = await Carrera.findByPk(body.referencia_id);
      if (!carrera) {
        res.status(404).json({ error: `Carrera with id=${body.referencia_id} not found` });
        return;
      }

      // Invariante 1b: carrera debe estar cerrada
      if (carrera.estado !== "cerrada") {
        res.status(409).json({
          error: `Carrera id=${body.referencia_id} is not 'cerrada' (current estado: '${carrera.estado}'). Only closed carreras can be paid.`,
        });
        return;
      }

      // Invariante 2: monto siempre del servidor, nunca del body
      const monto = Number(carrera.total);

      const pago = await Pago.create({
        referencia_tipo: "carrera",
        referencia_id:   body.referencia_id,
        metodo:          body.metodo,
        monto:           monto,
        fecha:           new Date(),
        estado:          "registrado",
      });

      res.status(201).json({ pago });
    } catch (error) {
      res.status(500).json({ error: "Error creating pago", detail: String(error) });
    }
  }
}
