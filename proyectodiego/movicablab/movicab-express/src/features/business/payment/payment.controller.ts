import { Request, Response } from "express";
import { Payment, PaymentI } from "./payment.model";
import { Trip } from "../trip/trip.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  return Number(Array.isArray(raw) ? raw[0] : raw);
}

export class PaymentController {
  /** GET /api/pagos */
  public async getAll(req: Request, res: Response) {
    try {
      const payments = await Payment.findAll();
      res.status(200).json({ payments });
    } catch (error) {
      res.status(500).json({ error: "Error fetching payments", detail: String(error) });
    }
  }

  /** GET /api/pagos/:id */
  public async getOne(req: Request, res: Response) {
    try {
      const payment = await Payment.findByPk(paramId(req));
      if (!payment) { res.status(404).json({ error: "Payment not found" }); return; }
      res.status(200).json({ payment });
    } catch (error) {
      res.status(500).json({ error: "Error fetching payment", detail: String(error) });
    }
  }

  /** POST /api/pagos */
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as Pick<PaymentI, "reference_id" | "payment_method">;

      if (!body.reference_id || !body.payment_method) {
        res.status(400).json({ error: "reference_id and payment_method are required" });
        return;
      }

      // Invariante 1: trip debe existir
      const trip = await Trip.findByPk(body.reference_id);
      if (!trip) {
        res.status(404).json({ error: `Trip with id=${body.reference_id} not found` });
        return;
      }

      // Invariante 1b: trip debe estar cerrada
      if (trip.status !== "cerrada") {
        res.status(409).json({
          error: `Trip id=${body.reference_id} is not 'cerrada' (current status: '${trip.status}'). Only closed trips can be paid.`,
        });
        return;
      }

      // Invariante 2: amount siempre del servidor, nunca del body
      const amount = Number(trip.total);

      const payment = await Payment.create({
        reference_type: "carrera",
        reference_id:   body.reference_id,
        payment_method: body.payment_method,
        amount:         amount,
        paid_at:        new Date(),
        status:         "registrado",
      });

      res.status(201).json({ payment });
    } catch (error) {
      res.status(500).json({ error: "Error creating payment", detail: String(error) });
    }
  }
}
