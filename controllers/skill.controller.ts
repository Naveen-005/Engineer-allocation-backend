import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/httpException";
import { SkillService } from "../services/skill.service";


class SkillController {
  constructor(private skillService: SkillService, router: Router) {
    router.get("/", this.listSkills.bind(this));
  }

  async listSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const designations = await this.skillService.listSkills();
      res.status(200).send(designations);
    } catch (err) {
      next(err);
    }
  }

}

export default SkillController;
