import { Request, Response, Router, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import HttpException from "../exceptions/httpException";
import UserService from "../services/user.service";
// import { authorizationMiddleware } from "../middlewares/authorization.middleware";

class UserController {
  constructor(private userService: UserService, router: Router) {
    router.post("/", this.createUser.bind(this));
    router.get("/", this.getAllUsers.bind(this));
    router.get("/:id", this.getUserById.bind(this));
    router.put("/:id", this.updateUser);
    router.delete("/:id", this.deleteUser);
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

  public async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
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
      const id = Number(req.params.id);
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
      const id = Number(req.params.id);
      await this.userService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
