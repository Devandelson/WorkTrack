import type { Request, Response } from "express";

export default function notFoundEndpoint(req: Request, res: Response) {
  res.status(404).json({
    URL: req.url,
    message: 'La ruta establecida no fue encontrada',
  });
}
