import { Request, Response } from "express";
import { Conductor, ConductorI } from "./conductor.model";
import { Empresa } from "../empresa/empresa.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

/**
 * Valida empresa_id: si se proporciona, la empresa debe existir y ser active.
 * Retorna null si es valido (o no se proporciona), o un objeto { status, message } si hay error.
 */
async function validateEmpresaId(
  empresa_id: number | null | undefined
): Promise<{ status: number; message: string } | null> {
  if (empresa_id === null || empresa_id === undefined) return null;

  const empresa = await Empresa.findByPk(empresa_id);
  if (!empresa) {
    return { status: 404, message: `Empresa with id=${empresa_id} not found` };
  }
  if (empresa.status !== "active") {
    return { status: 400, message: `Empresa with id=${empresa_id} is inactive` };
  }
  return null;
}

export class ConductorController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const conductores = await Conductor.findAll({
        where: { status: "active" },
        include: [{ association: "empresa", attributes: ["id", "nit", "razon_social"] }],
      });
      res.status(200).json({ conductores });
    } catch (error) {
      res.status(500).json({ error: "Error fetching conductores", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const conductor = await Conductor.findByPk(id, {
        include: [{ association: "empresa", attributes: ["id", "nit", "razon_social"] }],
      });
      if (!conductor) {
        res.status(404).json({ error: "Conductor not found" });
        return;
      }
      res.status(200).json({ conductor });
    } catch (error) {
      res.status(500).json({ error: "Error fetching conductor", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ConductorI;

      const empresaError = await validateEmpresaId(body.empresa_id);
      if (empresaError) {
        res.status(empresaError.status).json({ error: empresaError.message });
        return;
      }

      const conductor = await Conductor.create({
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        empresa_id: body.empresa_id ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ conductor });
    } catch (error) {
      res.status(500).json({ error: "Error creating conductor", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ConductorI;
      const conductor = await Conductor.findByPk(id);
      if (!conductor) {
        res.status(404).json({ error: "Conductor not found" });
        return;
      }

      const empresaError = await validateEmpresaId(body.empresa_id);
      if (empresaError) {
        res.status(empresaError.status).json({ error: empresaError.message });
        return;
      }

      await conductor.update({
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        empresa_id: body.empresa_id ?? null,
        status: body.status ?? conductor.status,
      });

      res.status(200).json({ conductor });
    } catch (error) {
      res.status(500).json({ error: "Error updating conductor (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ConductorI>;
      const conductor = await Conductor.findByPk(id);
      if (!conductor) {
        res.status(404).json({ error: "Conductor not found" });
        return;
      }

      if ("empresa_id" in body) {
        const empresaError = await validateEmpresaId(body.empresa_id);
        if (empresaError) {
          res.status(empresaError.status).json({ error: empresaError.message });
          return;
        }
      }

      await conductor.update(body);
      res.status(200).json({ conductor });
    } catch (error) {
      res.status(500).json({ error: "Error updating conductor (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const conductor = await Conductor.findByPk(id);
      if (!conductor) {
        res.status(404).json({ error: "Conductor not found" });
        return;
      }
      await conductor.destroy();
      res.status(200).json({ message: "Conductor permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting conductor", detail: String(error) });
    }
  }

  /** Eliminacion logica -> status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const conductor = await Conductor.findByPk(id);
      if (!conductor) {
        res.status(404).json({ error: "Conductor not found" });
        return;
      }
      await conductor.update({ status: "inactive" });
      res.status(200).json({
        message: "Conductor deactivated (logical delete)",
        conductor,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating conductor", detail: String(error) });
    }
  }
}
