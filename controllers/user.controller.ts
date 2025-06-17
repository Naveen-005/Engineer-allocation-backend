import { Request, Response, Router, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import HttpException from "../exceptions/httpException";
import UserService from "../services/user.service";
import UserSkillService from "../services/userSkill.service";
import { AddUserSkillDTO } from "../dto/add-userSkill-dto";
// import { authorizationMiddleware } from "../middlewares/authorization.middleware";

//id references user_id not primary key (id)
class UserController {
  constructor(private userService: UserService,private userSkillService: UserSkillService, router: Router) {
    router.post("/", this.createUser.bind(this));
    router.get("/", this.getAllUsers.bind(this));
    router.get("/engineer", this.getAllEngineers.bind(this));
    router.get("/available", this.getAllAvailableUsers.bind(this));
    router.get("/:id", this.getUserById.bind(this));
    router.put("/:id", this.updateUser);
    router.delete("/:id", this.deleteUser);
    router.patch("/:id/skills/append", this.appendSkills);
    router.patch("/:id/experience", this.updateExperience);

    router.post("/skills/:id",this.addSkill.bind(this));
    router.delete("/skills/:id",this.removeSkill.bind(this));
    router.get("/skills/:id",this.getUserSkills.bind(this))

  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const createUserDto = plainToInstance(CreateUserDto, req.body);
      const errors = await validate(createUserDto);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }

      const user = await this.userService.createUser(createUserDto);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  public async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  public async getAllEngineers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllEngineers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  public async getAllAvailableUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users = await this.userService.getAvailableUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  public async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new HttpException(404, "User not found");
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = String(req.params.id);
      const updateUserDto = plainToInstance(UpdateUserDto, req.body);
      const errors = await validate(updateUserDto);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }

      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = String(req.params.id);
      await this.userService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  public appendSkills = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = String(req.params.id);
      const { skill_ids } = req.body;

      const user = await this.userService.appendSkillsToUser(id, skill_ids);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public updateExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = String(req.params.id);
      const { experience } = req.body;

      const user = await this.userService.updateUserExperience(id, experience);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };


  async addSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.params.id);
      //console.log("params", userId,req.body.skill_id)
      const addUserSkillDto = plainToInstance(AddUserSkillDTO, {user_id:userId,skill_id:req.body.skill_id});
      const errors = await validate(addUserSkillDto);
      if (errors.length > 0) {
        throw new HttpException(400, JSON.stringify(errors));
      }
      console.log(addUserSkillDto.user_id, addUserSkillDto.skill_id)
      const user = await this.userSkillService.addSkillToUser(addUserSkillDto.user_id, addUserSkillDto.skill_id);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
    

  async removeSkill(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      const userId = Number(req.params.id);
      const skillId = req.body.skillId;
      console.log("just inside controller")
      await this.userSkillService.removeSkillFromUser(userId, skillId);
      res.status(204).send();
    } catch (error: any) {
      next(error)
    }
  }

  async getUserSkills(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      const  userId  = Number(req.params.id);
      console.log("id from params",userId)
      const skills = await this.userSkillService.getUserSkills(userId);
      //console.log("result",skills)
      if(!skills ||skills.length==0){
        throw new HttpException(404,"No skills found");
      }
      res.status(200).json(skills);
    } catch (error: any) {
      console.log(error)
        next(error)
    }
  }



}

export default UserController;
