
import { PrismaClient } from "@prisma/client"
import { Response, Request } from 'express';

const prisma = new PrismaClient();


export const getUserAndPoints = async (req: Request, res: Response) => {
    try{
        const users = await prisma.user.findMany({ select: {
            id: true,
            walletAddress: true,
            xp: true,
        }, orderBy: { xp: 'desc' } });
        return res.status(200).json(users);
    }
    catch(error){
        res.status(500).json(error)
    }
}    


export const getRefferalCounts = async(req: any, res: Response) => {
    const address = req.user;
    try{
        const user = await prisma.user.findFirst({ where: { walletAddress: address } });
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        // find the users joined with the referral code of the current user 
        const users = await prisma.user.findMany({ where: { referredBy: address, 
         }, select: { 
            id: true,
            walletAddress: true,
            referrals: true,
        } });
        const referrals = users.sort((a, b) => b.referrals.length - a.referrals.length);
        return res.status(200).json(referrals);
    }
    catch(error){
        res.status(500).json(error)
    }
}