import { Request, Response, Router } from "express";

const origemRouter = Router();

origemRouter.get("/", async (req: Request, res: Response) => {
    res.status(200).json({
        message: "Hello World",
    });
});

export default origemRouter;
