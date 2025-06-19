import { Router, Request, Response, NextFunction } from "express";
import { SkillRequirementService } from "../services/skillRequirement.service";


class SkillRequirementController {
  constructor(private skillRequirementService: SkillRequirementService, router: Router) {
    router.get("/:id", this.findSkillByRequirementId.bind(this));
  }

  async findSkillByRequirementId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
      const skill = await this.skillRequirementService.findByRequirementId(id);
      res.status(200).send({"data":skill});
    } catch (err) {
      next(err);
    }
  }

}

export default SkillRequirementController;
