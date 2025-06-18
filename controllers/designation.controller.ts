import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/httpException";
import { DesignationService } from "../services/designation.service";

class DesignationController {
  constructor(
    private designationService: DesignationService,router: Router
  ) {
    router.get("/", this.listDesignations.bind(this));
    router.get("/:id", this.getDesignationById.bind(this));
  }

  async listDesignations(req: Request, res: Response, next: NextFunction) {
    try {
      const designations = await this.designationService.listDesignations();
      res.status(200).send(designations);
    } catch (err) {
      next(err);
    }
  }

  async getDesignationById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const designation = await this.designationService.getDesignationById(id);
      if (!designation) {
        throw new HttpException(404, "Designation not found");
      }
      res.status(200).send(designation);
    } catch (err) {
      next(err);
    }
  }
}

export default DesignationController;
