import { Request, Response } from "express";
import { Rating, RatingI } from "./rating.model";
import { Trip } from "../trip/trip.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  return Number(Array.isArray(raw) ? raw[0] : raw);
}

export class RatingController {
  public async getAll(req: Request, res: Response) {
    try {
      const ratings = await Rating.findAll({ where: { status: "active" } });
      res.status(200).json({ ratings });
    } catch (error) {
      res.status(500).json({ error: "Error fetching ratings", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const rating = await Rating.findByPk(paramId(req));
      if (!rating) { res.status(404).json({ error: "Rating not found" }); return; }
      res.status(200).json({ rating });
    } catch (error) {
      res.status(500).json({ error: "Error fetching rating", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as RatingI;

      if (!body.trip_id || body.score === undefined) {
        res.status(400).json({ error: "trip_id and score are required" });
        return;
      }

      if (body.score < 1 || body.score > 5) {
        res.status(400).json({ error: "score must be between 1 and 5" });
        return;
      }

      const trip = await Trip.findByPk(body.trip_id);
      if (!trip) {
        res.status(404).json({ error: `Trip with id=${body.trip_id} not found` });
        return;
      }

      if (trip.status !== "cerrada") {
        res.status(409).json({ error: "Trip is not in 'cerrada' state" });
        return;
      }

      const existing = await Rating.findOne({ where: { trip_id: body.trip_id } });
      if (existing) {
        res.status(409).json({ error: "A rating already exists for this trip" });
        return;
      }

      const rating = await Rating.create({
        trip_id: body.trip_id,
        score:   body.score,
        comment: body.comment ?? null,
        status:  body.status ?? "active",
      });

      res.status(201).json({ rating });
    } catch (error) {
      res.status(500).json({ error: "Error creating rating", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as RatingI;
      const rating = await Rating.findByPk(id);
      if (!rating) { res.status(404).json({ error: "Not found" }); return; }

      if (body.score === undefined || body.score < 1 || body.score > 5) {
        res.status(400).json({ error: "score must be between 1 and 5" });
        return;
      }

      await rating.update({
        score:   body.score,
        comment: body.comment,
        status:  body.status ?? rating.status,
      });

      res.status(200).json({ rating });
    } catch (error) {
      res.status(500).json({ error: "Error updating rating", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<RatingI>;
      const rating = await Rating.findByPk(id);
      if (!rating) { res.status(404).json({ error: "Not found" }); return; }

      if (body.score !== undefined && (body.score < 1 || body.score > 5)) {
        res.status(400).json({ error: "score must be between 1 and 5" });
        return;
      }

      await rating.update({
        score:   body.score ?? rating.score,
        comment: body.comment !== undefined ? body.comment : rating.comment,
        status:  body.status ?? rating.status,
      });

      res.status(200).json({ rating });
    } catch (error) {
      res.status(500).json({ error: "Error patching rating", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const rating = await Rating.findByPk(id);
      if (!rating) { res.status(404).json({ error: "Not found" }); return; }
      await rating.destroy();
      res.status(200).json({ message: "Permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting rating", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const rating = await Rating.findByPk(id);
      if (!rating) { res.status(404).json({ error: "Not found" }); return; }
      await rating.update({ status: "inactive" });
      res.status(200).json({ message: "Deactivated", rating });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating rating", detail: String(error) });
    }
  }
}
