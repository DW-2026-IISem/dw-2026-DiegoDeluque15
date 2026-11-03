import { Request, Response } from "express";
import { Company, CompanyI } from "./company.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class CompanyController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const companies = await Company.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ companies });
    } catch (error) {
      res.status(500).json({ error: "Error fetching companies", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const company = await Company.findByPk(id);
      if (!company) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      res.status(200).json({ company });
    } catch (error) {
      res.status(500).json({ error: "Error fetching company", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as CompanyI;

      const existing = await Company.findOne({ where: { tax_id: body.tax_id } });
      if (existing) {
        res.status(409).json({ error: "tax_id already exists", tax_id: body.tax_id });
        return;
      }

      const company = await Company.create({
        tax_id: body.tax_id,
        legal_name: body.legal_name,
        primary_contact: body.primary_contact ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ company });
    } catch (error) {
      res.status(500).json({ error: "Error creating company", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as CompanyI;
      const company = await Company.findByPk(id);
      if (!company) {
        res.status(404).json({ error: "Company not found" });
        return;
      }

      if (body.tax_id && body.tax_id !== company.tax_id) {
        const conflict = await Company.findOne({ where: { tax_id: body.tax_id } });
        if (conflict) {
          res.status(409).json({ error: "tax_id already exists", tax_id: body.tax_id });
          return;
        }
      }

      await company.update({
        tax_id: body.tax_id,
        legal_name: body.legal_name,
        primary_contact: body.primary_contact ?? null,
        status: body.status ?? company.status,
      });

      res.status(200).json({ company });
    } catch (error) {
      res.status(500).json({ error: "Error updating company (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<CompanyI>;
      const company = await Company.findByPk(id);
      if (!company) {
        res.status(404).json({ error: "Company not found" });
        return;
      }

      if (body.tax_id && body.tax_id !== company.tax_id) {
        const conflict = await Company.findOne({ where: { tax_id: body.tax_id } });
        if (conflict) {
          res.status(409).json({ error: "tax_id already exists", tax_id: body.tax_id });
          return;
        }
      }

      await company.update(body);
      res.status(200).json({ company });
    } catch (error) {
      res.status(500).json({ error: "Error updating company (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const company = await Company.findByPk(id);
      if (!company) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      await company.destroy();
      res.status(200).json({ message: "Company permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting company", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const company = await Company.findByPk(id);
      if (!company) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      await company.update({ status: "inactive" });
      res.status(200).json({
        message: "Company deactivated (logical delete)",
        company,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating company", detail: String(error) });
    }
  }
}
