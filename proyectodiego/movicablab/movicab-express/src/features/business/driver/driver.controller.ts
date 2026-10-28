import { Request, Response } from "express";
import { Driver, DriverI } from "./driver.model";
import { Company } from "../company/company.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

/**
 * Validates company_id: if provided, company must exist and be active.
 */
async function validateCompanyId(
  company_id: number | null | undefined
): Promise<{ status: number; message: string } | null> {
  if (company_id === null || company_id === undefined) return null;

  const company = await Company.findByPk(company_id);
  if (!company) {
    return { status: 404, message: `Company with id=${company_id} not found` };
  }
  if (company.status !== "active") {
    return { status: 400, message: `Company with id=${company_id} is inactive` };
  }
  return null;
}

export class DriverController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const drivers = await Driver.findAll({
        where: { status: "active" },
        include: [{ association: "company", attributes: ["id", "tax_id", "legal_name"] }],
      });
      res.status(200).json({ drivers });
    } catch (error) {
      res.status(500).json({ error: "Error fetching drivers", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const driver = await Driver.findByPk(id, {
        include: [{ association: "company", attributes: ["id", "tax_id", "legal_name"] }],
      });
      if (!driver) {
        res.status(404).json({ error: "Driver not found" });
        return;
      }
      res.status(200).json({ driver });
    } catch (error) {
      res.status(500).json({ error: "Error fetching driver", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as DriverI;

      const companyError = await validateCompanyId(body.company_id);
      if (companyError) {
        res.status(companyError.status).json({ error: companyError.message });
        return;
      }

      const driver = await Driver.create({
        name: body.name,
        description: body.description ?? null,
        company_id: body.company_id ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ driver });
    } catch (error) {
      res.status(500).json({ error: "Error creating driver", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as DriverI;
      const driver = await Driver.findByPk(id);
      if (!driver) {
        res.status(404).json({ error: "Driver not found" });
        return;
      }

      const companyError = await validateCompanyId(body.company_id);
      if (companyError) {
        res.status(companyError.status).json({ error: companyError.message });
        return;
      }

      await driver.update({
        name: body.name,
        description: body.description ?? null,
        company_id: body.company_id ?? null,
        status: body.status ?? driver.status,
      });

      res.status(200).json({ driver });
    } catch (error) {
      res.status(500).json({ error: "Error updating driver (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<DriverI>;
      const driver = await Driver.findByPk(id);
      if (!driver) {
        res.status(404).json({ error: "Driver not found" });
        return;
      }

      if ("company_id" in body) {
        const companyError = await validateCompanyId(body.company_id);
        if (companyError) {
          res.status(companyError.status).json({ error: companyError.message });
          return;
        }
      }

      await driver.update(body);
      res.status(200).json({ driver });
    } catch (error) {
      res.status(500).json({ error: "Error updating driver (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const driver = await Driver.findByPk(id);
      if (!driver) {
        res.status(404).json({ error: "Driver not found" });
        return;
      }
      await driver.destroy();
      res.status(200).json({ message: "Driver permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting driver", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const driver = await Driver.findByPk(id);
      if (!driver) {
        res.status(404).json({ error: "Driver not found" });
        return;
      }
      await driver.update({ status: "inactive" });
      res.status(200).json({
        message: "Driver deactivated (logical delete)",
        driver,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating driver", detail: String(error) });
    }
  }
}
