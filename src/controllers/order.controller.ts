import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

/**
 * @desc   Create a new order with multiple grocery items
 * @route  POST /orders
 */
export const createOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user?.id;
        const { items } = req.body; // Expecting an array of { groceryId, quantity }
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: "Order must contain at least one item." });
            return;
        }

        // Fetch all grocery items in a single query
        const groceryIds = items.map(item => item.groceryId);
        const groceries = await prisma.grocery.findMany({
            where: { id: { in: groceryIds } },
            select: { id: true, price: true, stock: true }
        });

        // Check stock availability & calculate total price
        let totalPrice = 0;
        const orderItems = items.map(item => {
            const grocery = groceries.find(g => g.id === item.groceryId);
            if (!grocery) {
                throw new Error(`Grocery item with ID ${item.groceryId} not found.`);
            }
            if (grocery.stock < item.quantity) {
                throw new Error(`Not enough stock for grocery ID ${item.groceryId}.`);
            }
            totalPrice += grocery.price * item.quantity;
            return { groceryId: item.groceryId, quantity: item.quantity, priceAtPurchase: grocery.price };
        });

        // Create order transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    totalPrice,
                    items: { create: orderItems }
                }
            });

            // Update grocery stock
            for (const item of orderItems) {
                await tx.grocery.update({
                    where: { id: item.groceryId },
                    data: { stock: { decrement: item.quantity } } // Reduce stock
                });
            }

            return newOrder;
        });

        res.status(201).json({ message: "Order placed successfully!", order });
    } catch (error: any) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};
