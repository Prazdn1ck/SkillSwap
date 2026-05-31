import { Router, Response } from 'express';
import Request from '../models/Request';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { to, message } = req.body;
    if (!to) return res.status(400).json({ message: 'Recipient (to) is required' });
    if (to === req.userId) return res.status(400).json({ message: "You can't send a request to yourself" });

    const existing = await Request.findOne({ from: req.userId, to, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'You already sent a request to this user' });

    const request = await Request.create({ from: req.userId, to, message });
    await request.populate('from', 'name email');
    await request.populate('to', 'name email');
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const requests = await Request.find({ $or: [{ from: req.userId }, { to: req.userId }] })
      .populate('from', 'name email contact')
      .populate('to', 'name email contact')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Status must be "accepted" or "rejected"' });

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.to.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });

    request.status = status;
    await request.save();
    await request.populate('from', 'name email contact');
    await request.populate('to', 'name email contact');
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
