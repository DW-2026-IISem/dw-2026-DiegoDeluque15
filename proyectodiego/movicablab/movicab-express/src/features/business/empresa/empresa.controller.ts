import { Request, Response } from "express";
import { Empresa, EmpresaI } from "./empresa.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class EmpresaController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const empresas = await Empresa.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ empresas });
    } catch (error) {
      res.status(500).json({ error: "Error fetching empresas", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const empresa = await Empresa.findByPk(id);
      if (!empresa) {
        res.status(404).json({ error: "Empresa not found" });
        return;
      }
      res.status(200).json({ empresa });
    } catch (error) {
      res.status(500).json({ error: "Error fetching empresa", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as EmpresaI;

      // Validar nit duplicado
      const existing = await Empresa.findOne({ where: { nit: body.nit } });
      if (existing) {
        res.status(409).json({ error: "NIT already exists", nit: body.nit });
        return;
      }

      const empresa = await Empresa.create({
        nit: body.nit,
        razon_social: body.razon_social,
        contacto_principal: body.contacto_principal ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ empresa });
    } catch (error) {
      res.status(500).json({ error: "Error creating empresa", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as EmpresaI;
      const empresa = await Empresa.findByPk(id);
      if (!empresa) {
        res.status(404).json({ error: "Empresa not found" });
        return;
      }

      // Validar nit duplicado (si cambia)
      if (body.nit && body.nit !== empresa.nit) {
        const conflict = await Empresa.findOne({ where: { nit: body.nit } });
        if (conflict) {
          res.status(409).json({ error: "NIT already exists", nit: body.nit });
          return;
        }
      }

      await empresa.update({
        nit: body.nit,
        razon_social: body.razon_social,
        contacto_principal: body.contacto_principal ?? null,
        status: body.status ?? empresa.status,
      });

      res.status(200).json({ empresa });
    } catch (error) {
      res.status(500).json({ error: "Error updating empresa (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<EmpresaI>;
      const empresa = await Empresa.findByPk(id);
      if (!empresa) {
        res.status(404).json({ error: "Empresa not found" });
        return;
      }

      // Validar nit duplicado (si cambia)
      if (body.nit && body.nit !== empresa.nit) {
        const conflict = await Empresa.findOne({ where: { nit: body.nit } });
        if (conflict) {
          res.status(409).json({ error: "NIT already exists", nit: body.nit });
          return;
        }
      }

      await empresa.update(body);
      res.status(200).json({ empresa });
    } catch (error) {
      res.status(500).json({ error: "Error updating empresa (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const empresa = await Empresa.findByPk(id);
      if (!empresa) {
        res.status(404).json({ error: "Empresa not found" });
        return;
      }
      await empresa.destroy();
      res.status(200).json({ message: "Empresa permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting empresa", detail: String(error) });
    }
  }

  /** Eliminacion logica -> status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const empresa = await Empresa.findByPk(id);
      if (!empresa) {
        res.status(404).json({ error: "Empresa not found" });
        return;
      }
      await empresa.update({ status: "inactive" });
      res.status(200).json({
        message: "Empresa deactivated (logical delete)",
        empresa,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating empresa", detail: String(error) });
    }
  }
}
