import { Request, Response } from "express";
import { Calificacion, CalificacionI } from "./calificacion.model";
import { Carrera } from "../carrera/carrera.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  return Number(Array.isArray(raw) ? raw[0] : raw);
}

export class CalificacionController {
  public async getAll(req: Request, res: Response) {
    try {
      const calificaciones = await Calificacion.findAll({ where: { status: "active" } });
      res.status(200).json({ calificaciones });
    } catch (error) {
      res.status(500).json({ error: "Error fetching calificaciones", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const calificacion = await Calificacion.findByPk(paramId(req));
      if (!calificacion) { res.status(404).json({ error: "Calificacion not found" }); return; }
      res.status(200).json({ calificacion });
    } catch (error) {
      res.status(500).json({ error: "Error fetching calificacion", detail: String(error) });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const body = req.body as CalificacionI;

      if (!body.carrera_id || body.puntaje === undefined) {
        res.status(400).json({ error: "carrera_id and puntaje are required" });
        return;
      }

      if (body.puntaje < 1 || body.puntaje > 5) {
        res.status(400).json({ error: "puntaje must be between 1 and 5" });
        return;
      }

      const carrera = await Carrera.findByPk(body.carrera_id);
      if (!carrera) {
        res.status(404).json({ error: `Carrera with id=${body.carrera_id} not found` });
        return;
      }

      if (carrera.estado !== "cerrada") {
        res.status(409).json({ error: "Carrera is not in 'cerrada' state" });
        return;
      }

      const existing = await Calificacion.findOne({ where: { carrera_id: body.carrera_id } });
      if (existing) {
        res.status(409).json({ error: "Ya existe una calificacion para esta carrera" });
        return;
      }

      const calificacion = await Calificacion.create({
        carrera_id: body.carrera_id,
        puntaje:    body.puntaje,
        comentario: body.comentario ?? null,
        status:     body.status ?? "active",
      });

      res.status(201).json({ calificacion });
    } catch (error) {
      res.status(500).json({ error: "Error creating calificacion", detail: String(error) });
    }
  }

  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as CalificacionI;
      const cal = await Calificacion.findByPk(id);
      if (!cal) { res.status(404).json({ error: "Not found" }); return; }

      if (body.puntaje === undefined || body.puntaje < 1 || body.puntaje > 5) {
        res.status(400).json({ error: "puntaje must be between 1 and 5" });
        return;
      }

      // NO permitimos cambiar de carrera_id
      await cal.update({
        puntaje:    body.puntaje,
        comentario: body.comentario,
        status:     body.status ?? cal.status,
      });

      res.status(200).json({ calificacion: cal });
    } catch (error) {
      res.status(500).json({ error: "Error updating", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<CalificacionI>;
      const cal = await Calificacion.findByPk(id);
      if (!cal) { res.status(404).json({ error: "Not found" }); return; }

      if (body.puntaje !== undefined && (body.puntaje < 1 || body.puntaje > 5)) {
        res.status(400).json({ error: "puntaje must be between 1 and 5" });
        return;
      }

      await cal.update({
        puntaje:    body.puntaje ?? cal.puntaje,
        comentario: body.comentario !== undefined ? body.comentario : cal.comentario,
        status:     body.status ?? cal.status,
      });

      res.status(200).json({ calificacion: cal });
    } catch (error) {
      res.status(500).json({ error: "Error patching", detail: String(error) });
    }
  }

  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const cal = await Calificacion.findByPk(id);
      if (!cal) { res.status(404).json({ error: "Not found" }); return; }
      await cal.destroy();
      res.status(200).json({ message: "Permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const cal = await Calificacion.findByPk(id);
      if (!cal) { res.status(404).json({ error: "Not found" }); return; }
      await cal.update({ status: "inactive" });
      res.status(200).json({ message: "Deactivated", calificacion: cal });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating", detail: String(error) });
    }
  }
}
