import { Request, Response } from "express";
import { Vehiculo, VehiculoI } from "./vehiculo.model";
import { Empresa } from "../empresa/empresa.model";
import { TipoVehiculo } from "../tipo-vehiculo/tipo-vehiculo.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

/**
 * Valida empresa_id: debe existir y tener status active.
 */
async function validateEmpresaId(
  empresa_id: number
): Promise<{ status: number; message: string } | null> {
  const empresa = await Empresa.findByPk(empresa_id);
  if (!empresa) {
    return { status: 404, message: `Empresa with id=${empresa_id} not found` };
  }
  if (empresa.status !== "active") {
    return { status: 400, message: `Empresa with id=${empresa_id} is inactive` };
  }
  return null;
}

/**
 * Valida tipo_vehiculo_id: si se proporciona, debe existir (no valida status).
 */
async function validateTipoVehiculoId(
  tipo_vehiculo_id: number | null | undefined
): Promise<{ status: number; message: string } | null> {
  if (tipo_vehiculo_id === null || tipo_vehiculo_id === undefined) return null;
  const tipo = await TipoVehiculo.findByPk(tipo_vehiculo_id);
  if (!tipo) {
    return { status: 404, message: `TipoVehiculo with id=${tipo_vehiculo_id} not found` };
  }
  return null;
}

export class VehiculoController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const vehiculos = await Vehiculo.findAll({
        where: { status: "active" },
        include: [
          { association: "empresa", attributes: ["id", "nit", "razon_social"] },
          { association: "tipo", attributes: ["id", "name"] },
        ],
      });
      res.status(200).json({ vehiculos });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehiculos", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehiculo = await Vehiculo.findByPk(id, {
        include: [
          { association: "empresa", attributes: ["id", "nit", "razon_social"] },
          { association: "tipo", attributes: ["id", "name"] },
        ],
      });
      if (!vehiculo) {
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }
      res.status(200).json({ vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehiculo", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as VehiculoI;

      // empresa_id es OBLIGATORIA
      if (!body.empresa_id) {
        res.status(400).json({ error: "empresa_id is required" });
        return;
      }

      const empresaError = await validateEmpresaId(body.empresa_id);
      if (empresaError) {
        res.status(empresaError.status).json({ error: empresaError.message });
        return;
      }

      const tipoError = await validateTipoVehiculoId(body.tipo_vehiculo_id);
      if (tipoError) {
        res.status(tipoError.status).json({ error: tipoError.message });
        return;
      }

      const vehiculo = await Vehiculo.create({
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        empresa_id: body.empresa_id,
        tipo_vehiculo_id: body.tipo_vehiculo_id ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error creating vehiculo", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as VehiculoI;
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) {
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }

      if (!body.empresa_id) {
        res.status(400).json({ error: "empresa_id is required" });
        return;
      }

      const empresaError = await validateEmpresaId(body.empresa_id);
      if (empresaError) {
        res.status(empresaError.status).json({ error: empresaError.message });
        return;
      }

      const tipoError = await validateTipoVehiculoId(body.tipo_vehiculo_id);
      if (tipoError) {
        res.status(tipoError.status).json({ error: tipoError.message });
        return;
      }

      await vehiculo.update({
        nombre: body.nombre,
        descripcion: body.descripcion ?? null,
        empresa_id: body.empresa_id,
        tipo_vehiculo_id: body.tipo_vehiculo_id ?? null,
        status: body.status ?? vehiculo.status,
      });

      res.status(200).json({ vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehiculo (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<VehiculoI>;
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) {
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }

      if ("empresa_id" in body && body.empresa_id !== undefined) {
        const empresaError = await validateEmpresaId(body.empresa_id!);
        if (empresaError) {
          res.status(empresaError.status).json({ error: empresaError.message });
          return;
        }
      }

      if ("tipo_vehiculo_id" in body) {
        const tipoError = await validateTipoVehiculoId(body.tipo_vehiculo_id);
        if (tipoError) {
          res.status(tipoError.status).json({ error: tipoError.message });
          return;
        }
      }

      await vehiculo.update(body);
      res.status(200).json({ vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehiculo (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) {
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }
      await vehiculo.destroy();
      res.status(200).json({ message: "Vehiculo permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting vehiculo", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) {
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }
      await vehiculo.update({ status: "inactive" });
      res.status(200).json({
        message: "Vehiculo deactivated (logical delete)",
        vehiculo,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating vehiculo", detail: String(error) });
    }
  }
}
